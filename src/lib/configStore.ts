import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'

/**
 * 配置持久化：以本地 JSON 文件为唯一真源（/api/config），localStorage 只做首屏缓存。
 *
 * - 挂载时先用 localStorage 渲染，避免主题 / 皮肤闪一下默认值；
 * - 随后异步拉取文件，文件里的值覆盖内存状态（文件优先）；
 * - 每次用户改动：立刻写 localStorage + 200ms 防抖写文件；
 * - 接口不可用（静态部署、file:// 预览）时自动降级为纯 localStorage。
 */

export type StorageMode = 'reading' | 'file' | 'local'

export interface StorageStatus {
  mode: StorageMode
  /** 服务端返回的配置文件相对路径，降级时为空 */
  file: string
  /** 最近一次写入失败的原因 */
  error: string | null
}

type Values = Record<string, unknown>

const API = '/api/config'
const WRITE_DELAY = 200
/** 本标签页标识：用来忽略自己写入触发的广播，避免旧回声把新输入盖掉 */
const CLIENT_ID = Math.random().toString(36).slice(2, 10)

let mode: StorageMode = 'reading'
let filePath = ''
let remoteValues: Values = {}
let revision = 0
let writeError: string | null = null
let hydrated: Promise<void> | null = null
let hmrBound = false

const storeListeners = new Set<() => void>()
const timers = new Map<string, number>()
const queued = new Map<string, unknown>()

function bump() {
  revision += 1
  for (const listener of storeListeners) listener()
}

function subscribe(listener: () => void) {
  storeListeners.add(listener)
  return () => {
    storeListeners.delete(listener)
  }
}

const snapshot = () => revision

function same(a: unknown, b: unknown) {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** 存储值叠在默认值之上：对象做浅合并，其余直接替换 */
function mergeWithDefault<T>(fallback: T, stored: unknown): T {
  if (isPlainObject(fallback) && isPlainObject(stored)) return { ...fallback, ...stored } as T
  return stored as T
}

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw !== null) return mergeWithDefault(fallback, JSON.parse(raw))
  } catch {
    /* 忽略：隐私模式 / 损坏的缓存 */
  }
  return fallback
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 忽略配额错误 */
  }
}

function flush(key: string) {
  const timer = timers.get(key)
  if (timer !== undefined) {
    window.clearTimeout(timer)
    timers.delete(key)
  }
  if (!queued.has(key)) return
  const value = queued.get(key)
  queued.delete(key)
  if (mode !== 'file') return

  fetch(API, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ key, value, clientId: CLIENT_ID }),
    keepalive: true,
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      if (writeError) {
        writeError = null
        bump()
      }
    })
    .catch((error: unknown) => {
      writeError = error instanceof Error ? error.message : '写入本地文件失败'
      bump()
    })
}

function queueWrite(key: string, value: unknown) {
  queued.set(key, value)
  const timer = timers.get(key)
  if (timer !== undefined) window.clearTimeout(timer)
  timers.set(key, window.setTimeout(() => flush(key), WRITE_DELAY))
}

function bindHmr() {
  if (hmrBound) return
  hmrBound = true
  const hot = import.meta.hot
  if (!hot) return
  // 其他标签页写入后，服务端会广播新值，这里直接套用，不用刷新
  hot.on(
    'motionkit:config',
    (payload: { key?: string; value?: unknown; removed?: boolean; clientId?: string }) => {
      if (!payload || typeof payload.key !== 'string') return
      // 自己写的回声忽略：本地状态已经是最新的，回声可能比新输入更旧
      if (payload.clientId === CLIENT_ID) return
      if (payload.removed) delete remoteValues[payload.key]
      else remoteValues[payload.key] = payload.value
      writeLocal(payload.key, payload.value)
      bump()
    },
  )
}

async function hydrate() {
  try {
    const res = await fetch(API, { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { file?: string; values?: Values }
    if (!data || !isPlainObject(data.values)) throw new Error('unexpected payload')

    remoteValues = data.values
    filePath = typeof data.file === 'string' ? data.file : ''
    mode = 'file'
    // 文件是唯一真源：回填缓存，下次首屏直接命中
    for (const [key, value] of Object.entries(remoteValues)) writeLocal(key, value)

    window.addEventListener('pagehide', () => {
      for (const key of [...queued.keys()]) flush(key)
    })
    bindHmr()
  } catch {
    // 没有本地接口（静态部署、非 Vite 环境）时退化为浏览器存储
    mode = 'local'
  }
  bump()
}

export function ensureHydrated() {
  if (!hydrated) hydrated = hydrate()
  return hydrated
}

export function usePersistentState<T>(key: string, initial: T) {
  const initialRef = useRef(initial)
  initialRef.current = initial

  const rev = useSyncExternalStore(subscribe, snapshot, snapshot)
  const [value, setValue] = useState<T>(() => readLocal(key, initial))
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    void ensureHydrated()
  }, [])

  // 文件里的值到达（或别的标签页改了）→ 覆盖本地状态
  useEffect(() => {
    if (mode !== 'file') return
    const stored = remoteValues[key]
    if (stored === undefined) return
    const merged = mergeWithDefault(initialRef.current, stored)
    if (same(valueRef.current, merged)) return
    valueRef.current = merged
    writeLocal(key, merged)
    setValue(merged)
  }, [rev, key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = valueRef.current
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      if (same(prev, resolved)) return
      valueRef.current = resolved
      setValue(resolved)
      writeLocal(key, resolved)
      if (mode === 'file') {
        remoteValues[key] = resolved
        queueWrite(key, resolved)
      }
    },
    [key],
  )

  return [value, set] as const
}

export function useStorageStatus(): StorageStatus {
  const rev = useSyncExternalStore(subscribe, snapshot, snapshot)
  return useMemo(() => ({ mode, file: filePath, error: writeError }), [rev])
}

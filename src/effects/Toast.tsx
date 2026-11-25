import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num, str } from '../lib/utils'
import './Toast.css'

type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  kind: ToastKind
  title: string
  desc: string
  leaving?: boolean
}

interface Timing {
  handle: number
  remaining: number
  startedAt: number
}

const PRESETS: Record<ToastKind, { title: string; desc: string }> = {
  success: { title: '保存成功', desc: '你的更改已同步到云端' },
  error: { title: '网络异常', desc: '连接中断，请稍后重试' },
  info: { title: '已复制', desc: '内容已放入剪贴板' },
}

const KINDS: ToastKind[] = ['success', 'error', 'info']

export default function ToastDemo({ params, replay }: DemoProps) {
  const position = str(params.position, 'top') === 'bottom' ? 'bottom' : 'top'
  const duration = num(params.duration, 3000)
  const variant = str(params.variant, 'solid') === 'glass' ? 'glass' : 'solid'
  const pause = bool(params.pause, true)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const itemsRef = useRef<ToastItem[]>([])
  const timers = useRef<Map<number, Timing>>(new Map())
  const exits = useRef<Set<number>>(new Set())
  const seq = useRef(0)

  const clearAll = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t.handle))
    timers.current.clear()
    exits.current.forEach((handle) => window.clearTimeout(handle))
    exits.current.clear()
  }, [])

  const remove = useCallback((id: number) => {
    const timing = timers.current.get(id)
    if (timing) {
      window.clearTimeout(timing.handle)
      timers.current.delete(id)
    }
    const leaving = itemsRef.current.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    itemsRef.current = leaving
    setToasts(leaving)
    const handle = window.setTimeout(() => {
      exits.current.delete(handle)
      const rest = itemsRef.current.filter((t) => t.id !== id)
      itemsRef.current = rest
      setToasts(rest)
    }, 240)
    exits.current.add(handle)
  }, [])

  const arm = useCallback(
    (id: number, remaining: number) => {
      const handle = window.setTimeout(() => remove(id), remaining)
      timers.current.set(id, { handle, remaining, startedAt: Date.now() })
    },
    [remove],
  )

  const push = (kind: ToastKind) => {
    const id = ++seq.current
    const preset = PRESETS[kind]
    const next = [...itemsRef.current, { id, kind, title: preset.title, desc: preset.desc }]
    const overflow = next.length > 3 ? next.slice(0, next.length - 3) : []
    overflow.forEach((t) => {
      const timing = timers.current.get(t.id)
      if (timing) {
        window.clearTimeout(timing.handle)
        timers.current.delete(t.id)
      }
    })
    const kept = next.slice(-3)
    itemsRef.current = kept
    setToasts(kept)
    arm(id, duration)
  }

  const hold = (id: number) => {
    if (!pause) return
    const timing = timers.current.get(id)
    if (!timing || timing.handle === 0) return
    window.clearTimeout(timing.handle)
    const remaining = Math.max(0, timing.remaining - (Date.now() - timing.startedAt))
    timers.current.set(id, { ...timing, handle: 0, remaining })
  }

  const release = (id: number) => {
    if (!pause) return
    const timing = timers.current.get(id)
    if (!timing || timing.handle !== 0) return
    arm(id, timing.remaining)
  }

  useEffect(() => {
    clearAll()
    itemsRef.current = []
    setToasts([])
  }, [replay, clearAll])

  useEffect(() => () => clearAll(), [clearAll])

  const vars = {
    '--toast-duration': `${duration}ms`,
    '--toast-from': position === 'top' ? '-22px' : '22px',
  } as React.CSSProperties

  return (
    <div className="toast-demo" style={vars}>
      <div className="toast-panel">
        <span className="toast-panel__tag">NOTIFICATION / CENTER</span>
        <h3 className="toast-panel__title">轻提示控制台</h3>
        <p className="toast-panel__desc">触发不同类型的提示，观察滑入、停留与自动消失。</p>
        <div className="toast-panel__actions">
          {KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              className={`toast-trigger toast-trigger--${kind}`}
              onClick={() => push(kind)}
            >
              {PRESETS[kind].title}
            </button>
          ))}
        </div>
        <div className="toast-panel__meta">
          <span>位置 <b>{position === 'top' ? '顶部' : '底部'}</b></span>
          <span>样式 <b>{variant === 'glass' ? '毛玻璃' : '实色'}</b></span>
          <span>停留 <b>{duration}ms</b></span>
        </div>
      </div>

      <div className={`toast-stack toast-stack--${position}${pause ? ' can-pause' : ''}`}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item toast-item--${t.kind} toast-item--${variant}${t.leaving ? ' is-leaving' : ''}`}
            onMouseEnter={() => hold(t.id)}
            onMouseLeave={() => release(t.id)}
          >
            <span className="toast-item__dot" />
            <div className="toast-item__body">
              <b className="toast-item__title">{t.title}</b>
              <span className="toast-item__desc">{t.desc}</span>
            </div>
            <span className="toast-item__progress" />
          </div>
        ))}
      </div>

      <p className="demo-hint">点击按钮触发 Toast · 悬停暂停倒计时 · 最多同时显示 3 条</p>
    </div>
  )
}

/**
 * MotionKit 本地配置存储（Vite 中间件）
 *
 *   GET    /api/config            → { file, version, updatedAt, values }
 *   PUT    /api/config            → { key, value } 或 { values: {...} }，落盘后返回
 *   DELETE /api/config?key=xxx    → 删除某个键
 *
 * 所有配置统一存进项目根目录下的 JSON 文件（默认 .motionkit/config.json），
 * 写入走「临时文件 + rename」，避免进程中断留下半截 JSON。
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_FILE = '.motionkit/config.json'
const DEFAULT_ROUTE = '/api/config'
const MAX_BODY = 2 * 1024 * 1024

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (!chunks.length) return resolve({})
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function createStore(root, file) {
  const target = path.resolve(root, file)
  const blank = () => ({ version: 1, updatedAt: null, values: {} })
  let queue = Promise.resolve()

  async function read() {
    let raw
    try {
      raw = await readFile(target, 'utf8')
    } catch {
      return blank()
    }
    try {
      const parsed = JSON.parse(raw)
      const values =
        parsed && typeof parsed === 'object' && parsed.values && typeof parsed.values === 'object'
          ? parsed.values
          : {}
      return {
        version: Number(parsed?.version) || 1,
        updatedAt: typeof parsed?.updatedAt === 'string' ? parsed.updatedAt : null,
        values,
      }
    } catch {
      // 文件被手改坏：先备份，再按空配置继续，避免下一次写入把用户内容彻底覆盖
      const backup = `${target}.corrupt-${Date.now()}`
      await rename(target, backup).catch(() => {})
      return blank()
    }
  }

  function write(values) {
    const next = { version: 1, updatedAt: new Date().toISOString(), values }
    const run = queue.then(async () => {
      await mkdir(path.dirname(target), { recursive: true })
      const tmp = `${target}.${process.pid}.tmp`
      await writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
      await rename(tmp, target)
    })
    // 队列自身吞掉异常，否则一次失败会让后续所有写入都被拒绝
    queue = run.catch(() => {})
    return { next, done: run }
  }

  return { read, write, target }
}

/**
 * @param {{ file?: string, route?: string }} [options]
 */
export default function localConfigStore(options = {}) {
  const file = options.file ?? DEFAULT_FILE
  const route = options.route ?? DEFAULT_ROUTE
  let store = null
  let broadcast = null

  const attach = (server, send) => {
    store = createStore(server.config.root, file)
    broadcast = send
  }

  const handler = async (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://motionkit.local')
    if (url.pathname !== route) return next()
    if (!store) return sendJson(res, 503, { error: 'store not ready' })

    try {
      if (req.method === 'GET' || req.method === 'HEAD') {
        const { values, updatedAt, version } = await store.read()
        return sendJson(res, 200, { file, version, updatedAt, values })
      }

      if (req.method === 'PUT' || req.method === 'POST' || req.method === 'PATCH') {
        const body = await readBody(req)
        const patch =
          body && typeof body.values === 'object' && body.values !== null
            ? body.values
            : typeof body?.key === 'string'
              ? { [body.key]: body.value }
              : null
        if (!patch) return sendJson(res, 400, { error: 'expected { key, value } or { values }' })

        const current = await store.read()
        const values = { ...current.values, ...patch }
        const { next, done } = store.write(values)
        await done
        const clientId = typeof body?.clientId === 'string' ? body.clientId : undefined
        for (const [key, value] of Object.entries(patch)) broadcast?.({ key, value, clientId })
        return sendJson(res, 200, { ok: true, updatedAt: next.updatedAt, values: patch })
      }

      if (req.method === 'DELETE') {
        const key = url.searchParams.get('key')
        if (!key) return sendJson(res, 400, { error: 'missing key' })
        const current = await store.read()
        const values = { ...current.values }
        delete values[key]
        const { next, done } = store.write(values)
        await done
        broadcast?.({ key, value: null, removed: true })
        return sendJson(res, 200, { ok: true, updatedAt: next.updatedAt })
      }

      return sendJson(res, 405, { error: 'method not allowed' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error'
      return sendJson(res, 500, { error: message })
    }
  }

  const mount = (server) => {
    attach(server, (data) => server.ws?.send?.({ type: 'custom', event: 'motionkit:config', data }))
    server.middlewares.use(handler)
  }

  return {
    name: 'motionkit:local-config-store',
    configureServer: mount,
    configurePreviewServer: mount,
  }
}

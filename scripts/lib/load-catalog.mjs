import { build } from 'esbuild'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

/**
 * 用 esbuild 把 catalog.ts 打成一个可被 Node 直接 import 的模块，
 * 这样脚本拿到的就是「运行时真实使用的同一份数据」，不需要手写解析或复制。
 */
export async function loadCatalog() {
  const outfile = path.join(root, 'node_modules/.tmp/motionkit-catalog.mjs')
  await build({
    entryPoints: [path.join(root, 'src/lib/catalog.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node18',
    outfile,
    logLevel: 'silent',
  })
  const mod = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`)
  if (!Array.isArray(mod.catalog)) throw new Error('catalog 导出异常：期望 EffectMeta[]')
  return { catalog: mod.catalog, categoryLabel: mod.categoryLabel ?? {}, root }
}

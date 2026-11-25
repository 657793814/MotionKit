#!/usr/bin/env node
/**
 * 把 src/lib/catalog.ts 生成成两份「可被别的 AI / 人直接读」的清单：
 *
 *   docs/EFFECTS.md    人 & LLM 阅读：速查表 + 每个特效的用法与参数
 *   docs/effects.json  程序阅读：结构化元数据
 *
 * 用法：
 *   node scripts/gen-effects-docs.mjs          生成 / 覆盖
 *   node scripts/gen-effects-docs.mjs --check  只校验是否最新（CI 用，落后则 exit 1）
 *
 * 由 npm run docs、predev、prebuild 调用，生成物禁止手改。
 */
import { existsSync } from 'node:fs'
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadCatalog, root } from './lib/load-catalog.mjs'

const CHECK = process.argv.includes('--check')
const SOFT = process.env.npm_lifecycle_event === 'predev'

const { catalog, categoryLabel } = await loadCatalog()

/* ---------------------------------------------------------------- 注册表 */

const registryPath = path.join(root, 'src/effects/index.ts')
const registrySource = await readFile(registryPath, 'utf8')
const registryBlock = registrySource.slice(registrySource.indexOf('export const demos'))
const demos = new Map()
for (const m of registryBlock.matchAll(/^\s+(\w+):\s*(\w+),?$/gm)) demos.set(m[1], m[2])
if (demos.size === 0) throw new Error('未能从 src/effects/index.ts 解析出 demos 注册表')

const unregistered = catalog.filter((e) => !demos.get(e.id))
if (unregistered.length) {
  console.warn(
    `⚠ ${unregistered.length} 个动效没有在 src/effects/index.ts 注册：` +
      unregistered.map((e) => e.id).join('、'),
  )
}
const missingFiles = [...demos.values()].filter(
  (name) => !existsSync(path.join(root, 'src/effects', `${name}.tsx`)),
)
if (missingFiles.length) console.warn(`⚠ 注册了但没有组件文件：${missingFiles.join('、')}`)

/* ------------------------------------------------------------ 引用位置扫描 */

const srcFiles = (await readdir(path.join(root, 'src'), { recursive: true }))
  .filter((f) => /\.(tsx?|jsx?)$/.test(f))
  .map((f) => path.join('src', f))

const usageByComponent = new Map()
for (const rel of srcFiles) {
  const source = await readFile(path.join(root, rel), 'utf8')
  for (const m of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    const from = m[1]
    if (!from.startsWith('.')) continue
    const resolved = path.posix.normalize(
      path.posix.join(path.posix.dirname(rel.replaceAll('\\', '/')), from).replace(/\.(tsx?|jsx?)$/, ''),
    )
    const hit = /^src\/effects\/(.+)$/.exec(resolved)
    if (!hit) continue
    const name = hit[1].split('/').pop()
    if (!usageByComponent.has(name)) usageByComponent.set(name, new Set())
    usageByComponent.get(name).add(rel)
  }
}

/* ---------------------------------------------------------------- 工具函数 */

const ordered = [...catalog].sort((a, b) => a.index - b.index)

const cell = (value) => String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ')

const fmtValue = (value) => (typeof value === 'string' ? `'${value}'` : String(value))

const fmtRange = (p) => {
  if (Array.isArray(p.options) && p.options.length) {
    return p.options.map((o) => `${o.label}=${o.value}`).join(' / ')
  }
  if (typeof p.min === 'number' && typeof p.max === 'number') {
    const step = typeof p.step === 'number' ? `，步长 ${p.step}` : ''
    return `${p.min} – ${p.max}${p.unit ? p.unit : ''}${step}`
  }
  return '—'
}

const componentFile = (name) => {
  if (!name) return null
  return `src/effects/${name}.tsx`
}

const categoriesOrder = []
for (const effect of ordered) {
  if (!categoriesOrder.includes(effect.category)) categoriesOrder.push(effect.category)
}

/* ------------------------------------------------------------------- JSON */

const json = {
  $comment:
    '自动生成，请勿手改。数据源 src/lib/catalog.ts + src/effects/index.ts，运行 npm run docs 重新生成。',
  count: ordered.length,
  categories: categoriesOrder.map((id) => ({
    id,
    label: categoryLabel[id] ?? id,
    count: ordered.filter((e) => e.category === id).length,
  })),
  effects: ordered.map((e) => {
    const component = demos.get(e.id) ?? null
    return {
      id: e.id,
      index: e.index,
      name: e.name,
      en: e.en,
      tagline: e.tagline,
      description: e.description,
      category: e.category,
      categoryLabel: categoryLabel[e.category] ?? e.category,
      tags: e.tags,
      useCases: e.useCases,
      keywords: e.keywords,
      tip: e.tip,
      component: component
        ? {
            export: component,
            path: componentFile(component),
            registry: 'src/effects/index.ts',
            importedBy: [...(usageByComponent.get(component) ?? [])].sort(),
          }
        : null,
      params: e.params.map((p) => ({
        key: p.key,
        label: p.label,
        type: p.type,
        default: p.default,
        ...(p.min !== undefined ? { min: p.min } : {}),
        ...(p.max !== undefined ? { max: p.max } : {}),
        ...(p.step !== undefined ? { step: p.step } : {}),
        ...(p.unit !== undefined ? { unit: p.unit } : {}),
        ...(p.options ? { options: p.options } : {}),
        ...(p.hint ? { hint: p.hint } : {}),
      })),
    }
  }),
}

/* --------------------------------------------------------------- Markdown */

const lines = []
const push = (...rows) => lines.push(...rows)

push(
  '# 动效清单（MotionKit）',
  '',
  '> ⚠️ 本文件由 `npm run docs` 从 `src/lib/catalog.ts` 自动生成，**请勿手动编辑**。',
  '> 新增或修改特效后执行 `npm run docs`；`npm run dev` / `npm run build` 也会自动执行。',
  '',
  `当前收录 **${ordered.length}** 个动效，分 ${categoriesOrder.length} 类。程序可读版本见 [\`docs/effects.json\`](./effects.json)。`,
  '',
  '## 怎么用',
  '',
  '1. 在下面「速查表」里按场景找 id；不确定时跑 `npm run find -- 关键词`（如 `npm run find -- 弹窗 毛玻璃`）。',
  '2. 组件在 `src/effects/<组件名>.tsx`，样式是同目录同名 `.css`。',
  '3. 所有动效组件统一签名 `DemoProps`：',
  '',
  '```ts',
  'interface DemoProps {',
  '  params: Params                          // 键见下方每个动效的参数表',
  '  replay: number                          // 传入自增值即可重播动画',
  '  onParamChange?: (key: string, value: string | number | boolean) => void',
  '  onReplay?: () => void',
  '}',
  '```',
  '',
  '4. 接入示例：',
  '',
  '```tsx',
  "import Spotlight from './effects/Spotlight'",
  '',
  '<Spotlight params={{ size: 280, opacity: 0.28, color: "#3b82f6", edge: true }} replay={0} />',
  '```',
  '',
  '> 想直接抄走可粘贴的完整代码（含 CSS），在应用内打开对应动效页 → 「代码」面板；`catalog.ts` 里每个特效的 `code(params)` 就是这段生成器。',
  '',
  '## 速查表',
  '',
  '| # | id | 名称 | 分类 | 一句话 | 典型场景 |',
  '| --- | --- | --- | --- | --- | --- |',
)

for (const e of ordered) {
  push(
    `| ${String(e.index).padStart(2, '0')} | \`${e.id}\` | ${cell(e.name)} | ${cell(categoryLabel[e.category] ?? e.category)} | ${cell(e.tagline)} | ${cell(e.useCases.slice(0, 3).join(' / '))} |`,
  )
}
push('')

for (const categoryId of categoriesOrder) {
  const group = ordered.filter((e) => e.category === categoryId)
  push(`## ${categoryLabel[categoryId] ?? categoryId}（${categoryId}）· ${group.length} 个`, '')

  for (const e of group) {
    const component = demos.get(e.id) ?? null
    const usage = component ? [...(usageByComponent.get(component) ?? [])].sort() : []
    push(
      `### ${String(e.index).padStart(2, '0')} · ${e.name} \`${e.id}\``,
      '',
      `${e.en}　·　${categoryLabel[e.category] ?? e.category}` +
        (component ? `　·　\`${componentFile(component)}\`` : '　·　⚠️ 未在 demos 注册'),
      '',
      `> ${e.tagline}`,
      '',
      cell(e.description),
      '',
      `- **标签**：${e.tags.join(' · ')}`,
      `- **适用场景**：${e.useCases.join(' · ')}`,
      `- **实现提示**：${cell(e.tip)}`,
      `- **被引用**：${usage.length ? usage.map((u) => `\`${u}\``).join('、') : '仅注册表引用'}`,
      '',
    )

    if (e.params.length) {
      push('| 参数 | 名称 | 类型 | 默认 | 范围 / 选项 |', '| --- | --- | --- | --- | --- |')
      for (const p of e.params) {
        push(
          `| \`${p.key}\` | ${cell(p.label)} | ${p.type} | \`${fmtValue(p.default)}\` | ${cell(fmtRange(p))} |`,
        )
      }
      const hints = e.params.filter((p) => p.hint)
      if (hints.length) {
        push('')
        for (const p of hints) push(`- \`${p.key}\`：${cell(p.hint)}`)
      }
      push('')
    } else {
      push('无参数。', '')
    }

    if (component) {
      const defaultParams = Object.fromEntries(e.params.map((p) => [p.key, p.default]))
      const shorthand = Object.entries(defaultParams)
        .map(([k, v]) => `${k}: ${fmtValue(v)}`)
        .join(', ')
      push(
        '```tsx',
        `import ${component} from './effects/${component}'`,
        '',
        `<${component} params={{ ${shorthand} }} replay={0} />`,
        '```',
        '',
      )
    }
  }
}

push(
  '---',
  '',
  `共 ${ordered.length} 个动效。新增或修改动效请遵循 [AGENTS.md §5《新增 / 修改动效的规约》](../AGENTS.md)，` +
    '改完跑 `npm run docs` 重新生成本文件（`docs:check` 会校验是否落后）。',
  '',
)

const markdown = `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`
const jsonText = `${JSON.stringify(json, null, 2)}\n`

/* --------------------------------------------------- README 概览表（可选） */

const README_BEGIN = '<!-- effects:table:begin -->'
const README_END = '<!-- effects:table:end -->'

const readmeBlock = [
  README_BEGIN,
  `<!-- 由 npm run docs 自动生成，请勿手改这两行标记之间的内容 -->`,
  '',
  `共 **${ordered.length}** 个动效，分 ${categoriesOrder.length} 类：`,
  '',
  '| 分类 | 数量 | 代表动效 |',
  '| --- | --- | --- |',
  ...categoriesOrder.map((id) => {
    const group = ordered.filter((e) => e.category === id)
    const names = group.slice(0, 3).map((e) => e.name)
    const suffix = group.length > 3 ? '…' : ''
    return `| ${cell(categoryLabel[id] ?? id)} | ${group.length} | ${names.join('、')}${suffix} |`
  }),
  '',
  README_END,
].join('\n')

async function buildReadme() {
  const file = path.join(root, 'README.md')
  const source = await readFile(file, 'utf8').catch(() => null)
  if (!source) return null
  const start = source.indexOf(README_BEGIN)
  const end = source.indexOf(README_END)
  if (start === -1 || end === -1 || end < start) return null
  return `${source.slice(0, start)}${readmeBlock}${source.slice(end + README_END.length)}`
}

/* ----------------------------------------------------------------- 写入 */

async function emit(relPath, content) {
  const full = path.join(root, relPath)
  const previous = await readFile(full, 'utf8').catch(() => null)
  if (previous === content) return 'unchanged'
  if (CHECK) return previous === null ? 'missing' : 'stale'
  await mkdir(path.dirname(full), { recursive: true })
  await writeFile(full, content, 'utf8')
  return previous === null ? 'created' : 'updated'
}

try {
  const results = []
  results.push(['docs/EFFECTS.md', await emit('docs/EFFECTS.md', markdown)])
  results.push(['docs/effects.json', await emit('docs/effects.json', jsonText)])

  const readme = await buildReadme()
  if (readme !== null) results.push(['README.md', await emit('README.md', readme)])

  const problems = results.filter(([, state]) => state === 'stale' || state === 'missing')
  if (CHECK && problems.length) {
    console.error('✗ 特效清单已落后于 catalog：')
    for (const [file, state] of problems) console.error(`  - ${file}（${state === 'missing' ? '缺失' : '内容过期'}）`)
    console.error('  运行 `npm run docs` 重新生成后再提交。')
    process.exit(1)
  }

  for (const [file, state] of results) {
    if (state !== 'unchanged') console.log(`  ${state.padEnd(8)} ${file}`)
  }
  if (!CHECK) console.log(`✓ 特效清单已同步（${ordered.length} 个动效）`)
} catch (error) {
  if (SOFT) {
    console.warn('[motionkit] 跳过特效清单生成：', error instanceof Error ? error.message : error)
    process.exit(0)
  }
  throw error
}

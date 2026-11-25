#!/usr/bin/env node
/**
 * 按关键词查动效：给「我想做个 X，库里有现成的吗」这类问题一个命令行入口。
 *
 *   npm run find -- 弹窗 毛玻璃
 *   npm run find -- 数字 滚动
 *
 * 命中范围：id / 中英文名 / 标签 / 关键词 / 适用场景 / 一句话 / 描述。
 */
import { loadCatalog } from './lib/load-catalog.mjs'

const terms = process.argv.slice(2).filter((a) => !a.startsWith('-'))

if (!terms.length) {
  console.log('用法：npm run find -- <关键词> [关键词2 ...]')
  console.log('例如：npm run find -- 弹窗 毛玻璃')
  process.exit(0)
}

const { catalog, categoryLabel } = await loadCatalog()

const score = (effect, term) => {
  const t = term.toLowerCase()
  const has = (value) => String(value ?? '').toLowerCase().includes(t)
  let total = 0
  if (has(effect.id) || has(effect.name) || has(effect.en)) total += 6
  if (effect.tags.some(has)) total += 4
  if (effect.keywords.some(has)) total += 4
  if (effect.useCases.some(has)) total += 3
  if (has(effect.tagline)) total += 2
  if (has(effect.description)) total += 1
  return total
}

const hits = catalog
  .map((effect) => ({ effect, total: terms.reduce((sum, term) => sum + score(effect, term), 0) }))
  .filter((row) => row.total > 0)
  .sort((a, b) => b.total - a.total || a.effect.index - b.effect.index)

if (!hits.length) {
  console.log(`没有匹配「${terms.join(' ')}」的动效。`)
  console.log('试试更泛的词：鼠标 / 滚动 / 文字 / 数据 / 弹窗 / 玻璃 / 边框 / 组件')
  process.exit(0)
}

console.log(`匹配「${terms.join(' ')}」的动效 ${hits.length} 个：\n`)
for (const { effect, total } of hits.slice(0, 12)) {
  const label = categoryLabel[effect.category] ?? effect.category
  console.log(`  ${String(effect.index).padStart(2, '0')}  ${effect.id.padEnd(16)} ${effect.name}`)
  console.log(`      ${label} · ${effect.tagline}`)
  console.log(`      场景：${effect.useCases.join(' / ')}　得分 ${total}`)
  console.log('')
}
if (hits.length > 12) console.log(`…… 另有 ${hits.length - 12} 个弱相关结果，建议加关键词缩小范围。`)
console.log('完整清单：docs/EFFECTS.md')

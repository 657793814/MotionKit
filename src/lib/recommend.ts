import { catalog } from './catalog'
import type { CategoryId, EffectMeta } from './types'
import { clamp } from './utils'

export interface Recommendation {
  id: string
  score: number
  reason: string
  matched: string[]
}

export interface RecommendResult {
  summary: string
  results: Recommendation[]
}

export interface AIConfig {
  enabled: boolean
  baseUrl: string
  apiKey: string
  model: string
  /** 自定义系统提示词（可选）。留空时使用内置默认系统提示词。 */
  promptTemplate: string
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  enabled: false,
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
  promptTemplate:
    '你是一位资深 UI 动效顾问，帮助产品经理和设计师从固定动效库中挑选最合适的交互效果。\n' +
    '你只能推荐下面列出的动效，不能编造 id：\n\n' +
    '请根据用户描述推荐 3-4 个最合适的动效，按匹配度排序。评分 0-100 表示与需求的契合程度。\n' +
    'reason 用一句中文说明为什么推荐，必须结合用户描述中的具体场景，不超过 60 字。\n' +
    '只输出 JSON，不要输出 Markdown 或任何解释，格式为：\n' +
    '{"summary":"一句整体建议","recommendations":[{"id":"effect-id","score":92,"reason":"推荐理由"}]}',
}

const categoryCues: { words: string[]; category: CategoryId }[] = [
  { words: ['鼠标', '悬停', 'hover', '指针', '靠近', '拖拽', '交互', '点击'], category: 'pointer' },
  { words: ['滚动', '下滑', '往下滑', '滑到', '长页面', '首屏', '落地页', '官网', '视差', '叙事'], category: 'scroll' },
  { words: ['文字', '标题', '文案', '打字', '字符', '对话', '终端', '解码'], category: 'text' },
  { words: ['数据', '数字', '统计', '加载', '骨架', '高光', '边框', '公告', '跑马灯', '流光', '扫描'], category: 'data' },
  { words: ['回弹', '弹性', '曲线', '缓动', '入场', '顺序', '节奏', '自然', '动画基础'], category: 'base' },
  {
    words: ['纸飞机', '发送', '分享', '长按', '快捷菜单', '手风琴', '问答', '展开答案', '多选', '操作栏', '步进器', '数量', '翻面', '翻转', '筛选标签', '步骤', '进度条', '勾选', '列表'],
    category: 'component',
  },
  {
    words: ['液态玻璃', '玻璃', 'glass', '折射', '色散', '果冻', '放大镜', '胶囊', '标签栏指示', '细白边', '真折射'],
    category: 'glass',
  },
  {
    words: ['弹窗', '提示框', '模态', '对话框', '确认', '轻提示', 'toast', '抽屉', '气泡', '浮层', '通知', '底部面板', '底部弹出', 'glass', '玻璃', '折射', '半透明', '提示组件'],
    category: 'overlay',
  },
]

const genericFallback = ['spotlight', 'reveal', 'hoverLift', 'easing']

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim()

function scoreEffect(effect: EffectMeta, q: string) {
  const matched = new Set<string>()
  let score = 0

  if (q.includes(effect.name)) {
    score += 8
    matched.add(effect.name)
  }
  if (q.includes(effect.en.toLowerCase())) {
    score += 6
    matched.add(effect.en)
  }
  if (q.includes(effect.tagline)) score += 4

  for (const tag of effect.tags) {
    if (q.includes(tag.toLowerCase())) {
      score += 3
      matched.add(tag)
    }
  }
  for (const useCase of effect.useCases) {
    if (q.includes(useCase.toLowerCase())) {
      score += 4
      matched.add(useCase)
    }
  }
  for (const keyword of effect.keywords) {
    if (q.includes(keyword.toLowerCase())) {
      score += 1.8 + Math.min(2.2, keyword.length * 0.45)
      matched.add(keyword)
    }
  }
  for (const cue of categoryCues) {
    if (cue.words.some((w) => q.includes(w))) {
      if (cue.category === effect.category) score += 2.2
      break
    }
  }
  return { score, matched: [...matched] }
}

export function recommendLocal(query: string): RecommendResult {
  const q = normalize(query)
  const scored = catalog.map((effect) => ({ effect, ...scoreEffect(effect, q) }))
  scored.sort((a, b) => b.score - a.score)

  const hasSignal = scored.some((s) => s.score >= 3)
  const picked = (hasSignal ? scored.filter((s) => s.score > 0) : scored.filter((s) => genericFallback.includes(s.effect.id))).slice(0, 4)
  const max = picked[0]?.score ?? 0

  const results: Recommendation[] = picked.map((item, i) => {
    const score = hasSignal
      ? Math.round(clamp(58 + (item.score / Math.max(1, max)) * 38 - i * 2, 55, 98))
      : 84 - i * 6
    const reasons = item.matched.slice(0, 3)
    const reason = hasSignal
      ? reasons.length
        ? `匹配到「${reasons.join('」「')}」，适合${item.effect.useCases[0]}等场景。`
        : `整体语义与该动效的用途最为接近。`
      : `没有识别到明确关键词，先推荐通用且不易出错的动效。`
    return { id: item.effect.id, score, reason, matched: reasons }
  })

  const summary = hasSignal
    ? `根据「${query.trim().slice(0, 36)}${query.trim().length > 36 ? '…' : ''}」为你筛选了 ${results.length} 个动效，点击即可打开实时演示。`
    : '描述里还没有识别到明确的动效关键词。可以补一句使用场景，或先看看这几个通用选择。'

  return { summary, results }
}

function buildCatalogDigest() {
  return catalog
    .map((e) => `- ${e.id} | ${e.name} (${e.en}) | ${e.tagline} | 标签: ${e.tags.join('、')} | 场景: ${e.useCases.join('、')}`)
    .join('\n')
}

/** 组装系统提示词：用户自定义模板优先，默认模板 + 动效清单 + 输出格式要求。 */
function buildSystemPrompt(template: string) {
  const tpl = template.trim()
  const body = [
    tpl && tpl.trim() ? tpl.trim() : DEFAULT_AI_CONFIG.promptTemplate,
    buildCatalogDigest(),
    '请根据用户描述推荐 3-4 个最合适的动效，按匹配度排序。评分 0-100 表示与需求的契合程度。\n' +
      'reason 用一句中文说明为什么推荐，必须结合用户描述中的具体场景，不超过 60 字。\n' +
      '只输出 JSON，不要输出 Markdown 或任何解释，格式为：\n' +
      '{"summary":"一句整体建议","recommendations":[{"id":"effect-id","score":92,"reason":"推荐理由"}]}',
  ].join('\n\n')
  return body
}

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1] : text
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start >= 0 && end > start) return body.slice(start, end + 1)
  return body.trim()
}

export async function recommendWithAI(query: string, config: AIConfig, signal?: AbortSignal): Promise<RecommendResult> {
  const base = config.baseUrl.trim().replace(/\/+$/, '')
  if (!base) throw new Error('请先填写 API Base URL')
  const model = config.model.trim()
  if (!model) throw new Error('请先填写模型名称')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (config.apiKey.trim()) headers.Authorization = `Bearer ${config.apiKey.trim()}`

  const system = buildSystemPrompt(config.promptTemplate)

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `用户描述：${query.trim()}` },
      ],
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`接口返回 ${res.status}${detail ? ` · ${detail.slice(0, 160)}` : ''}`)
  }

  const data = await res.json()
  const content: string = data?.choices?.[0]?.message?.content ?? ''
  if (!content) throw new Error('模型没有返回内容，请检查模型名称或接口格式')

  let parsed: any
  try {
    parsed = JSON.parse(extractJSON(content))
  } catch {
    throw new Error('模型返回的不是合法 JSON，请重试或换一个模型')
  }

  const list = Array.isArray(parsed?.recommendations) ? parsed.recommendations : []
  const results: Recommendation[] = list
    .map((item: any) => {
      const effect = catalog.find((e) => e.id === item?.id)
      if (!effect) return null
      const score = clamp(Math.round(Number(item?.score) || 80), 1, 100)
      return {
        id: effect.id,
        score,
        reason: String(item?.reason || effect.tagline).slice(0, 120),
        matched: effect.tags.slice(0, 2),
      }
    })
    .filter(Boolean)
    .slice(0, 4) as Recommendation[]

  if (!results.length) throw new Error('模型没有推荐出有效的动效，请重试')

  return {
    summary: String(parsed?.summary || '模型已根据你的描述完成选型。').slice(0, 160),
    results,
  }
}

export const EXAMPLE_PROMPTS = [
  '做一个分享行程按钮，点击时按钮轻压，纸飞机从按钮内飞出并显示发送中，随后切换为已分享状态。',
  '做一个卡片长按菜单，长按时卡片浮起并展开快捷操作，选择后收起菜单并恢复卡片。',
  '做一个手风琴问答列表，点击问题时答案平滑展开并推开下方内容，打开另一项时自动收起之前的答案。',
  '做一个多选列表，选中项目时显示底部操作栏和已选数量，选择变化时同步更新，全部取消后收起操作栏。',
  '做一个数量步进器，点击加减时数字纵向滚动切换，按钮轻微回弹，数量不能小于零。',
  '做一张可点击翻面的卡片，沿竖轴旋转切换正反两面，再次点击时翻回，旋转过程中隐藏背面镜像。',
  '做一个搜索结果筛选栏，点击标签时选中底色平滑移动，结果列表淡出并依次显示对应内容。',
  '做一个步骤进度条，完成当前步骤后圆点切换为对勾，连接线逐段填充，下一步高亮并更新说明。',
  '官网首屏想要科技感，文字先乱码再还原',
  '功能介绍页面很长，希望滚动时内容逐段淡入',
  '数据看板上的营收数字要有滚动增长的感觉',
  '卡片悬停时轻轻抬起，暗示可以点击',
  '定价卡要突出“推荐”，边框有一道光在流动',
  'AI 对话界面，回复的文字逐字出现',
  '滚动时背景固定，逐章切换产品卖点',
  '按钮要有被鼠标吸过去的磁性反馈',
  '做一个客户 Logo 横向循环滚动的品牌墙',
  '加载时用高光扫过的骨架屏',
  '删除操作需要二次确认，做一个模态对话框',
  '保存成功后给一个 3 秒自动消失的轻提示',
  '详情页从右侧滑出抽屉，保留列表上下文',
  '做一个苹果风格的液态玻璃卡片，带折射和高光',
]

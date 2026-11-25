import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { DemoProps } from '../lib/types'
import { hexToRgba, num, str } from '../lib/utils'
import './SearchFilter.css'

type FilterKey = 'all' | 'interaction' | 'text' | 'data' | 'motion'
type Phase = 'in' | 'out'

interface FilterTab {
  key: FilterKey
  label: string
}

interface ResultItem {
  id: string
  title: string
  desc: string
  tag: string
}

const TABS: FilterTab[] = [
  { key: 'all', label: '全部' },
  { key: 'interaction', label: '交互' },
  { key: 'text', label: '文字' },
  { key: 'data', label: '数据' },
  { key: 'motion', label: '动效' },
]

const RESULTS: Record<FilterKey, ResultItem[]> = {
  all: [
    { id: 'a1', title: '弹性卡片入场', desc: '缩放与透明度组合，带回弹曲线', tag: '交互' },
    { id: 'a2', title: '逐项淡入列表', desc: '基于索引的错峰延迟动画', tag: '文字' },
    { id: 'a3', title: '实时数据跳数', desc: '数值插值渲染，带千分位格式', tag: '数据' },
    { id: 'a4', title: '描边路径绘制', desc: 'stroke-dasharray 控制绘制进度', tag: '动效' },
  ],
  interaction: [
    { id: 'i1', title: '按钮磁吸跟随', desc: '指针靠近时产生轻微位移牵引', tag: '交互' },
    { id: 'i2', title: '卡片悬浮抬升', desc: '阴影与位移同步响应悬停状态', tag: '交互' },
    { id: 'i3', title: '3D 倾斜透视', desc: '根据指针位置调整旋转角度', tag: '交互' },
    { id: 'i4', title: '抽屉侧滑展开', desc: '边缘吸附与阻尼回弹效果', tag: '交互' },
  ],
  text: [
    { id: 't1', title: '文字解码还原', desc: '从乱码逐帧收敛到目标文案', tag: '文字' },
    { id: 't2', title: '打字机光标', desc: '按字符节奏输出并闪烁光标', tag: '文字' },
    { id: 't3', title: '跑马灯滚动', desc: '无缝首尾衔接的横向循环', tag: '文字' },
  ],
  data: [
    { id: 'd1', title: '数字滚动计数', desc: '从零插值到目标值的缓出动画', tag: '数据' },
    { id: 'd2', title: '视差滚动层', desc: '多层级按速率差产生纵深', tag: '数据' },
    { id: 'd3', title: '进度环绘制', desc: 'SVG 环形轨迹随数据增长', tag: '数据' },
  ],
  motion: [
    { id: 'm1', title: '弹簧物理曲线', desc: '可调刚度与阻尼的自然回弹', tag: '动效' },
    { id: 'm2', title: '缓动函数对照', desc: '并排展示不同贝塞尔曲线', tag: '动效' },
    { id: 'm3', title: '边界光晕扫过', desc: '沿边框循环流动的高光', tag: '动效' },
  ],
}

export default function SearchFilterDemo({ params, replay }: DemoProps) {
  const indicator = str(params.indicator, 'slide') === 'spring' ? 'spring' : 'slide'
  const fade = num(params.fade, 280)
  const stagger = num(params.stagger, 80)
  const accent = str(params.accent, '#3b82f6')

  const [active, setActive] = useState<FilterKey>('all')
  const [shown, setShown] = useState<FilterKey>('all')
  const [phase, setPhase] = useState<Phase>('in')
  const [cycle, setCycle] = useState(0)
  const [query, setQuery] = useState('')
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const timer = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const measure = useCallback(() => {
    const index = TABS.findIndex((tab) => tab.key === active)
    const el = tabRefs.current[index]
    if (!el) return
    setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true })
  }, [active])

  useLayoutEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const reset = useCallback(() => {
    clearTimer()
    setActive('all')
    setShown('all')
    setPhase('in')
    setQuery('')
    setCycle((n) => n + 1)
  }, [clearTimer])

  useEffect(() => {
    reset()
  }, [replay, reset])

  useEffect(() => () => clearTimer(), [clearTimer])

  const switchTo = (key: FilterKey) => {
    if (key === active) return
    clearTimer()
    setActive(key)
    setPhase('out')
    timer.current = window.setTimeout(() => {
      setShown(key)
      setCycle((n) => n + 1)
      setPhase('in')
      timer.current = null
    }, fade)
  }

  const keyword = query.trim().toLowerCase()
  const results = RESULTS[shown].filter(
    (item) => !keyword || `${item.title} ${item.desc} ${item.tag}`.toLowerCase().includes(keyword),
  )

  const vars = {
    '--sf-accent': accent,
    '--sf-accent-soft': hexToRgba(accent, 0.16),
    '--sf-accent-glow': hexToRgba(accent, 0.5),
    '--sf-fade': `${fade}ms`,
    '--sf-stagger': `${stagger}ms`,
    '--sf-ease':
      indicator === 'spring'
        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        : 'cubic-bezier(0.22, 1, 0.36, 1)',
  } as CSSProperties

  return (
    <div className="sf-demo" style={vars}>
      <div className="sf-panel">
        <span className="sf-panel__tag">LIBRARY / DISCOVER</span>
        <h3 className="sf-panel__title">动效检索</h3>

        <label className="sf-search">
          <svg className="sf-search__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.3" />
            <path d="M15.4 15.4 20 20" />
          </svg>
          <input
            className="sf-search__input"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索动效…"
            aria-label="搜索动效"
          />
          {query && (
            <button
              type="button"
              className="sf-search__clear"
              onClick={() => setQuery('')}
              aria-label="清空搜索"
            >
              ×
            </button>
          )}
        </label>

        <div className="sf-tabs" role="tablist" aria-label="筛选分类">
          <span
            className="sf-pill"
            style={{ left: pill.left, width: pill.width, opacity: pill.ready ? 1 : 0 }}
            aria-hidden="true"
          />
          {TABS.map((tab, index) => (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              type="button"
              role="tab"
              aria-selected={active === tab.key}
              className={'sf-tab' + (active === tab.key ? ' is-active' : '')}
              onClick={() => switchTo(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="sf-panel__head">
          <span>RESULTS</span>
          <b>{results.length} 条结果</b>
        </div>

        <div className={`sf-list sf-phase-${phase}`} key={cycle}>
          {results.length > 0 ? (
            results.map((item, index) => (
              <div
                className="sf-item"
                key={item.id}
                style={{ '--sf-i': index } as CSSProperties}
              >
                <span className="sf-item__mark" />
                <div className="sf-item__body">
                  <b>{item.title}</b>
                  <span>{item.desc}</span>
                </div>
                <span className="sf-item__tag">{item.tag}</span>
              </div>
            ))
          ) : (
            <div className="sf-empty">没有匹配的结果，试试其他关键词</div>
          )}
        </div>
      </div>

      <p className="demo-hint">切换标签看胶囊指示器移动与结果逐项淡入 · 输入关键词可实时过滤</p>
    </div>
  )
}

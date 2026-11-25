import type { DemoProps } from '../lib/types'
import { num } from '../lib/utils'
import './HoverLift.css'

const cards = [
  {
    icon: '◈',
    tag: 'FOUNDATION',
    title: '组件规范',
    desc: '统一的间距、圆角与色彩变量，让界面从第一行代码开始就保持一致。',
    meta: '24 个基础组件',
  },
  {
    icon: '◐',
    tag: 'BEHAVIOR',
    title: '交互模式',
    desc: '把动效参数沉淀为可复用的行为，而不是散落在每个页面里的魔法数字。',
    meta: '35 种动效预设',
  },
  {
    icon: '◍',
    tag: 'DELIVERY',
    title: '交付流程',
    desc: '从设计稿到代码，节奏与细节保持同步，评审时不再靠口头描述动画。',
    meta: '设计 / 开发同源',
  },
]

export default function HoverLiftDemo({ params }: DemoProps) {
  const lift = num(params.lift, 8)
  const scale = num(params.scale, 1.02)
  const shadow = num(params.shadow, 0.5)
  const duration = num(params.duration, 280)

  return (
    <div className="lift-demo">
      <div
        className="lift-grid"
        style={
          {
            '--lift': `${lift}px`,
            '--lift-scale': scale,
            '--lift-shadow': shadow,
            '--lift-duration': `${duration}ms`,
          } as React.CSSProperties
        }
      >
        {cards.map((c, i) => (
          <a key={c.title} className="lift-card" href="#lift" onClick={(e) => e.preventDefault()}>
            <div className="lift-card__top">
              <span className="lift-card__icon">{c.icon}</span>
              <span className="lift-card__no">0{i + 1}</span>
            </div>
            <span className="lift-card__tag">{c.tag}</span>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
            <div className="lift-card__foot">
              <span>{c.meta}</span>
              <em>查看 →</em>
            </div>
            <span className="lift-card__shine" />
          </a>
        ))}
      </div>
      <p className="demo-hint">悬停任意卡片 · 抬起 {lift}px 并加深阴影</p>
    </div>
  )
}

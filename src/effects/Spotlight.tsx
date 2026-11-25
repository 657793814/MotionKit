import { useRef } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, hexToRgba, num, str } from '../lib/utils'
import './Spotlight.css'

export default function SpotlightDemo({ params }: DemoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const size = num(params.size, 280)
  const opacity = num(params.opacity, 0.28)
  const color = str(params.color, '#3b82f6')
  const edge = bool(params.edge, true)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div className="spot-demo">
      <div className="spot-demo__glow" style={{ background: hexToRgba(color, 0.16) }} />
      <div
        ref={ref}
        className={'spot-card' + (edge ? ' has-edge' : '')}
        onPointerMove={onMove}
        style={
          {
            '--spot-size': `${size}px`,
            '--spot': hexToRgba(color, opacity),
            '--spot-line': hexToRgba(color, 0.55),
          } as React.CSSProperties
        }
      >
        <div className="spot-card__top">
          <div className="spot-card__icon">✦</div>
          <span className="spot-card__chip">AI NATIVE</span>
        </div>
        <h3 className="spot-card__title">智能工作流</h3>
        <p className="spot-card__desc">把鼠标移到卡片上，让光晕跟着你的指针，把注意力自然地带到重点信息上。</p>
        <ul className="spot-card__list">
          <li><i>01</i> 自动理解任务上下文</li>
          <li><i>02</i> 可回滚的执行步骤</li>
          <li><i>03</i> 结果可验证、可追溯</li>
        </ul>
        <button className="spot-card__cta" type="button">
          开始使用 <span>→</span>
        </button>
        <div className="spot-card__corner">v2.4</div>
      </div>
      <p className="demo-hint">移动鼠标 · 观察光晕与边框高光</p>
    </div>
  )
}

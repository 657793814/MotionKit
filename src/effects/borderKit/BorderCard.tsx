import type { CSSProperties } from 'react'
import { hexToRgba } from '../../lib/utils'
import './BorderCard.css'

export type BorderVariant = 'flow' | 'neon' | 'fade' | 'dust' | 'nebula' | 'scan'

export interface BorderCardProps {
  variant: BorderVariant
  speed: number
  thickness: number
  radius: number
  colors: string[]
  glow: number
  gap?: number
  hint: string
  badge?: string
  title?: string
}

/**
 * 六种边框动效共用的卡片外壳。
 * 边框做法统一：外层 .bx 用 padding 让出描边宽度，.bx__ring 负责画光，
 * .bx__card 用不透明背景把中间盖住，只留下 padding 那一圈。
 * 每种变体只替换 .bx__ring::before / ::after 与 .bx__aura 的绘制方式。
 */
export default function BorderCard({
  variant,
  speed,
  thickness,
  radius,
  colors,
  glow,
  gap = 10,
  hint,
  badge = 'LIVE',
  title = 'AURORA',
}: BorderCardProps) {
  const [c1 = '#3b82f6', c2 = '#22d3ee', c3 = '#a78bfa', c4 = '#f472b6'] = colors

  const style = {
    '--bx-speed': `${speed}s`,
    '--bx-thick': `${thickness}px`,
    '--bx-radius': `${radius}px`,
    '--bx-c1': c1,
    '--bx-c2': c2,
    '--bx-c3': c3,
    '--bx-c4': c4,
    '--bx-c1-soft': hexToRgba(c1, 0.12),
    '--bx-glow': glow,
    '--bx-gap': `${gap}deg`,
  } as CSSProperties

  return (
    <div className={`bx-stage bx-stage--${variant}`}>
      <div className="bx" style={style}>
        <span className="bx__aura" aria-hidden="true" />
        <span className="bx__ring" aria-hidden="true" />
        <div className="bx__card">
          <div className="bx__head">
            <span className="bx__brand">
              {title}
              <i>®</i>
            </span>
            <span className="bx__badge">{badge}</span>
          </div>
          <p className="bx__kicker">Team plan</p>
          <p className="bx__price">
            <i>¥</i>128<em>/ 月</em>
          </p>
          <p className="bx__desc">为动效团队准备的一站式样式工作台</p>
          <ul className="bx__list">
            <li>
              <b />
              40+ 可交互动效配方
            </li>
            <li>
              <b />
              参数、皮肤统一管理
            </li>
            <li>
              <b />
              一键导出 React + CSS
            </li>
          </ul>
          <button className="bx__cta" type="button">
            开始使用 <span>→</span>
          </button>
        </div>
        <span className="bx__spark" aria-hidden="true" />
      </div>
      <p className="demo-hint">{hint}</p>
    </div>
  )
}

import { useRef } from 'react'
import type { DemoProps } from '../lib/types'
import { clamp, num } from '../lib/utils'
import './Magnetic.css'

export default function MagneticDemo({ params }: DemoProps) {
  const field = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const aura = useRef<HTMLDivElement>(null)
  const strength = num(params.strength, 0.35)
  const range = num(params.range, 300)
  const duration = num(params.duration, 450)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = btn.current
    const area = field.current
    if (!el || !area) return
    const r = el.getBoundingClientRect()
    const dx = clamp(e.clientX - (r.left + r.width / 2), -160, 160)
    const dy = clamp(e.clientY - (r.top + r.height / 2), -120, 120)
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`)
    if (aura.current) {
      const fr = area.getBoundingClientRect()
      aura.current.style.transform = `translate(${e.clientX - fr.left - 100}px, ${e.clientY - fr.top - 100}px)`
      aura.current.style.opacity = '1'
    }
  }

  const reset = () => {
    if (btn.current) {
      btn.current.style.transform = 'translate(0, 0)'
      btn.current.style.setProperty('--gx', '50%')
      btn.current.style.setProperty('--gy', '50%')
    }
    if (aura.current) aura.current.style.opacity = '0'
  }

  return (
    <div className="mag-demo">
      <div
        ref={field}
        className="mag-field"
        style={{ '--mag-range': `${range}px` } as React.CSSProperties}
        onPointerMove={onMove}
        onPointerLeave={reset}
      >
        <div className="mag-orbit mag-orbit--outer" />
        <div className="mag-orbit mag-orbit--inner" />
        <div className="mag-axis mag-axis--x" />
        <div className="mag-axis mag-axis--y" />
        <div ref={aura} className="mag-aura" />
        <button
          ref={btn}
          className="mag-btn"
          style={{ '--mag-duration': `${duration}ms` } as React.CSSProperties}
          type="button"
        >
          <span className="mag-btn__shine" />
          <span className="mag-btn__label">开始创造</span>
          <span className="mag-btn__arrow">→</span>
        </button>
        <span className="mag-tag mag-tag--tl">MAGNETIC</span>
        <span className="mag-tag mag-tag--br">FIELD 01</span>
      </div>
      <p className="demo-hint">把鼠标靠近按钮 · 离开后自动复位</p>
    </div>
  )
}

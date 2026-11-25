import { useRef } from 'react'
import type { DemoProps } from '../lib/types'
import { num } from '../lib/utils'
import './Tilt3D.css'

export default function Tilt3DDemo({ params }: DemoProps) {
  const card = useRef<HTMLDivElement>(null)
  const max = num(params.max, 10)
  const perspective = num(params.perspective, 1000)
  const scale = num(params.scale, 1.02)
  const glare = num(params.glare, 0.45)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * max * 2
    const ry = (px - 0.5) * max * 2
    el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }

  const reset = () => {
    const el = card.current
    if (!el) return
    el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
    el.style.setProperty('--gx', '50%')
    el.style.setProperty('--gy', '50%')
  }

  return (
    <div className="tilt-demo">
      <div
        className="tilt-stage"
        style={{ perspective: `${perspective}px` } as React.CSSProperties}
      >
        <div
          ref={card}
          className="tilt-card"
          onPointerMove={onMove}
          onPointerLeave={reset}
          style={{ '--tilt-glare': glare } as React.CSSProperties}
        >
          <div className="tilt-card__stars" />
          <div className="tilt-card__glare" />
          <div className="tilt-card__ring" />
          <div className="tilt-card__top">
            <span className="tilt-card__brand">NOVA</span>
            <span className="tilt-card__chip">MEMBER · 04</span>
          </div>
          <div className="tilt-card__mid">
            <div>
              <span className="tilt-card__label">ORBITAL PASS</span>
              <strong>极光会员</strong>
            </div>
            <span className="tilt-card__orb">✦</span>
          </div>
          <div className="tilt-card__bottom">
            <span>NO. 0042 8831</span>
            <span>VALID 12 / 28</span>
          </div>
        </div>
        <div className="tilt-shadow" />
      </div>
      <p className="demo-hint">在卡片上移动鼠标 · 最大倾角 {max}°</p>
    </div>
  )
}

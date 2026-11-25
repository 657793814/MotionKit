import { useEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { clamp, num } from '../lib/utils'
import './Spring.css'

export default function SpringDemo({ params, replay }: DemoProps) {
  const stage = useRef<HTMLDivElement>(null)
  const ball = useRef<HTMLDivElement>(null)
  const ghosts = useRef<(HTMLDivElement | null)[]>([])
  const offsetRef = useRef<HTMLSpanElement>(null)
  const velocityRef = useRef<HTMLSpanElement>(null)
  const state = useRef({ x: -150, v: 0 })
  const drag = useRef({
    active: false,
    startX: 0,
    base: 0,
    lastX: 0,
    lastT: 0,
    limit: 200,
    moved: false,
  })
  const history = useRef<number[]>([])
  const [grabbing, setGrabbing] = useState(false)

  const stiffness = num(params.stiffness, 170)
  const damping = num(params.damping, 14)
  const mass = num(params.mass, 1)
  const trail = params.trail !== false

  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  const overshoot = zeta < 1 ? Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)) * 100 : 0
  const status = zeta < 0.98 ? '欠阻尼' : zeta > 1.02 ? '过阻尼' : '临界阻尼'

  useEffect(() => {
    state.current = { x: -150, v: 0 }
    history.current = []
  }, [replay])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let frame = 0

    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const s = state.current

      if (!drag.current.active) {
        // 胡克定律 + 阻尼力，逐步积分
        const force = -stiffness * s.x - damping * s.v
        s.v += (force / mass) * dt
        s.x += s.v * dt
        if (Math.abs(s.x) < 0.03 && Math.abs(s.v) < 0.03) {
          s.x = 0
          s.v = 0
        }
      }

      if (ball.current) {
        ball.current.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`
      }

      const h = history.current
      h.push(s.x)
      if (h.length > 48) h.shift()
      ghosts.current.forEach((el, i) => {
        if (!el) return
        const idx = h.length - 1 - (i + 1) * 5
        const value = h[Math.max(0, idx)] ?? s.x
        if (trail && Math.abs(s.v) > 12) {
          el.style.transform = `translate3d(${value.toFixed(2)}px, 0, 0)`
          el.style.opacity = String(Math.max(0, 0.24 - i * 0.05))
        } else {
          el.style.opacity = '0'
        }
      })

      frame++
      if (frame % 3 === 0) {
        if (offsetRef.current) {
          offsetRef.current.textContent = `${s.x >= 0 ? '+' : ''}${s.x.toFixed(0)}px`
        }
        if (velocityRef.current) {
          velocityRef.current.textContent = `${Math.abs(s.v).toFixed(0)} px/s`
        }
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [stiffness, damping, mass, trail])

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    drag.current = {
      active: true,
      startX: e.clientX,
      base: state.current.x,
      lastX: e.clientX,
      lastT: performance.now(),
      limit: rect.width / 2 - 44,
      moved: false,
    }
    state.current.v = 0
    history.current = []
    e.currentTarget.setPointerCapture(e.pointerId)
    setGrabbing(true)
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active) return
    const s = state.current
    const next = clamp(d.base + (e.clientX - d.startX), -d.limit, d.limit)
    const now = performance.now()
    const dt = Math.max(4, now - d.lastT)
    s.v = ((next - s.x) / dt) * 1000 * 0.75
    s.x = next
    if (Math.abs(e.clientX - d.startX) > 3) d.moved = true
    d.lastX = e.clientX
    d.lastT = now
  }

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    setGrabbing(false)
    if (!d.moved) {
      const rect = e.currentTarget.getBoundingClientRect()
      const dir = e.clientX < rect.left + rect.width / 2 ? 1 : -1
      state.current.v += dir * 880
    }
  }

  return (
    <div className="spring-demo">
      <div
        ref={stage}
        className={'spring-stage' + (grabbing ? ' is-grabbing' : '')}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="spring-grid" />
        <div className="spring-target">
          <span />
        </div>
        <div className="spring-rail">
          <i /><i /><i /><i /><i />
        </div>
        <div className="spring-scale">
          <span>-100</span>
          <span>0</span>
          <span>+100</span>
        </div>
        <div className="spring-ghosts">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="spring-ghost"
              ref={(el) => {
                ghosts.current[i] = el
              }}
            />
          ))}
        </div>
        <div ref={ball} className="spring-ball">
          <span className="spring-ball__shine" />
          <span className="spring-ball__label">SPRING</span>
        </div>
        <div className="spring-live">
          <span>位移 <b ref={offsetRef}>-150px</b></span>
          <span>速度 <b ref={velocityRef}>0 px/s</b></span>
        </div>
      </div>

      <div className="spring-metrics">
        <div>
          <span>阻尼比 ζ</span>
          <b>{zeta.toFixed(2)}</b>
          <em>{status}</em>
        </div>
        <div>
          <span>理论回弹</span>
          <b>{overshoot.toFixed(1)}%</b>
          <em>{zeta >= 1 ? '不会越过目标' : '越过目标后收敛'}</em>
        </div>
        <div>
          <span>操作</span>
          <b className="spring-metrics__hint">拖动小球</b>
          <em>松手后回弹</em>
        </div>
      </div>
      <p className="demo-hint">按住小球左右拖动 · 松手观察回弹 · 轻点舞台也可施力</p>
    </div>
  )
}

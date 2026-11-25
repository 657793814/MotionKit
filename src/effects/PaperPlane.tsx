import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num } from '../lib/utils'
import './PaperPlane.css'

type Phase = 'idle' | 'flying' | 'sent'

const STEPS = 24
const TRAIL_DOTS = 4

/** 二次贝塞尔采样：控制点位于起点/终点中点上方 arc 处，形成抛物线弧线。 */
function flightFrames(dx: number, dy: number, arc: number): Keyframe[] {
  const cx = dx / 2
  const cy = dy / 2 - arc
  const frames: Keyframe[] = []
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    // smoothstep 让起步与落地更柔和，同时保持偏移等距
    const u = t * t * (3 - 2 * t)
    const v = 1 - u
    const x = 2 * v * u * cx + u * u * dx
    const y = 2 * v * u * cy + u * u * dy
    const tx = 2 * (v * cx + u * (dx - cx))
    const ty = 2 * (v * cy + u * (dy - cy))
    const angle = (Math.atan2(ty, tx) * 180) / Math.PI
    frames.push({
      offset: t,
      transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg)`,
    })
  }
  return frames
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21.4 3.2 2.7 10.1c-.8.3-.8 1.4 0 1.7l6.4 2.3 2.3 6.4c.3.8 1.4.8 1.7 0l6.9-18.7c.3-.8-.5-1.5-1.3-1.2Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path d="m9.1 14.1 4.6-4.6" stroke="rgba(255,255,255,.55)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

export default function PaperPlaneDemo({ params, replay }: DemoProps) {
  const pressScale = num(params.pressScale, 0.92)
  const flight = num(params.flight, 700)
  const arc = num(params.arc, 90)
  const trail = bool(params.trail, true)

  const [phase, setPhase] = useState<Phase>('idle')
  const [pressing, setPressing] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([])
  const anims = useRef<Animation[]>([])
  const pressTimer = useRef<number | undefined>(undefined)

  const cancelFlight = useCallback(() => {
    anims.current.forEach((animation) => animation.cancel())
    anims.current = []
    if (pressTimer.current !== undefined) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = undefined
    }
  }, [])

  const reset = useCallback(() => {
    cancelFlight()
    setPressing(false)
    setPhase('idle')
  }, [cancelFlight])

  useEffect(() => {
    reset()
  }, [replay, reset])

  useEffect(() => () => cancelFlight(), [cancelFlight])

  useLayoutEffect(() => {
    if (phase !== 'flying') return
    const stage = stageRef.current
    const button = buttonRef.current
    const target = targetRef.current
    const plane = planeRef.current
    if (!stage || !button || !target || !plane) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPressing(false)
      setPhase('sent')
      return
    }

    const s = stage.getBoundingClientRect()
    const b = button.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    const sx = b.left + b.width / 2 - s.left
    const sy = b.top + b.height / 2 - s.top
    const dx = t.left + t.width / 2 - s.left - sx
    const dy = t.top + t.height / 2 - s.top - sy

    plane.style.left = `${sx}px`
    plane.style.top = `${sy}px`
    const frames = flightFrames(dx, dy, arc)
    const options: KeyframeAnimationOptions = { duration: flight, easing: 'linear', fill: 'forwards' }

    const main = plane.animate(frames, options)
    anims.current = [main]
    if (trail) {
      trailRefs.current.forEach((dot, i) => {
        if (!dot) return
        dot.style.left = `${sx}px`
        dot.style.top = `${sy}px`
        anims.current.push(
          dot.animate(frames, { ...options, fill: 'both', delay: (i + 1) * 55 }),
        )
      })
    }
    main.onfinish = () => {
      anims.current = []
      setPressing(false)
      setPhase('sent')
    }
  }, [phase, flight, arc, trail])

  const send = () => {
    if (phase !== 'idle') return
    setPressing(true)
    setPhase('flying')
    pressTimer.current = window.setTimeout(() => setPressing(false), 170)
  }

  const vars = {
    '--plane-press': String(pressScale),
    '--plane-flight': `${flight}ms`,
  } as React.CSSProperties

  return (
    <div className="plane-demo" style={vars}>
      <div className="plane-card" ref={stageRef}>
        <div className="plane-card__head">
          <span className="plane-card__eyebrow">SHARE / TRIP</span>
          <span className="plane-card__pill">行程卡片</span>
        </div>

        <div className="plane-trip">
          <div className="plane-trip__route">
            <div className="plane-trip__city">
              <b>上海</b>
              <span>SHA · 09:20</span>
            </div>
            <div className="plane-trip__line">
              <i />
              <span className="plane-trip__plane">✈</span>
              <i />
            </div>
            <div className="plane-trip__city">
              <b>东京</b>
              <span>HND · 13:05</span>
            </div>
          </div>
          <div className="plane-trip__meta">
            <span>11 月 28 日 · 周五</span>
            <span>全日空 NH920</span>
            <span>1 位乘客</span>
          </div>
        </div>

        <div className="plane-card__foot">
          <button
            type="button"
            className={`plane-send${pressing ? ' is-pressing' : ''}${phase === 'sent' ? ' is-sent' : ''}`}
            ref={buttonRef}
            disabled={phase !== 'idle'}
            onClick={send}
          >
            {phase === 'idle' && (
              <>
                <span className="plane-send__icon"><PlaneIcon /></span>
                分享行程
              </>
            )}
            {phase === 'flying' && (
              <>
                <span className="plane-spinner" />
                发送中…
              </>
            )}
            {phase === 'sent' && <>已分享 ✓</>}
          </button>
          <button type="button" className="plane-reset" onClick={reset}>
            重新演示
          </button>
        </div>

        <div className="plane-target" ref={targetRef}>
          <span className="plane-target__icon">☁</span>
          <span>云端</span>
        </div>

        {phase === 'flying' && (
          <div className="plane-flight-layer" aria-hidden="true">
            {trail &&
              Array.from({ length: TRAIL_DOTS }, (_, i) => (
                <span
                  key={i}
                  className="plane-trail"
                  ref={(el) => {
                    trailRefs.current[i] = el
                  }}
                />
              ))}
            <div className="plane-flyer" ref={planeRef}>
              <PlaneIcon />
            </div>
          </div>
        )}
      </div>

      <p className="demo-hint">点击「分享行程」· 纸飞机沿弧线飞向云端 · 可调节弧高与飞行时长 · 支持飞行尾迹</p>
    </div>
  )
}

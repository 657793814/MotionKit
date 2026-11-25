import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, clamp, hexToRgba, num, str } from '../lib/utils'
import './GlassToggle.css'

/** 欠阻尼二阶系统的阶跃响应：t 秒时从 0 趋近 1，ζ<1 会过冲再回弹 */
function stepResponse(t: number, zeta: number, omega: number): number {
  const z = clamp(zeta, 0.08, 0.97)
  const wd = omega * Math.sqrt(1 - z * z)
  return 1 - Math.exp(-z * omega * t) * (Math.cos(wd * t) + ((z * omega) / wd) * Math.sin(wd * t))
}

export default function GlassToggleDemo({ params, replay }: DemoProps) {
  const jelly = bool(params.jelly, true)
  const aniso = num(params.aniso, 0.45)
  const blur = num(params.blur, 8)
  const tint = str(params.tint, '#3b82f6')

  const [on, setOn] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const trackRef = useRef<HTMLButtonElement>(null)
  const knobRef = useRef<HTMLSpanElement>(null)
  const animRef = useRef<Animation | null>(null)
  const posRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    animRef.current?.cancel()
    animRef.current = null
    posRef.current = 0
    setOn(false)
    setPressed(false)
    const knob = knobRef.current
    if (knob) knob.style.transform = 'translateX(0px) scale(1, 1)'
  }, [replay])

  const travelOf = () => {
    const track = trackRef.current
    const knob = knobRef.current
    if (!track || !knob) return 1
    return Math.max(1, track.clientWidth - knob.offsetWidth - 8)
  }

  // 从当前动画矩阵读取实际位置，允许连点中途接管
  const currentPos = () => {
    const knob = knobRef.current
    if (!knob) return 0
    const t = window.getComputedStyle(knob).transform
    if (!t || t === 'none') return posRef.current
    try {
      return clamp(new DOMMatrixReadOnly(t).m41 / travelOf(), 0, 1)
    } catch {
      return posRef.current
    }
  }

  const play = (from: number, to: number) => {
    const knob = knobRef.current
    if (!knob) return
    animRef.current?.cancel()
    const travel = travelOf()

    if (reduce) {
      knob.style.transform = `translateX(${(to * travel).toFixed(2)}px) scale(1, 1)`
      posRef.current = to
      return
    }

    if (!jelly) {
      animRef.current = knob.animate(
        [
          { transform: `translateX(${(from * travel).toFixed(2)}px) scale(1, 1)` },
          { transform: `translateX(${(to * travel).toFixed(2)}px) scale(1, 1)` },
        ],
        { duration: 380, easing: 'cubic-bezier(.22,.8,.22,1)', fill: 'forwards' },
      )
      posRef.current = to
      return
    }

    // 两轴用不同 ζ/ω 采样：x 决定位移，y 响应与 x 的差值制造挤压错拍
    const zx = clamp(0.52 - aniso * 0.5, 0.12, 0.48)
    const zy = clamp(0.42 + aniso * 0.55, 0.5, 0.92)
    const duration = 660
    const total = 30
    let prev = 0
    const frames: Keyframe[] = []

    for (let i = 0; i <= total; i++) {
      const t = (i / total) * (duration / 1000)
      const px = stepResponse(t, zx, 17)
      const py = stepResponse(t, zy, 27)
      const velocity = ((px - prev) * total * 1000) / duration
      prev = px
      const p = from + (to - from) * px
      const drive = clamp(Math.abs(velocity) / 3.4, 0, 1)
      const sx = 1 + 0.2 * drive
      const sy = 1 - 0.26 * drive + 0.12 * (py - px)
      frames.push({
        offset: i / total,
        transform: `translateX(${(p * travel).toFixed(2)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`,
      })
    }

    animRef.current = knob.animate(frames, { duration, easing: 'linear', fill: 'forwards' })
    posRef.current = to
  }

  const toggle = () => {
    const next = !on
    setOn(next)
    play(currentPos(), next ? 1 : 0)
  }

  const onDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return
    setPressed(true)
  }

  const style = {
    '--gtog-blur': `${blur}px`,
    '--gtog-tint': hexToRgba(tint, 0.62),
    '--gtog-tint-soft': hexToRgba(tint, 0.2),
    '--gtog-line': hexToRgba(tint, 0.5),
  } as CSSProperties

  return (
    <div className="gtog-demo" style={style}>
      <div className="gtog-stage">
        <span className="gtog-blob gtog-blob--violet" />
        <span className="gtog-blob gtog-blob--cyan" />
        <span className="gtog-blob gtog-blob--pink" />

        <div className="gtog-panel">
          <span className="gtog-panel__tag">LIQUID GLASS · TOGGLE</span>
          <div className="gtog-row">
            <button
              ref={trackRef}
              type="button"
              role="switch"
              aria-checked={on}
              aria-label="果冻开关"
              className={
                'gtog-track' + (on ? ' is-on' : '') + (pressed ? ' is-pressed' : '')
              }
              onClick={toggle}
              onPointerDown={onDown}
              onPointerUp={() => setPressed(false)}
              onPointerLeave={() => setPressed(false)}
              onPointerCancel={() => setPressed(false)}
            >
              <span ref={knobRef} className="gtog-knob">
                <span className="gtog-knob__spec" />
              </span>
            </button>

            <div className="gtog-status">
              <span className="gtog-status__label">当前状态</span>
              <b className={on ? 'is-on' : ''}>{on ? '已开启' : '已关闭'}</b>
              <span className="gtog-status__meta">
                {jelly ? `果冻开启 · 双轴阻尼差 ${aniso.toFixed(2)}` : '果冻关闭 · 平滑滑动'}
              </span>
            </div>
          </div>

          <div className="gtog-readout">
            <span>jelly {jelly ? 'ON' : 'OFF'}</span>
            <span>aniso {aniso.toFixed(2)}</span>
            <span>blur {blur}px</span>
          </div>
        </div>
      </div>

      <p className="demo-hint">按住开关时旋钮化为透明玻璃珠 · 松开后双轴不同步回弹（果冻开启时）</p>
    </div>
  )
}

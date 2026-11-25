import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, clamp, hexToRgba, num, str } from '../lib/utils'
import './GlassSlider.css'

export default function GlassSliderDemo({ params, replay }: DemoProps) {
  const magnify = num(params.magnify, 1.9)
  const blur = num(params.blur, 8)
  const snap = bool(params.snap, true)
  const accent = str(params.accent, '#3b82f6')

  const [value, setValue] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [popKey, setPopKey] = useState(0)
  const railRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<number | null>(null)
  const snapRef = useRef(50)

  useEffect(() => {
    pointerRef.current = null
    snapRef.current = 50
    setPopKey(0)
    setDragging(false)
    setValue(50)
  }, [replay])

  const fromClientX = (clientX: number) => {
    const rail = railRef.current
    if (!rail) return 50
    const r = rail.getBoundingClientRect()
    return clamp(((clientX - r.left) / Math.max(1, r.width)) * 100, 0, 100)
  }

  const apply = (clientX: number) => {
    const raw = fromClientX(clientX)
    if (snap) {
      const rounded = Math.round(raw)
      if (rounded !== snapRef.current) {
        snapRef.current = rounded
        setPopKey((k) => k + 1)
      }
      setValue(rounded)
    } else {
      setValue(Math.round(raw * 10) / 10)
    }
  }

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    pointerRef.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    apply(e.clientX)
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== e.pointerId) return
    apply(e.clientX)
  }

  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== e.pointerId) return
    pointerRef.current = null
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    if (snap) setValue(Math.round(fromClientX(e.clientX)))
  }

  const onKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    let next = value
    const stepSize = snap ? 1 : 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next -= e.shiftKey ? 10 : stepSize
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next += e.shiftKey ? 10 : stepSize
    else if (e.key === 'PageDown') next -= 10
    else if (e.key === 'PageUp') next += 10
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = 100
    else return
    e.preventDefault()
    const clamped = clamp(next, 0, 100)
    const final = snap ? Math.round(clamped) : clamped
    if (snap) {
      snapRef.current = Math.round(final)
      setPopKey((k) => k + 1)
    }
    setValue(final)
  }

  const style = {
    '--gslider-blur': `${blur}px`,
    '--gslider-mag': String(magnify),
    '--gslider-accent': hexToRgba(accent, 0.75),
    '--gslider-accent-soft': hexToRgba(accent, 0.2),
    '--gslider-accent-line': hexToRgba(accent, 0.48),
  } as CSSProperties

  const shown = Math.round(value)

  return (
    <div className={'gslider-demo' + (dragging ? ' is-dragging' : '')} style={style}>
      <div className="gslider-stage">
        <span className="gslider-blob gslider-blob--violet" />
        <span className="gslider-blob gslider-blob--cyan" />
        <span className="gslider-blob gslider-blob--pink" />

        <div className="gslider-panel">
          <div className="gslider-head">
            <div>
              <span className="gslider-tag">LIQUID GLASS · SLIDER</span>
              <b className="gslider-value">
                {shown}<span>/ 100</span>
              </b>
            </div>
            <span className="gslider-mode">{snap ? '整数吸附' : '连续调节'} · {magnify.toFixed(1)}×</span>
          </div>

          <div
            ref={railRef}
            className="gslider-rail"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <span className="gslider-fill" style={{ width: `${value}%` }} />
            <span className="gslider-ticks" aria-hidden="true">
              {Array.from({ length: 11 }, (_, i) => (
                <i
                  key={i}
                  className={i * 10 <= shown ? 'is-passed' : ''}
                  style={{ left: `${i * 10}%` }}
                />
              ))}
            </span>

            <button
              type="button"
              role="slider"
              aria-label="放大镜滑块"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={shown}
              className="gslider-knob"
              style={{ left: `${value}%` }}
              onKeyDown={onKey}
            >
              <span className="gslider-lens">
                <span
                  className="gslider-lens-ticks"
                  style={{ backgroundPositionX: `${-value * 2}px` }}
                />
                <span className="gslider-lens-glint" />
              </span>
              {popKey > 0 && <span key={popKey} className="gslider-pop" />}
              <span className="gslider-bubble">{shown}</span>
            </button>
          </div>

          <div className="gslider-foot">
            <span>0</span>
            <span>拖动圆钮 · 方向键微调</span>
            <span>100</span>
          </div>
        </div>
      </div>

      <p className="demo-hint">拖动时圆钮放大成放大镜并高亮轨道刻度 · snap 开启时松手吸附整数</p>
    </div>
  )
}

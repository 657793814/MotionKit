import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import type { DemoProps } from '../lib/types'
import { clamp, num } from '../lib/utils'
import './GlassCard.css'

const CARD_W = 260
const CARD_H = 160
const PAD = 24

/** 与舞台底下的彩色光斑同构，复制一份给折射层做位移，保证像素对齐 */
function Backdrop() {
  return (
    <>
      <span className="gcard-blob gcard-blob--violet" />
      <span className="gcard-blob gcard-blob--cyan" />
      <span className="gcard-blob gcard-blob--pink" />
      <span className="gcard-blob gcard-blob--orange" />
      <span className="gcard-thread gcard-thread--a" />
      <span className="gcard-thread gcard-thread--b" />
    </>
  )
}

export default function GlassCardDemo({ params, replay }: DemoProps) {
  const refraction = num(params.refraction, 24)
  const chromatic = num(params.chromatic, 8)
  const blur = num(params.blur, 2)
  const edge = num(params.edge, 2)

  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [dragging, setDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, dx: 0, dy: 0, id: -1 })
  const sizeRef = useRef({ w: 0, h: 0 })
  const initRef = useRef(false)

  const centered = () => ({
    x: Math.max(8, (sizeRef.current.w - CARD_W) / 2),
    y: Math.max(8, (sizeRef.current.h - CARD_H) / 2),
  })

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      const w = r.width
      const h = r.height
      sizeRef.current = { w, h }
      setSize({ w, h })
      if (!initRef.current) {
        initRef.current = true
        setPos(centered())
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    dragRef.current = { active: false, dx: 0, dy: 0, id: -1 }
    setDragging(false)
    setPos(centered())
  }, [replay])

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const r = e.currentTarget.getBoundingClientRect()
    dragRef.current = {
      active: true,
      dx: e.clientX - r.left,
      dy: e.clientY - r.top,
      id: e.pointerId,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active || d.id !== e.pointerId) return
    const stage = stageRef.current
    if (!stage) return
    const r = stage.getBoundingClientRect()
    setPos({
      x: clamp(e.clientX - r.left - d.dx, 6, Math.max(6, r.width - CARD_W - 6)),
      y: clamp(e.clientY - r.top - d.dy, 6, Math.max(6, r.height - CARD_H - 6)),
    })
  }

  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d.active || d.id !== e.pointerId) return
    d.active = false
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const style = {
    '--gcard-blur': `${blur}px`,
    '--gcard-edge': `${edge}px`,
  } as CSSProperties

  const lensBox: CSSProperties = {
    left: pos.x - PAD,
    top: pos.y - PAD,
    width: CARD_W + PAD * 2,
    height: CARD_H + PAD * 2,
  }

  return (
    <div className="gcard-demo" style={style}>
      <svg className="gcard-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="gcard-refract"
            x="-16%"
            y="-16%"
            width="132%"
            height="132%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.013"
              numOctaves={2}
              seed={11}
              result="gcardNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="gcardNoise"
              scale={refraction}
              xChannelSelector="R"
              yChannelSelector="G"
              result="gcardWarp"
            />
            <feColorMatrix
              in="gcardWarp"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="gcardR"
            />
            <feColorMatrix
              in="gcardWarp"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="gcardG"
            />
            <feColorMatrix
              in="gcardWarp"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="gcardB"
            />
            <feOffset in="gcardR" dx={chromatic} result="gcardRo" />
            <feOffset in="gcardG" dx={chromatic * 0.1} result="gcardGo" />
            <feOffset in="gcardB" dx={-chromatic} result="gcardBo" />
            <feBlend in="gcardRo" in2="gcardGo" mode="screen" result="gcardRG" />
            <feBlend in="gcardRG" in2="gcardBo" mode="screen" result="gcardRGB" />
            <feGaussianBlur in="gcardRGB" stdDeviation="0.35" />
          </filter>
        </defs>
      </svg>

      <div ref={stageRef} className="gcard-stage">
        <Backdrop />

        {size.w > 0 && (
          <>
            {/* 只在这层装饰复制背景上施加 SVG 折射/色散，不影响卡片自身的 backdrop-filter */}
            <div className="gcard-lens" style={lensBox} aria-hidden="true">
              <div
                className="gcard-lens-inner"
                style={{ left: -(pos.x - PAD), top: -(pos.y - PAD), width: size.w, height: size.h }}
              >
                <Backdrop />
              </div>
            </div>
            <div className="gcard-rim" style={lensBox} aria-hidden="true">
              <span />
            </div>
          </>
        )}

        <div
          className={'gcard-card' + (dragging ? ' is-dragging' : '')}
          style={{ width: CARD_W, height: CARD_H, transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <span className="gcard-card__edge" />
          <div className="gcard-card__content">
            <div className="gcard-card__top">
              <span>LIQUID GLASS</span>
              <span>04 / 04</span>
            </div>
            <h3>拖我，光线会弯</h3>
            <p>背景在卡片周围弯折、分裂出彩边</p>
          </div>
        </div>

        <div className="gcard-readout">
          <span>折射 {refraction}px</span>
          <span>色散 {chromatic}px</span>
          <span>模糊 {blur}px</span>
          <span>细边 {edge}px</span>
        </div>
      </div>

      <p className="demo-hint">拖动卡片 · 观察下方光斑被凸透镜弯折并出现 R/G/B 彩边</p>
    </div>
  )
}

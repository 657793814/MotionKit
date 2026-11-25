import { useEffect, useRef, useState } from 'react'
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import type { DemoProps } from '../lib/types'
import { bool, hexToRgba, num, str } from '../lib/utils'
import './LiquidGlass.css'

export default function LiquidGlassDemo({ params, replay }: DemoProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const blur = num(params.blur, 14)
  const saturation = num(params.saturation, 165)
  const refraction = num(params.refraction, 18)
  const tint = str(params.tint, '#60a5fa')
  const radius = num(params.radius, 28)
  const glow = bool(params.glow, true)

  const [rippleKey, setRippleKey] = useState(0)
  const [rippleAt, setRippleAt] = useState({ x: 50, y: 50 })

  useEffect(() => {
    setRippleKey(0)
    const el = cardRef.current
    if (el) {
      el.style.setProperty('--gx', '50%')
      el.style.setProperty('--gy', '50%')
    }
  }, [replay])

  const positionOf = (e: ReactPointerEvent<HTMLDivElement> | ReactMouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return { x: 50, y: 50 }
    const r = el.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / Math.max(1, r.width)) * 100,
      y: ((e.clientY - r.top) / Math.max(1, r.height)) * 100,
    }
  }

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { x, y } = positionOf(e)
    el.style.setProperty('--gx', `${x}%`)
    el.style.setProperty('--gy', `${y}%`)
  }

  const onLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--gx', '50%')
    el.style.setProperty('--gy', '50%')
  }

  const onClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    setRippleAt(positionOf(e))
    setRippleKey((k) => k + 1)
  }

  const style = {
    '--glass-blur': `${blur}px`,
    '--glass-sat': `${saturation}%`,
    '--glass-refraction': refraction,
    '--glass-radius': `${radius}px`,
    '--glass-tint': hexToRgba(tint, 0.24),
    '--glass-tint-soft': hexToRgba(tint, 0.1),
    '--glass-line': hexToRgba(tint, 0.42),
    '--glass-glow': hexToRgba(tint, 0.5),
    '--glass-caustic-opacity': String(0.2 + (refraction / 30) * 0.55),
  } as CSSProperties

  return (
    <div className="lg-demo" style={style}>
      {/* 折射滤镜定义：仅作用于卡片内部的装饰层，不叠加在 backdrop-filter 上 */}
      <svg className="lg-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="lg-distort"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.017"
              numOctaves={2}
              seed={7}
              result="lgNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lgNoise"
              scale={refraction}
              xChannelSelector="R"
              yChannelSelector="G"
              result="lgWarp"
            />
            <feGaussianBlur in="lgWarp" stdDeviation="1.1" />
          </filter>
        </defs>
      </svg>

      <div className="lg-stage">
        <span className="lg-blob lg-blob--violet" />
        <span className="lg-blob lg-blob--cyan" />
        <span className="lg-blob lg-blob--pink" />
        <span className="lg-blob lg-blob--orange" />
        <span className="lg-thread lg-thread--a" />
        <span className="lg-thread lg-thread--b" />

        <div
          ref={cardRef}
          className={'lg-glass' + (glow ? ' has-glow' : '')}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onClick={onClick}
        >
          <div className="lg-caustics" />
          <div className="lg-sheen" />
          <div className="lg-specular" />
          <div className="lg-edge" />

          {rippleKey > 0 && (
            <span
              key={rippleKey}
              className="lg-ripple"
              style={{ left: `${rippleAt.x}%`, top: `${rippleAt.y}%` }}
            />
          )}

          <div className="lg-content">
            <div className="lg-top">
              <span className="lg-tag">LIQUID GLASS</span>
              <span className="lg-index">01 / 04</span>
            </div>

            <h3 className="lg-title">光，有了形状</h3>

            <p className="lg-desc">
              光线穿过有厚度的曲面，被折叠、染色、再聚焦。
              <br />
              移动指针，让高光沿玻璃的弧面缓缓流动。
            </p>

            <div className="lg-bottom">
              <div className="lg-pills">
                <span className="lg-pill">Refraction</span>
                <span className="lg-pill">Specular</span>
                <span className="lg-pill">Blur</span>
              </div>
              <button className="lg-cta" type="button">
                感受折射 <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="demo-hint">移动鼠标观察高光 · 点击卡片触发液态涟漪</p>
    </div>
  )
}

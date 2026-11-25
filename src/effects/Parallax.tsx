import { useRef } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num } from '../lib/utils'
import './Parallax.css'

export default function ParallaxDemo({ params }: DemoProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const strength = num(params.strength, 0.55)
  const mouse = bool(params.mouse, true)
  const atmosphere = bool(params.atmosphere, true)

  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    el.style.setProperty('--p', String(max > 0 ? el.scrollTop / max : 0))
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mouse) return
    const el = scroller.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mxn', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    el.style.setProperty('--myn', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }

  const onLeave = () => {
    const el = scroller.current
    if (!el) return
    el.style.setProperty('--mxn', '0')
    el.style.setProperty('--myn', '0')
  }

  return (
    <div className="px-demo">
      <div
        ref={scroller}
        className={'px-scroll' + (atmosphere ? ' has-atmosphere' : '')}
        onScroll={onScroll}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ '--px-strength': strength } as React.CSSProperties}
      >
        <div className="px-viewport">
          <div className="px-sky" />
          <div className="px-stars" />
          <div className="px-moon">
            <span className="px-moon__halo" />
            <span className="px-moon__disc" />
          </div>

          <div className="px-layer px-birds">
            <svg viewBox="0 0 200 60" aria-hidden="true">
              <path d="M8 36c7-6 12-6 19 0M36 26c7-6 12-6 19 0M70 40c5-4 9-4 14 0M96 24c6-5 10-5 16 0" />
            </svg>
          </div>

          <div className="px-mountain px-back">
            <svg viewBox="0 0 800 380" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="pxBack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a4170" />
                  <stop offset="100%" stopColor="#20264a" />
                </linearGradient>
              </defs>
              <path
                fill="url(#pxBack)"
                d="M0 380V248l58-44 46 20 52-72 54 48 46-30 50 66 58-92 54 56 42-26 60 58 60-42 60 52 60-30 60 40v126z"
              />
            </svg>
          </div>

          {atmosphere && <div className="px-fog px-fog--one" />}

          <div className="px-mountain px-mid">
            <svg viewBox="0 0 800 380" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="pxMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#232a4d" />
                  <stop offset="100%" stopColor="#111730" />
                </linearGradient>
              </defs>
              <path
                fill="url(#pxMid)"
                d="M0 380V286l70-60 44 26 60-92 58 64 52-32 54 74 66-108 62 82 48-28 54 62 58-40 54 58 60-34 60 48v120z"
              />
            </svg>
          </div>

          {atmosphere && <div className="px-fog px-fog--two" />}

          <div className="px-content">
            <span className="px-content__kicker">INTO THE WILD · 2026</span>
            <h3>去山的那一边</h3>
            <p>把视线交给远山，把脚步交给路。有些答案，只有走出去才会出现。</p>
            <div className="px-content__scroll">
              <span>SCROLL</span>
              <i />
            </div>
          </div>

          <div className="px-mountain px-front">
            <svg viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="pxFront" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d1224" />
                  <stop offset="100%" stopColor="#06080f" />
                </linearGradient>
              </defs>
              <path
                fill="url(#pxFront)"
                d="M0 300V236l52-26 40 18 58-52 44 30 54-44 46 38 50-20 48 44 66-58 54 44 46-26 60 40 52-30 50 34 60-22 60 30v12z"
              />
            </svg>
          </div>

          <div className="px-vignette" />
          <div className="px-progress"><i /></div>
          <span className="px-hint">视差分层 · 滚动与鼠标共同驱动</span>
        </div>
        <div className="px-spacer" />
      </div>
      <p className="demo-hint">在预览区内滚动 · 鼠标左右移动也有细微位移</p>
    </div>
  )
}

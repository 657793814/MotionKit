import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { DemoProps } from '../lib/types'
import { clamp, num } from '../lib/utils'
import './GlassTabBar.css'

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const TABS = [
  {
    label: '首页',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 10.6 12 3l9 7.6" />
        <path d="M5.2 9.4V21h13.6V9.4" />
        <path d="M9.6 21v-6.2h4.8V21" />
      </svg>
    ),
  },
  {
    label: '发现',
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="8.8" />
        <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z" />
      </svg>
    ),
  },
  {
    label: '消息',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M20 14.6a2 2 0 0 1-2 2H8.4L4 19.8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        <path d="M8 9.5h8M8 13h5" />
      </svg>
    ),
  },
  {
    label: '我的',
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="8.2" r="3.6" />
        <path d="M4.6 20c0-4.1 3.3-6.5 7.4-6.5s7.4 2.4 7.4 6.5" />
      </svg>
    ),
  },
]

export default function GlassTabBarDemo({ params, replay }: DemoProps) {
  const stiffness = num(params.stiffness, 300)
  const damping = num(params.damping, 0.5)
  const stretch = num(params.stretch, 1.4)
  const blur = num(params.blur, 12)

  const [active, setActive] = useState(0)
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const targetRef = useRef(0)
  const spring = useRef({ x: 0, v: 0 })
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    targetRef.current = 0
    spring.current = { x: 0, v: 0 }
    setActive(0)
  }, [replay])

  // 阻尼系数 c = 2ζ√(km)，质量 m 取 1；ζ 直接来自 damping 参数
  const c = 2 * damping * Math.sqrt(stiffness)

  useEffect(() => {
    const el = indicatorRef.current
    if (!el) return

    if (reduce) {
      spring.current = { x: targetRef.current, v: 0 }
      el.style.transform = `translate3d(${targetRef.current * 100}%, 0, 0) scale(1, 1)`
      return
    }

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const s = spring.current
      const target = targetRef.current

      // 胡克定律 + 阻尼，欠阻尼（ζ<1）自然产生过冲后弹回
      const force = -stiffness * (s.x - target) - c * s.v
      s.v += force * dt
      s.x += s.v * dt
      if (Math.abs(s.x - target) < 0.001 && Math.abs(s.v) < 0.001) {
        s.x = target
        s.v = 0
      }

      // 速度（叠加剩余距离）驱动拉伸：越快越长，纵向同步压扁
      const drive = clamp(Math.abs(s.v) / 7 + Math.abs(target - s.x) * 0.06, 0, 1)
      const sx = 1 + (stretch - 1) * drive
      const sy = 1 - (sx - 1) * 0.55
      el.style.transform = `translate3d(${(s.x * 100).toFixed(3)}%, 0, 0) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [stiffness, c, stretch, reduce, active])

  const select = (i: number) => {
    targetRef.current = i
    setActive(i)
  }

  const style = {
    '--gtab-blur': `${blur}px`,
  } as CSSProperties

  return (
    <div className="gtab-demo" style={style}>
      <div className="gtab-stage">
        <span className="gtab-blob gtab-blob--violet" />
        <span className="gtab-blob gtab-blob--cyan" />
        <span className="gtab-blob gtab-blob--pink" />

        <div className="gtab-screen">
          <div className="gtab-screen__head">
            <span>9:41</span>
            <span className="gtab-screen__brand">Liquid UI</span>
          </div>
          <div className="gtab-screen__hero">
            <span className="gtab-screen__tag">NOW VIEWING</span>
            <b>{TABS[active].label}</b>
            <span className="gtab-screen__sub">四个标签 · 同一块玻璃</span>
          </div>
          <div className="gtab-screen__rows">
            <i /><i /><i />
          </div>
        </div>

        <div className="gtab-bar" role="tablist" aria-label="玻璃标签栏">
          <div ref={indicatorRef} className="gtab-indicator" aria-hidden="true">
            <span className="gtab-indicator__shine" />
          </div>
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={'gtab-tab' + (active === i ? ' is-active' : '')}
              onClick={() => select(i)}
            >
              <span className="gtab-tab__icon">{tab.icon}</span>
              <span className="gtab-tab__label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="gtab-readout">
          <span>k = {stiffness}</span>
          <span>ζ = {damping.toFixed(2)}</span>
          <span>stretch ≤ {stretch.toFixed(1)}×</span>
        </div>
      </div>

      <p className="demo-hint">点击标签观察胶囊拉伸、过冲与回弹 · k/ζ 决定手感</p>
    </div>
  )
}

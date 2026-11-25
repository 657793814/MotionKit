import { useEffect, useState } from 'react'
import { easeOutCubic, cubicBezier } from '../lib/easing'
import type { DemoProps } from '../lib/types'
import { formatNumber, num, str } from '../lib/utils'
import './CountUp.css'

const easeMap: Record<string, () => (t: number) => number> = {
  expo: () => cubicBezier(0.16, 1, 0.3, 1),
  back: () => cubicBezier(0.34, 1.56, 0.64, 1),
  'ease-out': () => easeOutCubic,
  linear: () => (t: number) => t,
}

export default function CountUpDemo({ params, replay }: DemoProps) {
  const target = Math.max(0, num(params.target, 128.6))
  const duration = num(params.duration, 1600)
  const decimals = num(params.decimals, 1)
  const prefix = str(params.prefix, '¥')
  const suffix = str(params.suffix, '万')
  const easingId = str(params.easing, 'expo')
  const [t, setT] = useState(0)

  useEffect(() => {
    const ease = (easeMap[easingId] ?? easeMap.expo)()
    let raf = 0
    const begin = performance.now()
    setT(0)
    const tick = (now: number) => {
      const raw = Math.min(1, (now - begin) / duration)
      setT(ease(raw))
      if (raw < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, easingId, replay])

  const mainValue = target * t
  const users = Math.round(8432 * Math.min(1, t))
  const rate = (98.2 * Math.min(1.02, t)).toFixed(1)
  const minutes = Math.round(754 * Math.min(1, t))
  const maxUsers = Math.max(1, users)

  return (
    <div className="count-demo">
      <div className="count-card">
        <div className="count-card__head">
          <span className="count-card__label">
            <i /> 本月经常性收入
          </span>
          <span className="count-card__live">LIVE · 刚刚更新</span>
        </div>

        <div className="count-main">
          <div className="count-value">
            <span className="count-value__prefix">{prefix}</span>
            {formatNumber(mainValue, decimals)}
            <span className="count-value__suffix">{suffix}</span>
          </div>
          <span className="count-delta">↑ 18.4%</span>
        </div>
        <p className="count-note">较上月增长 · 已连续 6 个月保持正增长</p>

        <div className={`count-chart t-${easingId}`} key={replay}>
          <svg viewBox="0 0 320 92" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="countArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="countLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <path
              className="count-chart__area"
              d="M0 78 L38 70 L76 74 L114 56 L152 62 L190 44 L228 50 L266 30 L304 22 L320 16 L320 92 L0 92 Z"
              fill="url(#countArea)"
            />
            <path
              className="count-chart__line"
              d="M0 78 L38 70 L76 74 L114 56 L152 62 L190 44 L228 50 L266 30 L304 22 L320 16"
              fill="none"
              stroke="url(#countLine)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
            />
            <circle className="count-chart__dot" cx="320" cy="16" r="3.4" fill="#22d3ee" />
          </svg>
          <span className="count-chart__tag">REVENUE / 6M</span>
        </div>

        <div className="count-stats">
          <div>
            <span>活跃用户</span>
            <b>{formatNumber(users, 0)}</b>
          </div>
          <div>
            <span>续费率</span>
            <b>{rate}%</b>
          </div>
          <div>
            <span>平均使用</span>
            <b>{minutes} 分钟</b>
          </div>
        </div>
        <div className="count-micro">
          {Array.from({ length: 24 }).map((_, i) => (
            <i
              key={i}
              style={{
                height: `${18 + Math.abs(Math.sin(i * 1.7)) * 30}px`,
                opacity: maxUsers > 0 ? 0.25 + (i / 24) * 0.65 : 0.1,
                animationDelay: `${i * 22}ms`,
              }}
            />
          ))}
        </div>
      </div>
      <p className="demo-hint">数字滚动至目标值 · 时长 {duration}ms</p>
    </div>
  )
}

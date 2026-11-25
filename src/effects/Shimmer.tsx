import type { DemoProps } from '../lib/types'
import { bool, hexToRgba, num, str } from '../lib/utils'
import './Shimmer.css'

export default function ShimmerDemo({ params }: DemoProps) {
  const duration = num(params.duration, 1.8)
  const angle = num(params.angle, 105)
  const width = num(params.width, 32)
  const color = str(params.color, '#ffffff')
  const loop = bool(params.loop, true)

  return (
    <div className="shimmer-demo">
      <div
        className={'sk-card' + (loop ? '' : ' is-once')}
        style={
          {
            '--sk-duration': `${duration}s`,
            '--sk-angle': `${angle}deg`,
            '--sk-width': `${width}%`,
            '--sk-color': hexToRgba(color, 0.2),
            '--sk-color-soft': hexToRgba(color, 0.08),
          } as React.CSSProperties
        }
      >
        <div className="sk-head">
          <div className="sk-avatar shimmer-el">
            <span className="sk-avatar__mark">AI</span>
          </div>
          <div className="sk-head__lines">
            <div className="shimmer-el sk-line" style={{ width: '42%' }} />
            <div className="shimmer-el sk-line sk-line--sm" style={{ width: '26%' }} />
          </div>
          <span className="sk-time">Generating…</span>
        </div>

        <div className="shimmer-el sk-preview">
          <div className="sk-preview__icon">
            <span />
          </div>
        </div>

        <div className="sk-body">
          <div className="shimmer-el sk-line" style={{ width: '88%' }} />
          <div className="shimmer-el sk-line" style={{ width: '72%' }} />
          <div className="shimmer-el sk-line" style={{ width: '54%' }} />
        </div>

        <div className="sk-foot">
          <div className="sk-loading">
            <span className="sk-loading__dots"><i /><i /><i /></span>
            正在为你生成 3 个版本
          </div>
          <div className="shimmer-el sk-btn" />
        </div>
      </div>
      <p className="demo-hint">
        骨架屏占位 · 扫光速度 {duration}s {loop ? '· 循环' : '· 仅一次'}
      </p>
    </div>
  )
}

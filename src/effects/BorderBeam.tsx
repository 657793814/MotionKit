import type { DemoProps } from '../lib/types'
import { bool, hexToRgba, num, str } from '../lib/utils'
import './BorderBeam.css'

export default function BorderBeamDemo({ params }: DemoProps) {
  const speed = num(params.speed, 4)
  const thickness = num(params.thickness, 1.5)
  const size = num(params.size, 100)
  const color1 = str(params.color1, '#3b82f6')
  const color2 = str(params.color2, '#22d3ee')
  const glow = bool(params.glow, true)

  return (
    <div className="beam-stage">
      <div
        className={'beam-wrap' + (glow ? ' has-glow' : '')}
        style={
          {
            '--beam-speed': `${speed}s`,
            '--beam-thickness': `${thickness}px`,
            '--beam-size': `${size}deg`,
            '--beam-c1': color1,
            '--beam-c2': color2,
            '--beam-glow': hexToRgba(color1, 0.28),
          } as React.CSSProperties
        }
      >
        <div className="beam-card">
          <div className="beam-card__head">
            <span className="beam-logo">NOVA<span>®</span></span>
            <span className="beam-badge">推荐</span>
          </div>
          <div className="beam-plan">
            <span className="beam-plan__name">Pro 套餐</span>
            <p className="beam-price">
              <i>¥</i>128<span>/ 月</span>
            </p>
            <p className="beam-plan__note">按年付费 · 随时可取消</p>
          </div>
          <ul className="beam-list">
            <li><b>✓</b> 不限次数的 AI 生成</li>
            <li><b>✓</b> 优先队列与专属模型</li>
            <li><b>✓</b> 团队协作空间与权限管理</li>
            <li><b>✓</b> 30 天完整调用日志</li>
          </ul>
          <button className="beam-cta" type="button">立即升级 <span>→</span></button>
          <p className="beam-foot">已有 2,400+ 团队在使用</p>
        </div>
      </div>
      <p className="demo-hint">光沿边框循环 · 每 {speed}s 一圈</p>
    </div>
  )
}

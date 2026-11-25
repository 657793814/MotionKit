import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num, str } from '../lib/utils'
import './CardFlip.css'

const QR_SIZE = 9

function isQrDark(row: number, col: number): boolean {
  const corners: [number, number][] = [[0, 0], [0, 6], [6, 0]]
  for (const [fr, fc] of corners) {
    if (row >= fr && row < fr + 3 && col >= fc && col < fc + 3) {
      const lr = row - fr
      const lc = col - fc
      return lr === 0 || lr === 2 || lc === 0 || lc === 2 || (lr === 1 && lc === 1)
    }
  }
  return (row * 5 + col * 3 + row * col) % 7 < 3
}

export default function CardFlipDemo({ params, replay }: DemoProps) {
  const [flipped, setFlipped] = useState(false)

  const duration = num(params.duration, 720)
  const perspective = num(params.perspective, 1000)
  const axis = str(params.axis, 'y') === 'x' ? 'x' : 'y'
  const shadow = bool(params.shadow, true)

  useEffect(() => {
    setFlipped(false)
  }, [replay])

  const vars = {
    '--flip-duration': `${duration}ms`,
    '--flip-perspective': `${perspective}px`,
  } as React.CSSProperties

  return (
    <div className="flip-demo" style={vars}>
      <div className="flip-stage">
        {shadow && <span className="flip-shadow" aria-hidden="true" />}
        <button
          type="button"
          className={'flip-card' + (axis === 'x' ? ' is-axis-x' : '') + (flipped ? ' is-flipped' : '')}
          onClick={() => setFlipped((v) => !v)}
          aria-label={flipped ? '返回卡片正面' : '翻转卡片查看背面'}
          aria-pressed={flipped}
        >
          <span className="flip-face flip-face--front">
            <span className="flip-front__top">
              <span className="flip-front__brand">MOTIONKIT / MEMBERSHIP</span>
              <span className="flip-front__badge">PRO</span>
            </span>
            <span className="flip-front__title">MotionKit PRO</span>
            <span className="flip-front__sub">解锁全部 35 款动效组件</span>
            <span className="flip-front__features">
              <span>✓ 无限制导出代码</span>
              <span>✓ 高级动效参数</span>
              <span>✓ 商用授权</span>
            </span>
            <span className="flip-front__foot">点击卡片查看背面 →</span>
          </span>

          <span className="flip-face flip-face--back">
            <span className="flip-back__head">
              <b>扫码体验</b>
              <em>SCAN ME</em>
            </span>
            <span className="flip-qr" aria-hidden="true">
              {Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => (
                <i key={i} className={isQrDark(Math.floor(i / QR_SIZE), i % QR_SIZE) ? 'is-on' : ''} />
              ))}
            </span>
            <span className="flip-back__info">
              <b>MotionKit 组件库</b>
              <em>手机扫码，查看完整文档与示例</em>
            </span>
            <span className="flip-back__return">↩ 点击卡片返回正面</span>
          </span>
        </button>
      </div>
      <div className="flip-readout">
        <span>旋转轴 <b>{axis === 'x' ? '横轴 X' : '竖轴 Y'}</b></span>
        <span>透视 <b>{perspective}px</b></span>
        <span>时长 <b>{duration}ms</b></span>
      </div>
      <p className="demo-hint">
        点击卡片翻面 · 正反面均使用 backface-visibility 隐藏镜像 · 阴影层{shadow ? '已开启' : '已关闭'} · 点击「重新演示」回到正面
      </p>
    </div>
  )
}

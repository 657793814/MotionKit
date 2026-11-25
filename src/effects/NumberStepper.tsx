import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, formatNumber, num } from '../lib/utils'
import './NumberStepper.css'

const MAX = 12
const PRICE = 249

export default function NumberStepperDemo({ params, replay }: DemoProps) {
  const bounce = bool(params.bounce, true)
  const digitHeight = num(params.digitHeight, 36)
  const duration = num(params.duration, 360)
  const min = Math.round(num(params.min, 0))

  const [value, setValue] = useState(1)
  const [incKey, setIncKey] = useState(0)
  const [decKey, setDecKey] = useState(0)

  useEffect(() => {
    setValue(Math.max(1, min))
    setIncKey(0)
    setDecKey(0)
  }, [replay])

  useEffect(() => {
    setValue((v) => Math.max(min, v))
  }, [min])

  const atMin = value <= min
  const atMax = value >= MAX

  const increment = () => {
    if (atMax) return
    setValue((v) => Math.min(MAX, v + 1))
    setIncKey((k) => k + 1)
  }

  const decrement = () => {
    if (atMin) return
    setValue((v) => Math.max(min, v - 1))
    setDecKey((k) => k + 1)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === '+' || event.key === '=' || event.key === 'ArrowUp') {
      event.preventDefault()
      increment()
    } else if (event.key === '-' || event.key === '_' || event.key === 'ArrowDown') {
      event.preventDefault()
      decrement()
    }
  }

  const vars = {
    '--step-h': `${digitHeight}px`,
    '--step-dur': `${duration}ms`,
  } as React.CSSProperties

  return (
    <div className="step-demo" style={vars}>
      <div className="step-card">
        <div className="step-card__top">
          <span className="step-card__tag">SHOP / 商品详情</span>
          <span className="step-card__stock">现货 · 包邮</span>
        </div>

        <div className="step-product">
          <div className="step-thumb" aria-hidden="true">
            <span>⌨</span>
          </div>
          <div className="step-product__info">
            <h3 className="step-product__name">Aurora 机械键盘</h3>
            <p className="step-product__spec">87 键 · 星云紫 · 热插拔轴</p>
            <b className="step-product__price">¥{formatNumber(PRICE, 2)}</b>
          </div>
        </div>

        <div className="step-divider" />

        <div className="step-line">
          <span className="step-line__label">购买数量</span>
          <div
            className="stepper"
            role="group"
            aria-label="数量步进器"
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            <button
              type="button"
              className={'step-btn' + (atMin ? ' is-disabled' : '')}
              onClick={decrement}
              disabled={atMin}
              aria-label="减少数量"
            >
              <span
                key={bounce ? decKey : 'still'}
                className={'step-btn__glyph' + (bounce && decKey > 0 ? ' is-bouncing' : '')}
              >
                −
              </span>
            </button>

            <div className="step-window" aria-live="polite" aria-label={`当前数量 ${value}`}>
              <div
                className="step-track"
                style={{ transform: `translateY(calc(var(--step-h) * ${-value}))` }}
              >
                {Array.from({ length: MAX + 1 }, (_, i) => (
                  <span className="step-digit" key={i} aria-hidden={i !== value}>
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={'step-btn' + (atMax ? ' is-disabled' : '')}
              onClick={increment}
              disabled={atMax}
              aria-label="增加数量"
            >
              <span
                key={bounce ? incKey : 'still'}
                className={'step-btn__glyph' + (bounce && incKey > 0 ? ' is-bouncing' : '')}
              >
                +
              </span>
            </button>
          </div>
        </div>

        <div className="step-total">
          <span>
            合计金额 <em>（¥{PRICE} × {value}）</em>
          </span>
          <b>¥{formatNumber(PRICE * value, 2)}</b>
        </div>

        <div className="step-meta">
          <span>最小起订 <b>{min}</b></span>
          <span>数字行高 <b>{digitHeight}px</b></span>
          <span>滚动时长 <b>{duration}ms</b></span>
        </div>
      </div>
      <p className="demo-hint">
        点击 ± 按钮或使用键盘 +/- 调整数量 · 数字纵向滚动 · 减到最小值 {min} 时按钮禁用 · 点击「重新演示」复位为 1
      </p>
    </div>
  )
}

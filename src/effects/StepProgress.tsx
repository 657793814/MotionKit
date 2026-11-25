import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, hexToRgba, num, str } from '../lib/utils'
import './StepProgress.css'

interface StepDef {
  label: string
  desc: string
}

const STEPS: StepDef[] = [
  { label: '填写信息', desc: '录入收件人、联系方式与配送地址，信息将自动完成校验。' },
  { label: '验证身份', desc: '通过短信验证码确认是本人操作，保障账户与订单安全。' },
  { label: '确认支付', desc: '核对订单金额，选择支付方式并完成付款。' },
  { label: '完成', desc: '支付成功，订单已进入处理队列，我们会尽快为你发货。' },
]

export default function StepProgressDemo({ params, replay }: DemoProps) {
  const fill = num(params.fill, 520)
  const check = bool(params.check, true)
  const style = str(params.style, 'solid') === 'glass' ? 'glass' : 'solid'
  const accent = str(params.accent, '#3b82f6')

  const [completed, setCompleted] = useState(0)
  const [view, setView] = useState(0)
  const [pulsing, setPulsing] = useState<number | null>(null)
  const [run, setRun] = useState(0)
  const timer = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setCompleted(0)
    setView(0)
    setPulsing(null)
    setRun((n) => n + 1)
  }, [clearTimer])

  useEffect(() => {
    reset()
  }, [replay, reset])

  useEffect(() => () => clearTimer(), [clearTimer])

  const completeCurrent = () => {
    if (completed >= STEPS.length || pulsing !== null) return
    const index = completed
    setPulsing(index)
    timer.current = window.setTimeout(() => {
      const next = index + 1
      setCompleted(next)
      setView(Math.min(next, STEPS.length - 1))
      setPulsing(null)
      timer.current = null
    }, 180)
  }

  const done = completed === STEPS.length
  const vars = {
    '--sp-accent': accent,
    '--sp-accent-soft': hexToRgba(accent, 0.18),
    '--sp-accent-glow': hexToRgba(accent, 0.5),
    '--sp-fill': `${fill}ms`,
  } as CSSProperties

  return (
    <div className={`sp-demo sp-style-${style}`} style={vars}>
      <div className="sp-card">
        <span className="sp-card__tag">CHECKOUT / PROGRESS</span>
        <h3 className="sp-card__title">订单进度</h3>

        <div className="sp-track" key={run}>
          {STEPS.map((step, index) => {
            const isDone = index < completed
            const isActive = index === completed && !done
            const isViewing = index === view && (!done || index === STEPS.length - 1)
            const stateClass = isDone ? 'is-done' : isActive ? 'is-active' : 'is-todo'

            return (
              <Fragment key={step.label}>
                <div className={`sp-step ${stateClass}${isViewing ? ' is-viewing' : ''}`}>
                  <button
                    type="button"
                    className={'sp-node' + (pulsing === index ? ' is-pulsing' : '')}
                    onClick={() => {
                      if (isDone) setView(index)
                    }}
                    disabled={!isDone}
                    aria-label={isDone ? `回看步骤 ${index + 1}：${step.label}` : step.label}
                  >
                    <span className="sp-node__inner">
                      {isDone ? (
                        check ? (
                          <svg className="sp-check" viewBox="0 0 24 24" aria-hidden="true">
                            <path className="sp-check__path" d="M5 12.6l4.7 4.6L19.4 7.4" />
                          </svg>
                        ) : (
                          <span className="sp-check-text">✓</span>
                        )
                      ) : (
                        <span className="sp-num">{index + 1}</span>
                      )}
                    </span>
                  </button>
                  <span className="sp-step__label">{step.label}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <span
                    className={'sp-link' + (index < completed ? ' is-filled' : '')}
                    aria-hidden="true"
                  >
                    <span className="sp-link__fill" />
                  </span>
                )}
              </Fragment>
            )
          })}
        </div>

        <div className="sp-detail">
          <div className="sp-detail__top">
            <span className="sp-detail__eyebrow">
              {done ? 'STATUS / COMPLETE' : view < completed ? 'REVIEW / STEP' : 'CURRENT / STEP'}
            </span>
            <b className="sp-detail__title">
              {done ? '全部完成' : `0${view + 1} · ${STEPS[view].label}`}
            </b>
          </div>
          <p className="sp-detail__desc">
            {done ? '所有步骤已完成，订单正在处理中。感谢你的耐心等待。' : STEPS[view].desc}
          </p>
          <div className="sp-detail__meter">
            <span style={{ width: `${(completed / STEPS.length) * 100}%` }} />
          </div>
          <span className="sp-detail__count">{completed} / {STEPS.length} 已完成</span>
        </div>

        <div className="sp-actions">
          <button
            type="button"
            className="sp-next"
            onClick={completeCurrent}
            disabled={done}
          >
            {done ? '全部完成' : '完成当前步骤'}
          </button>
          <button type="button" className="sp-reset" onClick={reset}>
            重新演示
          </button>
        </div>
      </div>

      <p className="demo-hint">点击「完成当前步骤」推进流程 · 点击已完成圆点回看说明 · 最后一步后按钮禁用</p>
    </div>
  )
}

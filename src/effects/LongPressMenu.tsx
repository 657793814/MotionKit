import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num } from '../lib/utils'
import './LongPressMenu.css'

interface Action {
  label: string
  icon: string
  danger?: boolean
}

const ACTIONS: Action[] = [
  { label: '编辑', icon: '✎' },
  { label: '复制', icon: '⧉' },
  { label: '分享', icon: '↗' },
  { label: '删除', icon: '✕', danger: true },
]

const MOVE_TOLERANCE = 14

export default function LongPressMenuDemo({ params, replay }: DemoProps) {
  const threshold = num(params.threshold, 500)
  const lift = num(params.lift, 10)
  const scale = num(params.scale, 1.06)
  const blur = bool(params.blur, true)

  const [pressing, setPressing] = useState(false)
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const timer = useRef<number | undefined>(undefined)
  const start = useRef({ x: 0, y: 0 })

  const clearTimer = useCallback(() => {
    if (timer.current !== undefined) {
      window.clearTimeout(timer.current)
      timer.current = undefined
    }
  }, [])

  const cancelPress = useCallback(() => {
    clearTimer()
    setPressing(false)
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setPressing(false)
    setOpen(false)
    setResult(null)
  }, [clearTimer])

  useEffect(() => {
    reset()
  }, [replay, reset])

  useEffect(() => () => clearTimer(), [clearTimer])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (open || e.button !== 0) return
    clearTimer()
    start.current = { x: e.clientX, y: e.clientY }
    setPressing(true)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // 某些环境不支持指针捕获，长按逻辑仍可正常工作
    }
    timer.current = window.setTimeout(() => {
      timer.current = undefined
      setPressing(false)
      setOpen(true)
    }, threshold)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pressing) return
    const distance = Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y)
    if (distance > MOVE_TOLERANCE) {
      cancelPress()
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    if (open) return
    e.preventDefault()
    cancelPress()
    setOpen(true)
  }

  const pick = (label: string) => {
    setOpen(false)
    setResult(`已执行：${label}`)
  }

  const vars = {
    '--lpm-lift': `${lift}px`,
    '--lpm-scale': String(scale),
    '--lpm-threshold': `${threshold}ms`,
  } as React.CSSProperties

  return (
    <div className="lpm-demo" style={vars}>
      <div className="lpm-wrap">
        {blur && open && <div className="lpm-backdrop" onClick={() => setOpen(false)} />}

        <div
          className={
            'lpm-card' +
            (pressing ? ' is-pressing' : '') +
            (open ? ' is-open' : '') +
            (result ? ' has-result' : '')
          }
          role="button"
          tabIndex={0}
          aria-label="按住卡片打开快捷菜单"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={cancelPress}
          onPointerCancel={cancelPress}
          onKeyDown={onKeyDown}
        >
          <div className="lpm-card__top">
            <span className="lpm-card__tag">TRAVEL / NOTE</span>
            <span className="lpm-card__more">···</span>
          </div>
          <h3 className="lpm-card__title">周末旅行计划</h3>
          <p className="lpm-card__desc">
            把行李收好，周六一早出发去海边。先看日出，再沿着海岸线慢慢走，傍晚找一家能看见落日的小店。
          </p>
          <div className="lpm-card__blocks">
            <div className="lpm-block">
              <span>日期</span>
              <b>11 / 28 - 29</b>
            </div>
            <div className="lpm-block">
              <span>地点</span>
              <b>厦门 · 环岛路</b>
            </div>
            <div className="lpm-block">
              <span>同行</span>
              <b>3 人</b>
            </div>
          </div>
          <span className="lpm-card__hint">{pressing ? '保持按住…' : open ? '选择一项操作' : '按住卡片试试'}</span>
          <span className="lpm-card__progress" />
        </div>

        {open && (
          <div className="lpm-actions" role="menu" aria-label="快捷操作">
            {ACTIONS.map((action, i) => (
              <button
                type="button"
                role="menuitem"
                key={action.label}
                className={'lpm-action' + (action.danger ? ' is-danger' : '')}
                style={{ '--i': i } as React.CSSProperties}
                onClick={() => pick(action.label)}
                title={action.label}
              >
                <span className="lpm-action__icon">{action.icon}</span>
                <span className="lpm-action__label">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lpm-status" aria-live="polite">
        {result ? (
          <span className="lpm-result">{result}</span>
        ) : (
          <span className="lpm-tip">提前松开可取消 · 触发后卡片浮起</span>
        )}
        <button type="button" className="lpm-reset" onClick={reset}>
          重新演示
        </button>
      </div>

      <p className="demo-hint">按住卡片超过设定时长触发快捷菜单 · 移动手指或提前松开取消 · 点击操作查看状态</p>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, hexToRgba, num, str } from '../lib/utils'
import './Notification.css'

type Template = { icon: string; title: string; body: string }
type Notice = Template & { id: number }

const TEMPLATES: Template[] = [
  { icon: '✓', title: '部署成功', body: '生产环境更新已发布，所有服务运行正常。' },
  { icon: '✦', title: '新的评论', body: 'Lin 在「交互动效规范」中提到了你。' },
  { icon: '!', title: '用量提醒', body: '本周 API 调用已达配额的 80%。' },
]

export default function NotificationDemo({ params, replay }: DemoProps) {
  const [items, setItems] = useState<Notice[]>([])
  const seq = useRef(0)
  const timers = useRef<Map<number, number>>(new Map())

  const position = str(params.position, 'topRight') === 'topCenter' ? 'topCenter' : 'topRight'
  const duration = num(params.duration, 4000)
  const progress = bool(params.progress, true)
  const accent = str(params.accent, '#3b82f6')

  useEffect(() => {
    const map = timers.current
    map.forEach((t) => window.clearTimeout(t))
    map.clear()
    setItems([])
  }, [replay])

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((t) => window.clearTimeout(t))
      map.clear()
    }
  }, [])

  const remove = (id: number) => {
    const t = timers.current.get(id)
    if (t !== undefined) {
      window.clearTimeout(t)
      timers.current.delete(id)
    }
    setItems((prev) => prev.filter((n) => n.id !== id))
  }

  const push = (tpl: Template) => {
    const id = ++seq.current
    setItems((prev) => [...prev, { id, ...tpl }].slice(-3))
    const timer = window.setTimeout(() => {
      timers.current.delete(id)
      setItems((prev) => prev.filter((n) => n.id !== id))
    }, duration)
    timers.current.set(id, timer)
  }

  const animClass = position === 'topCenter' ? 'notice-card--center' : 'notice-card--right'

  return (
    <div className="notice-demo">
      <div className={'notice-stage' + (position === 'topCenter' ? ' is-center' : '')}>
        <div className="notice-topbar">
          <span className="notice-topbar__dots"><i /><i /><i /></span>
          <span>MotionKit / 概览</span>
          <span className="notice-topbar__tag">WORKSPACE</span>
        </div>

        <div className="notice-body">
          <aside className="notice-side">
            <span className="is-active">▦</span>
            <span>◈</span>
            <span>◇</span>
            <span>⌁</span>
            <span>⚙</span>
          </aside>
          <main className="notice-main">
            <h3>早上好，Lin</h3>
            <p>以下是今天的工作概览</p>
            <div className="notice-cards">
              <div className="notice-stat"><span>本周产出</span><b>28</b><em>+12%</em></div>
              <div className="notice-stat"><span>待处理</span><b>7</b><em>2 项加急</em></div>
              <div className="notice-stat"><span>协作成员</span><b>16</b><em>在线 9 人</em></div>
            </div>
            <div className="notice-chart">
              <i style={{ height: '38%' }} /><i style={{ height: '62%' }} />
              <i style={{ height: '48%' }} /><i style={{ height: '80%' }} />
              <i style={{ height: '56%' }} /><i style={{ height: '92%' }} />
              <i style={{ height: '70%' }} /><i style={{ height: '45%' }} />
            </div>
          </main>
        </div>

        <div className="notice-stack">
          {items.map((n) => (
            <div key={n.id} className={'notice-card ' + animClass}>
              <span
                className="notice-card__icon"
                style={{
                  color: accent,
                  background: hexToRgba(accent, 0.16),
                  borderColor: hexToRgba(accent, 0.35),
                }}
              >
                {n.icon}
              </span>
              <span className="notice-card__content">
                <b className="notice-card__title">{n.title}</b>
                <em className="notice-card__body">{n.body}</em>
              </span>
              <button
                type="button"
                className="notice-card__close"
                aria-label="关闭通知"
                onClick={() => remove(n.id)}
              >
                ×
              </button>
              {progress && (
                <span
                  className="notice-card__progress"
                  style={{ background: accent, animationDuration: `${duration}ms` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="notice-controls">
        <button
          type="button"
          className="notice-primary"
          onClick={() => push(TEMPLATES[seq.current % TEMPLATES.length])}
        >
          触发通知
        </button>
        <button type="button" onClick={() => TEMPLATES.forEach((t) => push(t))}>
          连续触发 3 条
        </button>
      </div>
      <p className="demo-hint">
        点击按钮触发通知 · 最多同时 3 条 · {duration}ms 后自动消失，也可手动关闭
      </p>
    </div>
  )
}

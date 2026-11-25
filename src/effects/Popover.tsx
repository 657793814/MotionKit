import { useEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, copyText, num, str } from '../lib/utils'
import './Popover.css'

type Target = {
  id: string
  label: string
  icon: string
  title: string
  desc: string
  compact: boolean
}

const TARGETS: Target[] = [
  {
    id: 'avatar',
    label: '个人资料',
    icon: 'L',
    title: 'Lin 的个人主页',
    desc: '产品设计师 · 正在探索动效与微交互。',
    compact: false,
  },
  {
    id: 'filter',
    label: '筛选',
    icon: '⚑',
    title: '筛选与排序',
    desc: '按时间、类型与状态快速缩小结果范围。',
    compact: false,
  },
  {
    id: 'more',
    label: '更多',
    icon: '···',
    title: '',
    desc: '轻量提示 · 这是一个 Tooltip',
    compact: true,
  },
]

export default function PopoverDemo({ params, replay }: DemoProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const trigger = str(params.trigger, 'click') === 'hover' ? 'hover' : 'click'
  const placement = str(params.placement, 'top') === 'bottom' ? 'bottom' : 'top'
  const arrow = bool(params.arrow, true)
  const width = num(params.width, 260)

  useEffect(() => {
    setOpenId(null)
  }, [replay])

  useEffect(() => {
    if (trigger !== 'click') return
    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current
      if (root && e.target instanceof Node && !root.contains(e.target)) {
        setOpenId(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [trigger])

  const toggle = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id))
  }

  return (
    <div className="popover-demo">
      <div ref={rootRef} className="popover-stage">
        <div className="popover-stage__head">
          <span className="popover-stage__dots"><i /><i /><i /></span>
          <span className="popover-stage__title">团队工作台</span>
          <span className="popover-stage__mode">{trigger === 'hover' ? '悬停触发' : '点击触发'}</span>
        </div>

        <div className="popover-canvas">
          <span className="popover-canvas__label">TOOLBAR PREVIEW</span>
          <div className="popover-toolbar">
            {TARGETS.map((t) => {
              const isOpen = openId === t.id
              return (
                <div
                  key={t.id}
                  className={'popover-wrap ' + (placement === 'top' ? 'is-top' : 'is-bottom')}
                  onMouseEnter={trigger === 'hover' ? () => setOpenId(t.id) : undefined}
                  onMouseLeave={
                    trigger === 'hover'
                      ? () => setOpenId((cur) => (cur === t.id ? null : cur))
                      : undefined
                  }
                >
                  <button
                    type="button"
                    className={'popover-trigger' + (isOpen ? ' is-open' : '')}
                    aria-expanded={isOpen}
                    onClick={trigger === 'click' ? () => toggle(t.id) : undefined}
                  >
                    <span className="popover-trigger__icon">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>

                  {isOpen && (
                    <div
                      className={'popover-pop' + (t.compact ? ' popover-pop--tip' : '')}
                      style={t.compact ? undefined : { width }}
                    >
                      {arrow && <i className="popover-arrow" />}
                      {t.compact ? (
                        <span className="popover-tip__text">{t.desc}</span>
                      ) : (
                        <>
                          <b className="popover-pop__title">{t.title}</b>
                          <p className="popover-pop__desc">{t.desc}</p>
                          <div className="popover-pop__actions">
                            <button
                              type="button"
                              onClick={() => {
                                void copyText('https://motionkit.dev/p/' + t.id)
                                setOpenId(null)
                              }}
                            >
                              复制链接
                            </button>
                            <button
                              type="button"
                              className="is-primary"
                              onClick={() => setOpenId(null)}
                            >
                              编辑资料
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <span className="popover-canvas__note">MotionKit · 交互预览</span>
        </div>
      </div>
      <p className="demo-hint">
        {trigger === 'hover' ? '悬停' : '点击'}工具按钮 · 气泡在{placement === 'top' ? '上' : '下'}方展开 · 点击空白处关闭
      </p>
    </div>
  )
}

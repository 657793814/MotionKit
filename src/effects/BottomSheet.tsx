import { useEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num } from '../lib/utils'
import './BottomSheet.css'

type DragState = { active: boolean; startY: number; dy: number }

const ROWS: { icon: string; title: string; sub: string }[] = [
  { icon: '◈', title: '灵感广场', sub: '发现今天的精选灵感' },
  { icon: '⌁', title: '热门话题', sub: '12.8k 人正在讨论' },
  { icon: '✦', title: '创作挑战', sub: '本周新挑战已开启' },
  { icon: '◇', title: '我的收藏', sub: '你保存的 26 条内容' },
]

const CHIPS = ['最新发布', '最多点赞', '仅看图片', '本周', '同城', '已关注']

export default function BottomSheetDemo({ params, replay }: DemoProps) {
  const [open, setOpen] = useState(false)
  const [dy, setDy] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<DragState>({ active: false, startY: 0, dy: 0 })

  const height = num(params.height, 62)
  const backdrop = bool(params.backdrop, true)
  const canDrag = bool(params.drag, true)
  const radius = num(params.radius, 20)

  useEffect(() => {
    drag.current = { active: false, startY: 0, dy: 0 }
    setDy(0)
    setDragging(false)
    setOpen(false)
  }, [replay])

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canDrag) return
    drag.current = { active: true, startY: e.clientY, dy: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active) return
    d.dy = Math.max(0, e.clientY - d.startY)
    setDy(d.dy)
  }

  const onUp = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    setDragging(false)
    if (d.dy > 72) setOpen(false)
    setDy(0)
  }

  return (
    <div className="sheet-demo">
      <div className="sheet-phone">
        <div className="sheet-status">
          <span>9:41</span>
          <span className="sheet-status__right">▮▮▮ ▰</span>
        </div>
        <div className="sheet-appbar">
          <b>发现</b>
          <span>⌕</span>
        </div>

        <div className="sheet-list">
          {ROWS.map((r) => (
            <div key={r.title} className="sheet-row">
              <span className="sheet-row__icon">{r.icon}</span>
              <span className="sheet-row__text">
                <b>{r.title}</b>
                <em>{r.sub}</em>
              </span>
              <span className="sheet-row__arrow">›</span>
            </div>
          ))}
        </div>

        {backdrop && (
          <div
            className={'sheet-backdrop' + (open ? ' is-open' : '')}
            onClick={() => setOpen(false)}
          />
        )}

        <div
          className={'sheet-panel' + (open ? ' is-open' : '') + (dragging ? ' is-dragging' : '')}
          style={{
            height: `${height}%`,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            transform: open ? `translateY(${dy}px)` : undefined,
          }}
        >
          <div
            className={'sheet-grip' + (canDrag ? ' is-draggable' : '')}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <i />
          </div>
          <div className="sheet-panel__head">
            <b>筛选条件</b>
            <span>4 项可选</span>
          </div>
          <div className="sheet-chips">
            {CHIPS.map((c, i) => (
              <button
                key={c}
                type="button"
                className={'sheet-chip' + (i < 2 ? ' is-active' : '')}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="sheet-panel__foot">
            <button type="button" className="sheet-apply" onClick={() => setOpen(false)}>
              应用筛选
            </button>
          </div>
        </div>

        <div className="sheet-footer">
          <button type="button" className="sheet-trigger" onClick={() => setOpen(true)}>
            筛选与排序
          </button>
        </div>
      </div>
      <p className="demo-hint">
        点击「筛选与排序」弹出面板{canDrag ? ' · 按住把手下滑超过阈值关闭，否则回弹' : ''}
      </p>
    </div>
  )
}

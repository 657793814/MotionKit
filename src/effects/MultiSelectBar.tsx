import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, hexToRgba, num, str } from '../lib/utils'
import './MultiSelectBar.css'

interface FileItem {
  icon: string
  name: string
  meta: string
}

const ITEMS: FileItem[] = [
  { icon: '▤', name: '品牌视觉规范.pdf', meta: 'PDF 文档 · 2.4 MB' },
  { icon: '◧', name: '首页动效演示.mp4', meta: '视频文件 · 18.6 MB' },
  { icon: '◇', name: '组件清单.fig', meta: '设计文件 · 5.1 MB' },
  { icon: '▦', name: '交互流程图.png', meta: '图片 · 860 KB' },
  { icon: '▥', name: '用户调研报告.docx', meta: '文档 · 1.2 MB' },
  { icon: '◈', name: '发布计划.xlsx', meta: '表格 · 340 KB' },
]

function MsCheck({ checked }: { checked: boolean }) {
  return (
    <span className={'ms-check' + (checked ? ' is-checked' : '')} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path className="ms-check__path" d="M5 12.6l4.4 4.4L19.2 7.6" />
      </svg>
    </span>
  )
}

export default function MultiSelectBarDemo({ params, replay }: DemoProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [flash, setFlash] = useState('')

  const accent = str(params.accent, '#3b82f6')
  const barHeight = num(params.barHeight, 60)
  const anim = str(params.anim, 'slide') === 'spring' ? 'spring' : 'slide'
  const selectAll = bool(params.selectAll, true)

  useEffect(() => {
    setSelected([])
    setFlash('')
  }, [replay])

  useEffect(() => {
    if (!flash) return
    const handle = window.setTimeout(() => setFlash(''), 1800)
    return () => window.clearTimeout(handle)
  }, [flash])

  const count = selected.length
  const multi = count > 0
  const allSelected = count === ITEMS.length

  const toggle = (index: number) => {
    setSelected((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }
  const toggleAll = () => setSelected(allSelected ? [] : ITEMS.map((_, i) => i))
  const clear = () => setSelected([])

  const vars = {
    '--ms-accent': accent,
    '--ms-accent-soft': hexToRgba(accent, 0.16),
    '--ms-accent-glow': hexToRgba(accent, 0.38),
    '--ms-bar-h': `${barHeight}px`,
    '--ms-ease': anim === 'spring'
      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'cubic-bezier(0.22, 1, 0.36, 1)',
  } as React.CSSProperties

  return (
    <div className="ms-demo" style={vars}>
      <div className={'ms-card' + (multi ? ' is-multi' : '')}>
        <div className="ms-card__head">
          <div>
            <span className="ms-card__eyebrow">FILE MANAGER / 项目资源</span>
            <h3 className="ms-card__title">资源管理器</h3>
          </div>
          <span className="ms-card__badge">{multi ? `多选 ${count}` : `${ITEMS.length} 个文件`}</span>
        </div>

        <div className="ms-list">
          {selectAll && (
            <button type="button" className="ms-row ms-row--all" onClick={toggleAll}>
              <MsCheck checked={allSelected} />
              <span className="ms-row__label">全选</span>
              <span className="ms-row__hint">{allSelected ? '取消全选' : `选择全部 ${ITEMS.length} 项`}</span>
            </button>
          )}
          {ITEMS.map((item, index) => (
            <button
              type="button"
              key={item.name}
              className={'ms-row' + (selected.includes(index) ? ' is-selected' : '')}
              onClick={() => toggle(index)}
            >
              <MsCheck checked={selected.includes(index)} />
              <span className="ms-row__icon">{item.icon}</span>
              <span className="ms-row__text">
                <b>{item.name}</b>
                <em>{item.meta}</em>
              </span>
              <span className="ms-row__arrow">›</span>
            </button>
          ))}
        </div>

        {flash && <span className="ms-flash">{flash}</span>}

        <div className={'ms-bar' + (multi ? ' is-open' : '')}>
          <div className="ms-bar__count">
            <span className="ms-bar__dot" />
            已选 <b>{count}</b> 项
          </div>
          <div className="ms-bar__actions">
            <button type="button" onClick={() => setFlash(`已移动 ${count} 项`)}>移动</button>
            <button type="button" onClick={() => setFlash(`已处理 ${count} 项（演示）`)}>删除</button>
            <button type="button" onClick={() => setFlash('更多操作已展开')}>更多</button>
          </div>
          <button type="button" className="ms-bar__cancel" onClick={clear} aria-label="取消选择">✕</button>
        </div>
      </div>
      <p className="demo-hint">
        点击文件进入多选态 · 勾选笔画逐笔绘制 · 操作栏高度 {barHeight}px · {anim === 'spring' ? '弹性' : '滑动'}出现 · 取消全部后收起
      </p>
    </div>
  )
}

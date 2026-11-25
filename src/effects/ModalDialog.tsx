import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num } from '../lib/utils'
import './ModalDialog.css'

export default function ModalDialogDemo({ params, replay }: DemoProps) {
  const [open, setOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const backdrop = bool(params.backdrop, true)
  const scale = num(params.scale, 0.88)
  const duration = num(params.duration, 360)
  const spring = bool(params.spring, true)

  useEffect(() => {
    setOpen(false)
    setDeleted(false)
  }, [replay])

  const reset = () => {
    setOpen(false)
    setDeleted(false)
  }

  const vars = {
    '--modal-scale': String(scale),
    '--modal-duration': `${duration}ms`,
    '--modal-ease': spring
      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      : 'cubic-bezier(0.22, 1, 0.36, 1)',
  } as React.CSSProperties

  return (
    <div className="modal-demo" style={vars}>
      <div className="modal-page">
        <div className="modal-page__top">
          <div>
            <span className="modal-page__eyebrow">WORKSPACE / SETTINGS</span>
            <h3 className="modal-page__title">项目设置</h3>
          </div>
          <span className="modal-page__badge">PRO</span>
        </div>

        <div className="modal-page__rows">
          <div className="modal-row"><span>项目名称</span><b>MotionKit 设计系统</b></div>
          <div className="modal-row"><span>可见性</span><b>团队内部</b></div>
          <div className="modal-row"><span>成员数量</span><b>12 人</b></div>
        </div>

        <div className={'modal-danger' + (deleted ? ' is-deleted' : '')}>
          <div className="modal-danger__info">
            <b>{deleted ? '项目已删除' : '危险操作'}</b>
            <span>{deleted ? '相关资源已移入回收站，演示已完成。' : '删除后无法撤销，请谨慎操作。'}</span>
          </div>
          {deleted ? (
            <span className="modal-danger__done">✓ 已完成</span>
          ) : (
            <button type="button" className="modal-delete" onClick={() => setOpen(true)}>
              删除项目
            </button>
          )}
        </div>
      </div>

      <button type="button" className="modal-reset" onClick={reset}>
        重新演示
      </button>

      {open && (
        <div className="modal-layer" onClick={() => setOpen(false)}>
          {backdrop && <div className="modal-backdrop" />}
          <div
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog__icon">!</div>
            <h4 id="modal-dialog-title" className="modal-dialog__title">删除这个项目？</h4>
            <p className="modal-dialog__desc">
              此操作将永久删除「MotionKit 设计系统」及其全部数据，且无法恢复。请确认是否继续。
            </p>
            <div className="modal-dialog__actions">
              <button type="button" className="modal-btn modal-btn--ghost" onClick={() => setOpen(false)}>
                取消
              </button>
              <button
                type="button"
                className="modal-btn modal-btn--danger"
                onClick={() => {
                  setOpen(false)
                  setDeleted(true)
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="demo-hint">点击「删除项目」打开确认弹窗 · 点击遮罩或取消关闭 · 确认后查看成功状态</p>
    </div>
  )
}

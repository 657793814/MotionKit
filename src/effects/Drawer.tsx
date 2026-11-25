import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num, str } from '../lib/utils'
import './Drawer.css'

interface Order {
  id: string
  name: string
  amount: string
  status: string
  date: string
}

const ORDERS: Order[] = [
  { id: 'MK-2601-0081', name: '动效组件专业版', amount: '¥ 899.00', status: '已完成', date: '2026-11-02' },
  { id: 'MK-2601-0074', name: '团队协作席位 × 5', amount: '¥ 450.00', status: '处理中', date: '2026-10-28' },
  { id: 'MK-2601-0062', name: '设计系统定制服务', amount: '¥ 2,400.00', status: '已完成', date: '2026-10-15' },
  { id: 'MK-2601-0047', name: '图标资源扩展包', amount: '¥ 129.00', status: '已取消', date: '2026-09-30' },
]

export default function DrawerDemo({ params, replay }: DemoProps) {
  const side = str(params.side, 'right') === 'left' ? 'left' : 'right'
  const width = num(params.width, 420)
  const backdrop = bool(params.backdrop, true)
  const duration = num(params.duration, 380)

  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    setOpen(false)
    setOrder(null)
  }, [replay])

  const vars = {
    '--drawer-width': `${width}px`,
    '--drawer-duration': `${duration}ms`,
    '--drawer-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
  } as React.CSSProperties

  const show = (item: Order) => {
    setOrder(item)
    setOpen(true)
  }

  return (
    <div className="drawer-demo" style={vars}>
      <div className="drawer-page">
        <div className="drawer-page__head">
          <div>
            <span className="drawer-page__eyebrow">ACCOUNT / ORDERS</span>
            <h3 className="drawer-page__title">订单列表</h3>
          </div>
          <span className="drawer-page__count">{ORDERS.length} 笔订单</span>
        </div>

        <div className="drawer-orders">
          {ORDERS.map((item) => (
            <div key={item.id} className="drawer-order">
              <div className="drawer-order__main">
                <b>{item.name}</b>
                <span>{item.id} · {item.date}</span>
              </div>
              <div className="drawer-order__side">
                <b>{item.amount}</b>
                <span className={item.status === '已完成' ? 'is-done' : undefined}>{item.status}</span>
              </div>
              <button type="button" className="drawer-order__btn" onClick={() => show(item)}>
                查看详情
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`drawer-layer${open ? ' is-open' : ''}${side === 'left' ? ' is-left' : ''}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      >
        {backdrop && <div className="drawer-backdrop" />}
        <aside
          className="drawer-panel"
          role="dialog"
          aria-label="订单详情"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-panel__head">
            <span className="drawer-panel__eyebrow">ORDER DETAIL</span>
            <h4 className="drawer-panel__title">订单详情</h4>
            <p className="drawer-panel__desc">查看这笔订单的完整信息。</p>
          </div>

          <div className="drawer-panel__body">
            <div className="drawer-field"><span>订单编号</span><b>{order?.id ?? '—'}</b></div>
            <div className="drawer-field"><span>商品名称</span><b>{order?.name ?? '—'}</b></div>
            <div className="drawer-field"><span>下单日期</span><b>{order?.date ?? '—'}</b></div>
            <div className="drawer-field"><span>订单状态</span><b>{order?.status ?? '—'}</b></div>
            <div className="drawer-field drawer-field--total"><span>实付金额</span><b>{order?.amount ?? '—'}</b></div>
          </div>

          <div className="drawer-panel__foot">
            <button type="button" className="drawer-close" onClick={() => setOpen(false)}>
              关闭
            </button>
          </div>
        </aside>
      </div>

      <p className="demo-hint">点击任一订单的「查看详情」打开抽屉 · 点击遮罩或「关闭」收起</p>
    </div>
  )
}

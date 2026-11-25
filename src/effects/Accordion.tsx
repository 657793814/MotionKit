import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num, str } from '../lib/utils'
import './Accordion.css'

const FAQS = [
  {
    q: 'MotionKit 是什么？',
    a: '一个面向界面的动效样式库：把常用的过渡、手势与反馈沉淀成可复用的组件模式，并提供可调参数，方便直接套用到真实产品中。',
  },
  {
    q: '动画的时长和缓动怎么调？',
    a: '每个效果都暴露了 duration 与 easing 参数。时长控制动画节奏，缓动决定速度曲线；选择 spring 会使用带回弹的贝塞尔曲线，让展开更有弹性。',
  },
  {
    q: '是否支持系统减少动态效果？',
    a: '支持。所有效果都包含 prefers-reduced-motion 降级：当系统开启减少动态效果时，位移、缩放与循环动画会被关闭，仅保留必要的状态变化。',
  },
  {
    q: '可以一次展开多个面板吗？',
    a: '可以。关闭「单开模式」后，每个问题都能独立展开，适合内容较多的帮助中心；开启后则始终保持只有一个面板处于展开状态。',
  },
]

export default function AccordionDemo({ params, replay }: DemoProps) {
  const duration = num(params.duration, 320)
  const easing = str(params.easing, 'smooth') === 'spring' ? 'spring' : 'smooth'
  const single = bool(params.single, true)
  const icon = str(params.icon, 'plus') === 'chevron' ? 'chevron' : 'plus'

  const [open, setOpen] = useState<number[]>([])

  useEffect(() => {
    setOpen([])
  }, [replay])

  const toggle = (index: number) => {
    setOpen((prev) => {
      if (prev.includes(index)) return prev.filter((i) => i !== index)
      return single ? [index] : [...prev, index]
    })
  }

  const vars = {
    '--acc-duration': `${duration}ms`,
    '--acc-ease':
      easing === 'spring'
        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        : 'cubic-bezier(0.22, 1, 0.36, 1)',
  } as React.CSSProperties

  return (
    <div className="acc-demo" style={vars}>
      <div className={`acc-list acc-list--${icon}`}>
        <div className="acc-head">
          <div>
            <span className="acc-head__eyebrow">HELP / CENTER</span>
            <h3 className="acc-head__title">常见问题</h3>
          </div>
          <span className="acc-head__meta">0{FAQS.length} · FAQ</span>
        </div>

        {FAQS.map((faq, index) => {
          const expanded = open.includes(index)
          return (
            <div key={faq.q} className={'acc-item' + (expanded ? ' is-open' : '')}>
              <button
                type="button"
                className="acc-q"
                aria-expanded={expanded}
                aria-controls={`acc-panel-${index}`}
                onClick={() => toggle(index)}
              >
                <span className="acc-q__num">0{index + 1}</span>
                <span className="acc-q__text">{faq.q}</span>
                <span className="acc-icon" aria-hidden="true">
                  {icon === 'plus' ? (
                    <>
                      <i />
                      <i />
                    </>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="none">
                      <path d="M4.5 7.5 10 13l5.5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </button>
              <div className="acc-panel" id={`acc-panel-${index}`} role="region">
                <div className="acc-panel__inner">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="demo-hint">点击问题行展开答案 · 下方内容被平滑推开 · {single ? '当前为单开模式' : '当前可同时展开多项'}</p>
    </div>
  )
}

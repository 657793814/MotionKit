import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import './Stagger.css'

const items = [
  { icon: '◆', name: '设计语言', desc: '颜色、字阶与间距的统一约定', tag: 'FOUNDATION' },
  { icon: '◇', name: '组件资产', desc: '可组合、可追溯，保持同一套语法', tag: 'LIBRARY' },
  { icon: '◈', name: '动效规范', desc: '每一条曲线都说明它存在的理由', tag: 'MOTION' },
  { icon: '◉', name: '交付流水线', desc: '设计变更自动同步到代码仓库', tag: 'PIPELINE' },
  { icon: '◐', name: '质量校验', desc: '视觉回归与可访问性双重检查', tag: 'QUALITY' },
]

export default function StaggerDemo({ params, replay, onReplay, onParamChange }: DemoProps) {
  const stagger = num(params.stagger, 90)
  const duration = num(params.duration, 500)
  const distance = num(params.distance, 18)
  const direction = str(params.direction, 'up')
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(false)
    const timer = window.setTimeout(() => setOn(true), 60)
    return () => window.clearTimeout(timer)
  }, [stagger, duration, direction, replay])

  return (
    <div className="stagger-demo">
      <div className="stagger-panel">
        <div className="stagger-head">
          <div>
            <span className="eyebrow">STAGGER ORCHESTRATION</span>
            <h4>五件事，按顺序到场</h4>
          </div>
          <button type="button" className="demo-btn" onClick={() => onReplay?.()}>
            ↻ 重新入场
          </button>
        </div>
        <ul
          className={`stagger-list dir-${direction}` + (on ? ' is-in' : '')}
          style={
            {
              '--stg-duration': `${duration}ms`,
              '--stg-distance': `${distance}px`,
            } as React.CSSProperties
          }
        >
          {items.map((item, i) => (
            <li
              key={item.name}
              className="stagger-item"
              style={{ transitionDelay: `${i * stagger}ms` }}
            >
              <span className="stagger-item__icon">{item.icon}</span>
              <div className="stagger-item__main">
                <strong>{item.name}</strong>
                <span>{item.desc}</span>
              </div>
              <span className="stagger-item__tag">{item.tag}</span>
              <span className="stagger-item__no">0{i + 1}</span>
            </li>
          ))}
        </ul>
        <div className="stagger-foot">
          <span>间隔 {stagger}ms · 共 {(items.length * stagger) / 1000}s 完成编排</span>
          <span className="stagger-foot__bars">
            {items.map((_, i) => (
              <i key={i} style={{ animationDelay: `${i * stagger}ms` }} />
            ))}
          </span>
        </div>
      </div>
      <p className="demo-hint">元素按 {stagger}ms 间隔依次入场 · 可单独重播</p>
    </div>
  )
}

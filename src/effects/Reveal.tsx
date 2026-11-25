import { useEffect, useRef } from 'react'
import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import './Reveal.css'

const items = [
  { tag: '01 / 发现', title: '从噪音里找到信号', desc: '把散落的信息整理成清晰的上下文，先理解问题，再给出动作。' },
  { tag: '02 / 规划', title: '把目标拆成可执行的步骤', desc: '每个步骤都有明确的输入、输出与回滚点，复杂任务也能被拆解。' },
  { tag: '03 / 执行', title: '执行，而不是只给建议', desc: '调用工具、读取数据、生成结果，过程中的每一步都留下记录。' },
  { tag: '04 / 验证', title: '结果可被检验', desc: '关键结论附带依据，出现问题时可以快速定位到具体的环节。' },
  { tag: '05 / 协作', title: '人和系统共享同一份上下文', desc: '评论、修改与审批都发生在同一个工作空间，不需要反复同步。' },
  { tag: '06 / 沉淀', title: '把一次成功变成可复用的能力', desc: '将流程保存为模板，下次只需要换一个目标。' },
]

export default function RevealDemo({ params, replay }: DemoProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const direction = str(params.direction, 'up')
  const distance = num(params.distance, 40)
  const duration = num(params.duration, 700)
  const blur = num(params.blur, 6)
  const stagger = num(params.stagger, 80)

  useEffect(() => {
    const root = scroller.current
    if (!root) return
    root.scrollTop = 0
    const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal-item'))
    els.forEach((el) => el.classList.remove('is-visible'))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { root, threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [direction, distance, duration, blur, stagger, replay])

  return (
    <div className="reveal-demo">
      <div className="reveal-demo__bar">
        <span className="reveal-demo__dots"><i /><i /><i /></span>
        <span>product-story.html</span>
        <span className="reveal-demo__badge">滚动 ↓</span>
      </div>
      <div
        ref={scroller}
        className={`reveal-scroller dir-${direction}`}
        style={
          {
            '--rev-distance': `${distance}px`,
            '--rev-duration': `${duration}ms`,
            '--rev-blur': `${blur}px`,
            '--rev-stagger': `${stagger}ms`,
          } as React.CSSProperties
        }
      >
        <div className="reveal-intro">
          <span className="eyebrow">SCROLL REVEAL</span>
          <h3>内容在滚动中抵达</h3>
          <p>向下滚动，每一段内容都会在自己的时机进入视野。</p>
        </div>
        {items.map((item, i) => (
          <article
            key={item.title}
            className="reveal-item"
            style={{ transitionDelay: `${(i % 3) * stagger}ms` }}
          >
            <div className="reveal-item__no">{item.tag.split(' / ')[0]}</div>
            <div>
              <span className="reveal-item__tag">{item.tag.split(' / ')[1]}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </article>
        ))}
        <div className="reveal-end">
          <span>END OF SECTION</span>
          <p>你已经看完了这一屏。</p>
        </div>
      </div>
    </div>
  )
}

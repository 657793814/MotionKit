import { useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num, str } from '../lib/utils'
import './ScrollStory.css'

const chapters = [
  {
    no: '01',
    kicker: 'UNDERSTAND',
    title: '捕捉意图',
    desc: '自然语言进入系统。先理解目标、约束与上下文，再决定要做什么，而不是急着给出一个看起来正确的答案。',
    meta: ['语义解析', '上下文补全', '目标对齐'],
    glyph: '◎',
  },
  {
    no: '02',
    kicker: 'ORCHESTRATE',
    title: '编排流程',
    desc: '把复杂任务拆成可执行、可回滚的步骤。每一步都有明确的输入与产出，失败时知道该退回哪里。',
    meta: ['任务拆解', '工具调用', '失败回滚'],
    glyph: '⌘',
  },
  {
    no: '03',
    kicker: 'DELIVER',
    title: '交付结果',
    desc: '结果不是一段漂亮的文字，而是可以被验证的事实。关键结论附带依据，过程完整留痕。',
    meta: ['结果校验', '依据追溯', '一键导出'],
    glyph: '✓',
  },
]

export default function ScrollStoryDemo({ params }: DemoProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const accent = str(params.accent, '#3b82f6')
  const smooth = num(params.smooth, 260)
  const zoom = bool(params.zoom, true)
  const showProgress = bool(params.progress, true)

  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    const p = max > 0 ? el.scrollTop / max : 0
    setProgress(p)
    setActive(Math.min(chapters.length - 1, Math.floor(p * chapters.length + 0.15)))
  }

  const jumpTo = (idx: number) => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    el.scrollTo({ top: (max * (idx + 0.5)) / chapters.length, behavior: 'smooth' })
  }

  return (
    <div className="story-demo">
      <div
        ref={scroller}
        className="story-scroll"
        onScroll={onScroll}
        style={
          {
            '--story-accent': accent,
            '--story-soft': `${accent}2b`,
            '--story-smooth': `${smooth}ms`,
            '--story-zoom': zoom ? 1 : 0,
          } as React.CSSProperties
        }
      >
        <div className="story-track">
          <div className="story-sticky">
            <div className="story-visual">
              <div className="story-visual__grid" />
              <div className="story-orb" />
              <div className="story-orb story-orb--sm" />
              {chapters.map((c, i) => (
                <div key={c.no} className={'story-scene' + (active === i ? ' is-active' : '')}>
                  <span className="story-scene__no">{c.no}</span>
                  <span className="story-scene__glyph">{c.glyph}</span>
                  <span className="story-scene__label">{c.kicker}</span>
                </div>
              ))}
              <div className="story-hud">
                <span className="story-hud__live"><i /> LIVE</span>
                <button type="button" onClick={() => jumpTo(chapters.length - 1)}>
                  跳过 →
                </button>
              </div>
              <div className="story-hud story-hud--bottom">
                <span>0{active + 1} / 0{chapters.length}</span>
                <span className="story-hud__hint">SCROLL</span>
              </div>
            </div>

            <div className="story-copy">
              <div className="story-copy__head">
                <span className="eyebrow">HOW IT WORKS</span>
                <span className="story-copy__counter">0{active + 1}</span>
              </div>
              <div className="story-chapters">
                {chapters.map((c, i) => (
                  <article
                    key={c.no}
                    className={'story-chapter' + (active === i ? ' is-active' : '')}
                  >
                    <span className="story-chapter__kicker">{c.kicker}</span>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                    <ul>
                      {c.meta.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <div className="story-dots">
                {chapters.map((c, i) => (
                  <button
                    key={c.no}
                    type="button"
                    className={active === i ? 'is-active' : ''}
                    onClick={() => jumpTo(i)}
                    aria-label={`跳转到第 ${i + 1} 章`}
                  >
                    <i />
                    <span>0{i + 1}</span>
                  </button>
                ))}
              </div>

              {showProgress && (
                <div className="story-progress">
                  <div className="story-progress__track">
                    <i style={{ transform: `scaleX(${Math.max(0.02, progress)})` }} />
                  </div>
                  <div className="story-progress__labels">
                    <span>PROGRESS</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="demo-hint">在预览区向下滚动 · 章节随进度切换</p>
    </div>
  )
}

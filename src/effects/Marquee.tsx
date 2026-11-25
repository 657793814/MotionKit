import type { DemoProps } from '../lib/types'
import { bool, num, str } from '../lib/utils'
import './Marquee.css'

const rowOne = [
  { glyph: '◆', label: 'DESIGN SYSTEM' },
  { glyph: '✦', label: 'MOTION' },
  { glyph: '◈', label: '23 EFFECTS' },
  { glyph: '◎', label: 'AI READY' },
  { glyph: '▲', label: 'REACT 19' },
  { glyph: '●', label: 'CSS NATIVE' },
  { glyph: '◇', label: 'TYPESCRIPT' },
]

const rowTwo = ['MOTION', 'CRAFT', 'RHYTHM', 'DETAIL', 'SYSTEM', 'FEELING']

export default function MarqueeDemo({ params }: DemoProps) {
  const speed = num(params.speed, 24)
  const gap = num(params.gap, 20)
  const direction = str(params.direction, 'left')
  const pause = bool(params.pause, true)
  const fade = bool(params.fade, true)

  const groupOne = (copy: number) => (
    <ul className="mq-group" aria-hidden={copy === 1} key={copy}>
      {rowOne.map((tag) => (
        <li key={tag.label} className="mq-tag">
          <span>{tag.glyph}</span>
          {tag.label}
        </li>
      ))}
    </ul>
  )

  const groupTwo = (copy: number) => (
    <ul className="mq-group mq-group--big" aria-hidden={copy === 1} key={copy}>
      {rowTwo.map((word) => (
        <li key={word} className="mq-word">
          {word}
          <i>✳</i>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="mq-demo">
      <div
        className={
          'mq-wrap' +
          (pause ? ' is-pausable' : '') +
          (fade ? ' is-faded' : '') +
          (direction === 'right' ? ' to-right' : '')
        }
        style={
          {
            '--mq-speed': `${speed}s`,
            '--mq-gap': `${gap}px`,
          } as React.CSSProperties
        }
      >
        <div className="mq-meta">
          <span className="mq-meta__label"><i /> NOW TRENDING</span>
          <span className="mq-meta__count">∞ LOOP</span>
        </div>

        <div className="mq-row">
          <div className="mq-track">{[0, 1].map(groupOne)}</div>
        </div>

        <div className="mq-row mq-row--alt">
          <div className="mq-track">{[0, 1].map(groupTwo)}</div>
        </div>

        <div className="mq-meta mq-meta--foot">
          <span>悬停{pause ? '暂停' : '不暂停'} · {speed}s / 圈</span>
          <span className="mq-meta__dir">{direction === 'left' ? '← LEFT' : 'RIGHT →'}</span>
        </div>
      </div>
      <p className="demo-hint">水平无缝循环 · {pause ? '鼠标悬停即暂停' : '当前悬停不暂停'}</p>
    </div>
  )
}

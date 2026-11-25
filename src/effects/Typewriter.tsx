import { useEffect, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { bool, num, str } from '../lib/utils'
import './Typewriter.css'

export default function TypewriterDemo({ params, replay }: DemoProps) {
  const text = str(params.text, '你好，我是 MotionKit。\n让界面动起来。')
  const speed = num(params.speed, 60)
  const loop = bool(params.loop, true)
  const cursor = bool(params.cursor, true)
  const [count, setCount] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setCount(0)
    setDeleting(false)
  }, [text, replay])

  useEffect(() => {
    if (!loop && count === text.length && !deleting) return
    const done = count === text.length && !deleting
    const delay = deleting ? 26 : done ? 1700 : speed
    const timer = window.setTimeout(() => {
      if (!deleting) {
        if (count < text.length) setCount(count + 1)
        else if (loop) setDeleting(true)
      } else if (count > 0) {
        setCount(count - 1)
      } else {
        setDeleting(false)
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [count, deleting, text, speed, loop])

  const done = count === text.length && !deleting

  return (
    <div className="type-demo">
      <div className="type-window">
        <div className="type-bar">
          <span className="type-bar__dots"><i /><i /><i /></span>
          <span className="type-bar__title">~/motionkit — zsh</span>
          <span className="type-bar__status">{done ? 'DONE' : deleting ? 'DEL' : 'TYPING'}</span>
        </div>
        <div className="type-body">
          <div className="type-line">
            <span className="type-prompt">❯</span>
            <span className="type-cmd">motionkit init</span>
          </div>
          <div className="type-output">
            <p className="type-text">
              {text.slice(0, count)}
              {cursor && (
                <span className={'type-caret' + (deleting ? ' is-deleting' : '')} />
              )}
            </p>
          </div>
          <div className="type-line type-line--muted">
            <span className="type-prompt">❯</span>
            <span className="type-ghost">准备好之后，按 Enter 继续_</span>
          </div>
        </div>
        <div className="type-foot">
          <span>{count} / {text.length} CHARS</span>
          <span>UTF-8 · {speed}MS / CHAR</span>
        </div>
      </div>
      <p className="demo-hint">打字机逐字输入 · {loop ? '完成后循环回删' : '完成后停留'}</p>
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import './TextDecode.css'

const CHARSETS: Record<string, string> = {
  tech: '!<>-_\\/[]{}—=+*^?#$%&',
  alnum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  binary: '01',
  kana: 'アイウエオカキクケコサシスセソタチツテト',
}

const CHARSET_LABEL: Record<string, string> = {
  tech: 'TECH_SYMBOLS',
  alnum: 'ALPHANUMERIC',
  binary: 'BINARY',
  kana: 'KATAKANA',
}

export default function TextDecodeDemo({ params, replay }: DemoProps) {
  const text = str(params.text, '构建下一代交互体验') || '构建下一代交互体验'
  const duration = num(params.duration, 1500)
  const charsetId = str(params.charset, 'tech')
  const trigger = str(params.trigger, 'auto')
  const [display, setDisplay] = useState(text)
  const [progress, setProgress] = useState(1)
  const raf = useRef(0)

  const start = useCallback(() => {
    cancelAnimationFrame(raf.current)
    const chars = CHARSETS[charsetId] ?? CHARSETS.tech
    const glyphs = Array.from(text)
    const total = Math.max(1, glyphs.length)
    const begin = performance.now()

    const frame = (now: number) => {
      const t = Math.min(1, (now - begin) / duration)
      const resolved = Math.floor(t * total)
      setProgress(t)
      setDisplay(
        glyphs
          .map((ch, i) => {
            if (i < resolved || ch === ' ' || ch === '\n') return ch
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(''),
      )
      if (t < 1) raf.current = requestAnimationFrame(frame)
      else {
        setDisplay(text)
        setProgress(1)
      }
    }
    raf.current = requestAnimationFrame(frame)
  }, [charsetId, duration, text])

  useEffect(() => {
    if (trigger === 'auto') start()
    else {
      cancelAnimationFrame(raf.current)
      setDisplay(text)
      setProgress(1)
    }
    return () => cancelAnimationFrame(raf.current)
  }, [start, trigger, replay])

  return (
    <div className="decode-demo">
      <div
        className="decode-panel"
        onPointerEnter={() => trigger === 'hover' && start()}
        onClick={() => trigger === 'hover' && start()}
      >
        <span className="decode-corner decode-corner--tl" />
        <span className="decode-corner decode-corner--tr" />
        <span className="decode-corner decode-corner--bl" />
        <span className="decode-corner decode-corner--br" />
        <div className="decode-head">
          <span className="decode-status">
            <i className={progress < 1 ? 'is-live' : ''} />
            {progress < 1 ? 'DECODING' : 'DECODED'}
          </span>
          <span className="decode-id">TEXT_DECODE / {CHARSET_LABEL[charsetId]}</span>
        </div>
        <div className="decode-body">
          <span className="decode-caret">›_</span>
          <h2 className="decode-title" key={replay}>
            {display}
          </h2>
        </div>
        <div className="decode-linear">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="decode-foot">
          <span>DURATION {duration}MS</span>
          <span>{Math.round(progress * 100).toString().padStart(3, '0')}%</span>
        </div>
        <div className="decode-scan" />
      </div>
      <div className="decode-actions">
        <button type="button" className="demo-btn" onClick={start}>
          <span>↻</span> 重新解码
        </button>
        <span className="demo-hint">
          {trigger === 'hover' ? '悬停或点击面板触发' : '自动播放 · 可点击重播'}
        </span>
      </div>
    </div>
  )
}

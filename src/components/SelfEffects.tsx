import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from '../lib/hooks'
import './SelfEffects.css'

/** 打字机：逐字输入、短暂停留、回删，循环下一句。 */
export function useTypewriter(
  phrases: string[],
  { speed = 52, pause = 1500, deleteSpeed = 24 } = {},
) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      setText(phrases[0] ?? '')
      return
    }
    const full = phrases[index % phrases.length] ?? ''
    const delay = deleting ? deleteSpeed : text.length === full.length ? pause : speed
    const timer = window.setTimeout(() => {
      if (!deleting && text.length < full.length) {
        setText(full.slice(0, text.length + 1))
      } else if (!deleting) {
        setDeleting(true)
      } else if (text.length > 0) {
        setText(full.slice(0, text.length - 1))
      } else {
        setDeleting(false)
        setIndex((i) => i + 1)
      }
    }, delay)
    return () => window.clearTimeout(timer)
  }, [text, deleting, index, phrases, speed, pause, deleteSpeed, reduced])

  return text
}

export function TypewriterText({
  phrases,
  className,
  speed,
  pause,
}: {
  phrases: string[]
  className?: string
  speed?: number
  pause?: number
}) {
  const text = useTypewriter(phrases, { speed, pause })
  return (
    <span className={className}>
      {text}
      <i className="kit-caret" aria-hidden="true" />
    </span>
  )
}

/** 只在元素进入视口后开始播放，避免标题在屏外把动画跑完。 */
function useArmed(whenVisible: boolean) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const [armed, setArmed] = useState(!whenVisible || reduced)

  useEffect(() => {
    if (!whenVisible || reduced) {
      setArmed(true)
      return
    }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setArmed(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [whenVisible, reduced])

  return { ref, armed }
}

/** 标题打字机：进场时逐字敲出一次，结束后光标淡出。 */
export function TypedTitle({
  text,
  className,
  speed = 44,
  delay = 90,
  whenVisible = false,
}: {
  text: string
  className?: string
  /** 每个字的间隔（毫秒） */
  speed?: number
  delay?: number
  whenVisible?: boolean
}) {
  const chars = Array.from(text)
  const reduced = useReducedMotion()
  const { ref, armed } = useArmed(whenVisible)
  const [count, setCount] = useState(() => (reduced ? chars.length : 0))

  useEffect(() => {
    if (!armed) return
    if (reduced) {
      setCount(chars.length)
      return
    }
    const total = Array.from(text).length
    let i = 0
    let timer = 0
    setCount(0)
    const tick = () => {
      i += 1
      setCount(i)
      if (i < total) timer = window.setTimeout(tick, speed)
    }
    timer = window.setTimeout(tick, delay)
    return () => window.clearTimeout(timer)
  }, [text, speed, delay, reduced, armed, chars.length])

  const done = armed && count >= chars.length

  return (
    <span
      ref={ref}
      className={'kit-typed' + (done ? ' is-done' : '') + (className ? ' ' + className : '')}
    >
      <span aria-hidden={done ? undefined : true}>{chars.slice(0, armed ? count : 0).join('')}</span>
      {armed && !reduced && <i className="kit-typed__caret" aria-hidden="true" />}
      {!done && <span className="kit-sr">{text}</span>}
    </span>
  )
}

/* 解码用的字形池：宽字符用全角假字，窄字符用符号 + 数字，替换后宽度基本不变，正文不会整段跳行。 */
const WIDE_CHAR = /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/
const WIDE_POOL = Array.from('口令回田由甲申电雲雨川石金木水火土天地玄黄宇宙洪荒壹贰叁肆伍陆柒捌玖')
const NARROW_POOL = Array.from('!<>-_\\/[]{}=+*^?#$%&ABCDEFGHJKLMNPQRSTUVWXYZ0123456789')

function scramble(text: string) {
  let out = ''
  for (const ch of Array.from(text)) {
    if (ch === ' ' || ch === '\n' || ch === '\t') {
      out += ch
      continue
    }
    const pool = WIDE_CHAR.test(ch) ? WIDE_POOL : NARROW_POOL
    out += pool[Math.floor(Math.random() * pool.length)]
  }
  return out
}

/** 文字解码：乱码逐帧抖动，从左到右还原成正文。 */
export function DecodeText({
  text,
  className,
  duration = 780,
  delay = 120,
  whenVisible = false,
}: {
  text: string
  className?: string
  duration?: number
  delay?: number
  whenVisible?: boolean
}) {
  const reduced = useReducedMotion()
  const { ref, armed } = useArmed(whenVisible)
  const [display, setDisplay] = useState(() => (reduced ? text : scramble(text)))
  const [decoding, setDecoding] = useState(!reduced)

  useEffect(() => {
    if (!armed) return
    if (reduced) {
      setDisplay(text)
      setDecoding(false)
      return
    }
    const glyphs = Array.from(text)
    const total = Math.max(1, glyphs.length)
    const begin = performance.now() + delay
    let raf = 0
    setDecoding(true)
    setDisplay(scramble(text))

    const settle = () => {
      setDisplay(text)
      setDecoding(false)
    }

    const frame = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - begin) / duration))
      if (t >= 1) {
        settle()
        return
      }
      const resolved = Math.floor(t * total)
      let out = ''
      for (let i = 0; i < glyphs.length; i += 1) {
        out += i < resolved ? glyphs[i] : scramble(glyphs[i])
      }
      setDisplay(out)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    // rAF 在后台标签页会被节流，用定时器兜底保证一定会落回正文
    const fallback = window.setTimeout(() => {
      cancelAnimationFrame(raf)
      settle()
    }, delay + duration + 80)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(fallback)
    }
  }, [text, duration, delay, reduced, armed])

  return (
    <span
      ref={ref}
      className={'kit-decode' + (decoding ? ' is-decoding' : '') + (className ? ' ' + className : '')}
    >
      <span aria-hidden={decoding ? true : undefined}>{display}</span>
      {decoding && <span className="kit-sr">{text}</span>}
    </span>
  )
}

/** 数字递增：进入页面后从 0 缓出到目标值。 */
export function CountUp({
  value,
  duration = 900,
  suffix = '',
}: {
  value: number
  duration?: number
  suffix?: string
}) {
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setCurrent(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(value * eased))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, reduced])

  return <>{current}{suffix}</>
}

/** 聚光灯：只更新两个 CSS 变量，不触发布局重排。 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  const onPointerMove = (event: ReactPointerEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  const onPointerLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
  }

  return { ref, onPointerMove, onPointerLeave }
}

/** 磁吸按钮：指针靠近时轻微跟随，离开后回位。 */
export function useMagnetic<T extends HTMLElement>(strength = 10) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  const onPointerMove = (event: ReactPointerEvent<T>) => {
    const el = ref.current
    if (!el || reduced) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height
    el.style.transform = `translate3d(${x * strength}px, ${y * strength * 0.6}px, 0)`
  }

  const onPointerLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }

  return { ref, onPointerMove, onPointerLeave }
}

/** 滚动显现：进入视口后加 is-revealed，配合错峰延迟。 */
export function useReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-revealed')
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}

/** 跑马灯：把动效名做成一条循环流动的品牌带。 */
export function MarqueeStrip({ words }: { words: string[] }) {
  const row = [...words, ...words]
  return (
    <div className="kit-marquee" aria-hidden="true">
      <div className="kit-marquee__row" style={{ '--marquee-count': row.length } as CSSProperties}>
        {row.map((word, index) => (
          <span key={`${word}-${index}`}>
            <i>✦</i>
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}

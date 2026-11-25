import { useCallback, useEffect, useRef, useState } from 'react'
import { notify } from './notify'
import { copyText } from './utils'

export function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const copy = useCallback(
    async (text: string, label = '已复制') => {
      const ok = await copyText(text)
      if (!ok) return false
      notify(label.length > 20 ? '提示词已复制' : label)
      setCopied(label)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(null), timeout)
      return true
    },
    [timeout],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { copied, copy }
}

/** Returns a value that increments whenever the user prefers reduced motion changes. */
export function useReducedMotion() {
  // 首帧就同步读取偏好，避免「先播一帧动画再回退」的闪烁
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

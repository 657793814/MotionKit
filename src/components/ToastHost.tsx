import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { subscribeToasts, type AppToast } from '../lib/notify'
import './SelfEffects.css'

interface RenderedToast extends AppToast {
  leaving?: boolean
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<RenderedToast[]>([])
  const timers = useRef<Set<number>>(new Set())

  useEffect(() => subscribeToasts((toast) => {
    setToasts((prev) => [...prev.slice(-2), toast])
    const removeTimer = window.setTimeout(() => {
      setToasts((prev) => prev.map((item) => (item.id === toast.id ? { ...item, leaving: true } : item)))
      const clearTimer = window.setTimeout(() => {
        timers.current.delete(clearTimer)
        setToasts((prev) => prev.filter((item) => item.id !== toast.id))
      }, 200)
      timers.current.add(clearTimer)
      timers.current.delete(removeTimer)
    }, 2200)
    timers.current.add(removeTimer)
  }), [])

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current.clear()
  }, [])

  return createPortal(
    <div className="app-toast-host" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`app-toast kit-glass app-toast--${toast.tone}${toast.leaving ? ' is-leaving' : ''}`}
        >
          <span className="app-toast__icon">{toast.tone === 'success' ? '✓' : 'i'}</span>
          <span>{toast.message}</span>
          <i className="app-toast__bar" />
        </div>
      ))}
    </div>,
    document.body,
  )
}

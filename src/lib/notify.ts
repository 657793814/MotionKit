/** 应用内轻量提示中心：让复制等操作复用 MotionKit 的轻提示交互。 */

export type AppToastTone = 'success' | 'info'

interface ToastDetail {
  message: string
  tone: AppToastTone
}

export interface AppToast extends ToastDetail {
  id: number
}

const EVENT = 'motionkit:toast'

let seq = 0

export function notify(message: string, tone: AppToastTone = 'success') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<ToastDetail>(EVENT, { detail: { message, tone } }))
}

export function subscribeToasts(onToast: (toast: AppToast) => void) {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ToastDetail>).detail
    onToast({ id: ++seq, message: detail.message, tone: detail.tone })
  }
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}

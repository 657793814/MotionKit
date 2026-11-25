/**
 * Cubic-bezier easing utilities.
 * A compact port of the classic bezier-easing algorithm (Newton + bisection).
 */
export type EasingFn = (t: number) => number

const NEWTON_ITERATIONS = 5
const NEWTON_MIN_SLOPE = 0.001
const SUBDIVISION_PRECISION = 1e-7
const SUBDIVISION_MAX_ITERATIONS = 12

const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1
const B = (a1: number, a2: number) => 3 * a2 - 6 * a1
const C = (a1: number) => 3 * a1

const calcBezier = (t: number, a1: number, a2: number) =>
  ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t

const getSlope = (t: number, a1: number, a2: number) =>
  3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1)

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFn {
  if (x1 === y1 && x2 === y2) return (t) => t
  const sampleValues = new Float32Array(11)
  const sampleStep = 1 / 10
  for (let i = 0; i < 11; i++) sampleValues[i] = calcBezier(i * sampleStep, x1, x2)

  const binarySubdivide = (x: number, a: number, b: number) => {
    let currentX = 0
    let currentT = 0
    let i = 0
    do {
      currentT = a + (b - a) / 2
      currentX = calcBezier(currentT, x1, x2) - x
      if (currentX > 0) b = currentT
      else a = currentT
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS)
    return currentT
  }

  const newtonRaphson = (x: number, guess: number) => {
    let t = guess
    for (let i = 0; i < NEWTON_ITERATIONS; i++) {
      const slope = getSlope(t, x1, x2)
      if (slope === 0) return t
      t -= (calcBezier(t, x1, x2) - x) / slope
    }
    return t
  }

  return (t: number) => {
    if (t === 0 || t === 1) return t
    const clamped = Math.min(1, Math.max(0, t))
    let intervalStart = 0
    let i = 1
    for (; i !== 10 && sampleValues[i] <= clamped; i++) intervalStart += sampleStep
    const dist = (clamped - sampleValues[i - 1]) / (sampleValues[i] - sampleValues[i - 1])
    const guessForT = intervalStart + dist * sampleStep
    const initialSlope = getSlope(guessForT, x1, x2)
    const solvedT =
      initialSlope >= NEWTON_MIN_SLOPE
        ? newtonRaphson(clamped, guessForT)
        : initialSlope === 0
          ? guessForT
          : binarySubdivide(clamped, intervalStart, intervalStart + sampleStep)
    return calcBezier(solvedT, y1, y2)
  }
}

export interface EasingPreset {
  id: string
  label: string
  values: [number, number, number, number]
  note: string
}

export const EASING_PRESETS: EasingPreset[] = [
  { id: 'linear', label: 'linear', values: [0, 0, 1, 1], note: '匀速，机械感明显' },
  { id: 'ease-out', label: 'ease-out', values: [0, 0, 0.58, 1], note: '快速起步后减速，通用入场' },
  { id: 'ease-in-out', label: 'ease-in-out', values: [0.42, 0, 0.58, 1], note: '两端缓，实际最常用' },
  { id: 'expo', label: 'ease-out-expo', values: [0.16, 1, 0.3, 1], note: '极具速度感的丝滑收尾' },
  { id: 'back', label: 'ease-out-back', values: [0.34, 1.56, 0.64, 1], note: '越过终点再回拉，俏皮' },
  { id: 'smooth', label: 'smooth', values: [0.22, 1, 0.36, 1], note: '柔和顺滑，适合大面板' },
  { id: 'snap', label: 'snap', values: [0.7, 0, 0.84, 0], note: '先蓄力再猛冲，适合离场' },
  { id: 'custom', label: '自定义', values: [0.34, 1.2, 0.64, 1], note: '拖动下方控制点实时调整' },
]

export const getPreset = (id: string) => EASING_PRESETS.find((p) => p.id === id) ?? EASING_PRESETS[1]

export const easeOutCubic: EasingFn = (t) => 1 - Math.pow(1 - t, 3)

export function easingFnFromPreset(id: string): EasingFn {
  if (id === 'linear') return (t) => t
  const p = getPreset(id)
  return cubicBezier(p.values[0], p.values[1], p.values[2], p.values[3])
}

/** SVG path for a cubic-bezier in a 100x100 chart with y inverted. */
export function bezierPath([x1, y1, x2, y2]: [number, number, number, number]): string {
  const X = (x: number) => 8 + x * 84
  const Y = (y: number) => 92 - y * 84
  return `M ${X(0)} ${Y(0)} C ${X(x1)} ${Y(y1)}, ${X(x2)} ${Y(y2)}, ${X(1)} ${Y(1)}`
}

import { useEffect, useRef, useState } from 'react'
import { EASING_PRESETS, cubicBezier, getPreset } from '../lib/easing'
import type { DemoProps } from '../lib/types'
import { clamp, num, str } from '../lib/utils'
import './Easing.css'

const X = (x: number) => 30 + x * 240
const Y = (y: number) => 30 + ((1.5 - y) / 2) * 240

export default function EasingDemo({ params, replay, onParamChange }: DemoProps) {
  const x1 = num(params.x1, 0.16)
  const y1 = num(params.y1, 1)
  const x2 = num(params.x2, 0.3)
  const y2 = num(params.y2, 1)
  const preset = str(params.preset, 'expo')
  const duration = num(params.duration, 900)
  const [progress, setProgress] = useState(0)
  const [dragHandle, setDragHandle] = useState<'p1' | 'p2' | null>(null)
  const svg = useRef<SVGSVGElement>(null)

  const ease = cubicBezier(x1, y1, x2, y2)
  const eased = ease(progress)
  const presetDef = getPreset(preset)

  // 选择预设时，把四个控制点同步到参数面板
  useEffect(() => {
    if (preset === 'custom') return
    const values = getPreset(preset).values
    if (values[0] !== x1) onParamChange?.('x1', values[0])
    if (values[1] !== y1) onParamChange?.('y1', values[1])
    if (values[2] !== x2) onParamChange?.('x2', values[2])
    if (values[3] !== y2) onParamChange?.('y2', values[3])
  }, [preset]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let raf = 0
    const begin = performance.now()
    const cycle = duration + 850
    const tick = (now: number) => {
      const t = Math.min(1, ((now - begin) % cycle) / duration)
      setProgress(t)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, replay])

  const apply = (handle: 'p1' | 'p2', e: React.PointerEvent) => {
    const el = svg.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const sx = ((e.clientX - rect.left) / rect.width) * 300
    const sy = ((e.clientY - rect.top) / rect.height) * 300
    const px = clamp((sx - 30) / 240, 0, 1)
    const py = clamp(1.5 - ((sy - 30) / 240) * 2, -0.5, 1.5)
    onParamChange?.('preset', 'custom')
    onParamChange?.(handle === 'p1' ? 'x1' : 'x2', Number(px.toFixed(2)))
    onParamChange?.(handle === 'p1' ? 'y1' : 'y2', Number(py.toFixed(2)))
  }

  const startDrag = (handle: 'p1' | 'p2') => (e: React.PointerEvent) => {
    e.preventDefault()
    svg.current?.setPointerCapture(e.pointerId)
    setDragHandle(handle)
    apply(handle, e)
  }

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragHandle) apply(dragHandle, e)
  }

  const curve = `M ${X(0)} ${Y(0)} C ${X(x1)} ${Y(y1)}, ${X(x2)} ${Y(y2)}, ${X(1)} ${Y(1)}`
  const dotX = X(progress)
  const dotY = Y(eased)
  const formula = `cubic-bezier(${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)})`

  return (
    <div className="ez-demo">
      <div className="ez-editor">
        <div className="ez-editor__head">
          <span className="eyebrow">BEZIER EDITOR</span>
          <span className="ez-editor__state">{dragHandle ? `DRAGGING ${dragHandle.toUpperCase()}` : 'LIVE'}</span>
        </div>

        <svg
          ref={svg}
          viewBox="0 0 300 300"
          className="ez-chart"
          onPointerMove={onMove}
          onPointerUp={() => setDragHandle(null)}
          onPointerCancel={() => setDragHandle(null)}
        >
          <defs>
            <linearGradient id="ezCurve" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <radialGradient id="ezGlow">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="30" y="30" width="240" height="240" className="ez-plot" />

          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={`x${v}`}>
              <line x1={X(v)} y1="30" x2={X(v)} y2="270" className="ez-grid" />
            </g>
          ))}
          {[-0.5, 0, 0.5, 1, 1.5].map((v) => (
            <line key={`y${v}`} x1="30" y1={Y(v)} x2="270" y2={Y(v)} className="ez-grid" />
          ))}

          <line x1="30" y1={Y(0)} x2="270" y2={Y(0)} className="ez-ref" />
          <line x1="30" y1={Y(1)} x2="270" y2={Y(1)} className="ez-ref" />
          <text x="18" y={Y(0) + 3} className="ez-label">0</text>
          <text x="18" y={Y(1) + 3} className="ez-label">1</text>
          <text x="272" y={Y(0) + 3} className="ez-label">t</text>

          <line x1={X(0)} y1={Y(0)} x2={X(x1)} y2={Y(y1)} className="ez-arm" />
          <line x1={X(1)} y1={Y(1)} x2={X(x2)} y2={Y(y2)} className="ez-arm" />

          <path d={curve} fill="none" stroke="url(#ezCurve)" strokeWidth="2.5" strokeLinecap="round" />

          <line x1={dotX} y1={dotY} x2={dotX} y2={Y(0)} className="ez-guide" />
          <line x1={dotX} y1={dotY} x2={X(0)} y2={dotY} className="ez-guide" />
          <circle cx={dotX} cy={dotY} r="16" fill="url(#ezGlow)" />
          <circle cx={dotX} cy={dotY} r="5" className="ez-dot" />

          <g
            className={'ez-handle-group' + (dragHandle === 'p1' ? ' is-active' : '')}
            onPointerDown={startDrag('p1')}
          >
            <circle cx={X(x1)} cy={Y(y1)} r="13" className="ez-handle-hit" />
            <circle cx={X(x1)} cy={Y(y1)} r="6" className="ez-handle" />
            <text x={X(x1)} y={Y(y1) - 14} className="ez-handle-label">P1</text>
          </g>
          <g
            className={'ez-handle-group' + (dragHandle === 'p2' ? ' is-active' : '')}
            onPointerDown={startDrag('p2')}
          >
            <circle cx={X(x2)} cy={Y(y2)} r="13" className="ez-handle-hit" />
            <circle cx={X(x2)} cy={Y(y2)} r="6" className="ez-handle" />
            <text x={X(x2)} y={Y(y2) - 14} className="ez-handle-label">P2</text>
          </g>
        </svg>

        <div className="ez-formula">
          <code>{formula}</code>
          <span>{preset === 'custom' ? 'CUSTOM' : preset.toUpperCase()}</span>
        </div>

        <div className="ez-presets">
          {EASING_PRESETS.filter((p) => p.id !== 'custom').map((p) => (
            <button
              key={p.id}
              type="button"
              className={preset === p.id ? 'is-active' : ''}
              onClick={() => onParamChange?.('preset', p.id)}
            >
              {p.label.replace('ease-out-', '').replace('ease-', '')}
            </button>
          ))}
        </div>
        <p className="ez-note">{presetDef.note}</p>
      </div>

      <div className="ez-side">
        <div className="ez-runner">
          <div className="ez-runner__head">
            <span>位移表现</span>
            <b>{(eased * 100).toFixed(0)}%</b>
          </div>
          <div className="ez-track">
            <div className="ez-rail">
              <i className="ez-rail__fill" style={{ width: `${clamp(eased, 0, 1.15) * 100}%` }} />
              <span
                className="ez-puck"
                style={{ left: `${clamp(eased, -0.08, 1.08) * 100}%` }}
              >
                <i />
              </span>
            </div>
            <div className="ez-track__labels">
              <span>START</span>
              <span>END</span>
            </div>
          </div>
          <div className="ez-sample">
            <div
              className="ez-sample__panel"
              style={{
                transform: `translateX(${eased * 26}px) scale(${0.96 + clamp(eased, 0, 1) * 0.04})`,
                opacity: clamp(eased, 0, 1),
              }}
            >
              <span className="ez-sample__icon">✦</span>
              <div>
                <strong>面板入场</strong>
                <span>按当前曲线推进</span>
              </div>
            </div>
          </div>
          <p className="ez-runner__hint">推进进度 {Math.round(progress * 100)}% · 缓动输出 {eased.toFixed(2)}</p>
        </div>

        <div className="ez-stats">
          <div>
            <span>时长</span>
            <b>{duration}ms</b>
          </div>
          <div>
            <span>过冲</span>
            <b>{Math.max(0, eased - 1).toFixed(2)}</b>
          </div>
          <div>
            <span>类型</span>
            <b>{y1 > 1 || y2 > 1 ? '回弹' : '平滑'}</b>
          </div>
        </div>

        <div className="ez-tipbox">
          <span>怎么选？</span>
          <p>入场用 ease-out 收尾更自然；离场用 ease-in 加速离开；带回弹的曲线适合轻量、有玩味的元素。</p>
        </div>
      </div>

      <p className="demo-hint">拖动 P1 / P2 控制点 · 或点击预设 · 观察同一个 0 → 1 的节奏差异</p>
    </div>
  )
}

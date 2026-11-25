import type { ParamDef } from '../lib/types'
import { num } from '../lib/utils'

interface ControlsProps {
  params: ParamDef[]
  values: Record<string, string | number | boolean>
  onChange: (key: string, value: string | number | boolean) => void
  onReset: () => void
  onOpenAI: () => void
}

function displayValue(def: ParamDef, value: string | number | boolean) {
  if (def.type === 'switch') return value ? '开' : '关'
  if (def.key === 'opacity') return `${Math.round(num(value) * 100)}%`
  if (def.key === 'strength') return num(value).toFixed(2)
  if (def.type === 'range' || def.type === 'number') {
    const n = num(value)
    const text = def.step && def.step < 1 ? n.toFixed(String(def.step).split('.')[1]?.length ?? 2) : String(n)
    return `${text}${def.unit ?? ''}`
  }
  return String(value)
}

function ParamControl({
  def,
  value,
  onChange,
}: {
  def: ParamDef
  value: string | number | boolean
  onChange: (key: string, value: string | number | boolean) => void
}) {
  const id = `param-${def.key}`

  if (def.type === 'switch') {
    return (
      <div className="param param--switch">
        <label htmlFor={id}>{def.label}</label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          className={'switch' + (value ? ' is-on' : '')}
          onClick={() => onChange(def.key, !value)}
        >
          <span />
        </button>
      </div>
    )
  }

  if (def.type === 'range') {
    const min = def.min ?? 0
    const max = def.max ?? 1
    const fill = ((num(value) - min) / Math.max(0.0001, max - min)) * 100
    return (
      <div className="param">
        <div className="param__head">
          <label htmlFor={id}>{def.label}</label>
          <span className="param__value">{displayValue(def, value)}</span>
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={def.step ?? 1}
          value={num(value)}
          style={{ '--fill': `${fill}%` } as React.CSSProperties}
          onChange={(e) => onChange(def.key, Number(e.target.value))}
        />
      </div>
    )
  }

  if (def.type === 'select') {
    return (
      <div className="param">
        <label htmlFor={id}>{def.label}</label>
        <div className="select">
          <select id={id} value={String(value)} onChange={(e) => onChange(def.key, e.target.value)}>
            {def.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="select__arrow">⌄</span>
        </div>
      </div>
    )
  }

  if (def.type === 'color') {
    return (
      <div className="param">
        <label htmlFor={id}>{def.label}</label>
        <div className="color-field">
          <input
            id={id}
            type="color"
            value={String(value)}
            onChange={(e) => onChange(def.key, e.target.value)}
          />
          <span className="color-field__swatch" style={{ background: String(value) }} />
          <input
            type="text"
            className="color-field__hex"
            value={String(value)}
            spellCheck={false}
            onChange={(e) => {
              const next = e.target.value
              if (/^#[0-9a-fA-F]{0,6}$/.test(next)) onChange(def.key, next)
            }}
          />
        </div>
      </div>
    )
  }

  if (def.type === 'text') {
    return (
      <div className="param">
        <div className="param__head">
          <label htmlFor={id}>{def.label}</label>
          <span className="param__value param__value--soft">{String(value).length} 字</span>
        </div>
        <textarea
          id={id}
          rows={2}
          value={String(value)}
          onChange={(e) => onChange(def.key, e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="param">
      <div className="param__head">
        <label htmlFor={id}>{def.label}</label>
        <span className="param__value">{displayValue(def, value)}</span>
      </div>
      <input
        id={id}
        type="number"
        min={def.min}
        max={def.max}
        step={def.step ?? 1}
        value={num(value)}
        onChange={(e) => onChange(def.key, Number(e.target.value))}
      />
    </div>
  )
}

export default function Controls({ params, values, onChange, onReset, onOpenAI }: ControlsProps) {
  return (
    <aside className="controls">
      <div className="controls__head">
        <div>
          <h3>参数调节</h3>
          <span>LIVE CONTROLS</span>
        </div>
        <button type="button" className="controls__reset" onClick={onReset}>
          ↺ 重置
        </button>
      </div>

      <div className="controls__list">
        {params.map((def) => (
          <ParamControl
            key={def.key}
            def={def}
            value={values[def.key] ?? def.default}
            onChange={onChange}
          />
        ))}
      </div>

      <div className="controls__foot">
        <span>修改实时生效 · 自动保存</span>
      </div>

      <button type="button" className="controls__ai" onClick={onOpenAI}>
        <span className="controls__ai-icon">✦</span>
        <span>
          <strong>不知道该选哪个？</strong>
          <em>按场景让 AI 推荐动效</em>
        </span>
        <i>→</i>
      </button>
    </aside>
  )
}

import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_SKIN_ID,
  SKIN_PRESETS,
  applySkin,
  getSkin,
  isValidHex,
  skinTokens,
  type Theme,
} from '../lib/skins'
import { notify } from '../lib/notify'
import { IconCheck, IconGear, IconX } from './Icons'
import { DecodeText, TypedTitle } from './SelfEffects'

interface SkinSettingsProps {
  open: boolean
  onClose: () => void
  skinId: string
  theme: Theme
  accentColor: string
  onPickSkin: (id: string) => void
  onPickAccent: (hex: string) => void
}

/** 快捷主色：取自各皮肤主色，外加两枚中性色。 */
const QUICK_ACCENTS = [
  ...SKIN_PRESETS.map((p) => p.dark.accent),
  '#ffffff',
  '#f97316',
]

export function SkinSettingsPanel({
  onClose,
  skinId,
  theme,
  accentColor,
  onPickSkin,
  onPickAccent,
}: SkinSettingsProps) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [draft, setDraft] = useState(accentColor)

  const latest = useRef({ skinId, theme, accentColor })
  latest.current = { skinId, theme, accentColor }

  // 悬停即预览：鼠标离开后回落到已保存的皮肤
  useEffect(() => {
    applySkin(hoverId ?? skinId, theme, hoverId ? undefined : accentColor)
  }, [hoverId, skinId, theme, accentColor])

  // 面板关闭（卸载）时确保页面回到已保存的皮肤
  useEffect(() => {
    return () => applySkin(latest.current.skinId, latest.current.theme, latest.current.accentColor)
  }, [])

  const shownId = hoverId ?? skinId
  const tokens = skinTokens(shownId, theme)
  const shownPreset = getSkin(shownId)
  const draftOk = draft === '' || isValidHex(draft)

  const commitAccent = (value: string) => {
    setDraft(value)
    if (value === '' || isValidHex(value)) onPickAccent(value.trim())
  }

  const tokenList: { key: string; label: string; value: string }[] = [
    { key: 'bg', label: 'BG', value: tokens.bg },
    { key: 'panel', label: 'PANEL', value: tokens.panel },
    { key: 'line', label: 'LINE', value: tokens.line },
    { key: 'accent', label: 'ACCENT', value: tokens.accent },
    { key: 'cyan', label: 'CYAN', value: tokens.cyan },
    { key: 'emerald', label: 'EMERALD', value: tokens.emerald },
  ]

  return (
    <div className="skin-settings" role="dialog" aria-modal="false" aria-label="皮肤配置">
      <div className="skin-settings__panel" onClick={(e) => e.stopPropagation()}>
        <header className="skin-settings__head">
          <div className="skin-settings__head__title">
            <span className="icon-btn is-active">
              <IconGear size={15} />
            </span>
            <div>
              <h3><TypedTitle text="皮肤配置" speed={50} delay={40} /></h3>
              <p>
                <DecodeText
                  text="6 套完整调色，每套都含亮 / 暗两种渲染。悬停卡片即可实时预览，点击后保存到本地。"
                  duration={860}
                  delay={200}
                />
              </p>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="关闭皮肤配置">
            <IconX size={16} />
          </button>
        </header>

        <div className="skin-settings__body">
          <section className="skin-settings__group">
            <div className="skin-settings__group__head">
              <span className="eyebrow">SKIN PRESET</span>
              <em>整套配色 · 表面 + 主色族</em>
            </div>
            <div className="skin-grid">
              {SKIN_PRESETS.map((p) => {
                const t = skinTokens(p.id, theme)
                const active = p.id === skinId
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={'skin-card' + (active ? ' is-active' : '')}
                    onMouseEnter={() => setHoverId(p.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(p.id)}
                    onBlur={() => setHoverId(null)}
                    onClick={() => {
                      setHoverId(null)
                      onPickSkin(p.id)
                      notify(`已切换皮肤 · ${p.name}`)
                    }}
                    aria-pressed={active}
                  >
                    <span
                      className="skin-card__preview"
                      style={{ background: t.bg, borderColor: t.line }}
                    >
                      <span
                        className="skin-card__glow"
                        style={{
                          background: `radial-gradient(circle, ${t.accent} 0%, transparent 70%)`,
                        }}
                      />
                      <span
                        className="skin-card__panel"
                        style={{ background: t.panel, borderColor: t.line }}
                      >
                        <i style={{ background: t.text, opacity: 0.75 }} />
                        <i style={{ background: t.muted }} />
                        <b style={{ background: t.accent }} />
                      </span>
                    </span>
                    <span className="skin-card__meta">
                      <strong>{p.name}</strong>
                      <em>{p.en}</em>
                    </span>
                    <span className="skin-card__check">
                      <IconCheck size={9} />
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="skin-note">
              <b>{shownPreset.name}</b>
              {shownPreset.note}
            </p>
          </section>

          <section className="skin-settings__group">
            <div className="skin-settings__group__head">
              <span className="eyebrow">CUSTOM ACCENT</span>
              <em>在主色族之上再换一个主色</em>
            </div>
            <div className="skin-settings__field">
              <label className="skin-settings__field-label">
                <span>主色</span>
                <em>留空 = 跟随预设</em>
              </label>
              <div className="skin-settings__accent">
                <input
                  type="color"
                  value={isValidHex(accentColor) ? accentColor : tokens.accent}
                  onChange={(e) => commitAccent(e.target.value)}
                  aria-label="自定义主色"
                />
                <div className="skin-settings__accent-info">
                  <input
                    type="text"
                    className={draftOk ? '' : 'is-invalid'}
                    value={draft}
                    onChange={(e) => commitAccent(e.target.value)}
                    spellCheck={false}
                    placeholder={tokens.accent}
                    aria-label="主色色值"
                  />
                </div>
              </div>
              <div className="skin-swatches">
                {QUICK_ACCENTS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    style={{ background: hex }}
                    title={hex}
                    aria-label={`使用主色 ${hex}`}
                    onClick={() => commitAccent(hex)}
                  />
                ))}
              </div>
              <div className="skin-settings__row">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setDraft('')
                    onPickAccent('')
                    notify('已恢复预设主色', 'info')
                  }}
                >
                  使用预设主色
                </button>
              </div>
            </div>
          </section>

          <section className="skin-settings__group">
            <div className="skin-settings__group__head">
              <span className="eyebrow">TOKENS</span>
              <em>{theme === 'dark' ? '暗色渲染' : '亮色渲染'}</em>
            </div>
            <div className="skin-tokens">
              {tokenList.map((tk) => (
                <span className="skin-token" key={tk.key} title={`--${tk.key}: ${tk.value}`}>
                  <i style={{ background: tk.value }} />
                  <span>{tk.value.startsWith('rgb') ? 'rgba(…)' : tk.value}</span>
                </span>
              ))}
            </div>
          </section>
        </div>

        <footer className="skin-settings__foot">
          <span>
            当前：<b>{getSkin(skinId).name}</b> · {theme === 'dark' ? '暗色' : '亮色'}
            {accentColor ? ` · ${accentColor}` : ''}
          </span>
          <button
            type="button"
            onClick={() => {
              setDraft('')
              onPickSkin(DEFAULT_SKIN_ID)
              onPickAccent('')
              notify('皮肤已重置', 'info')
            }}
          >
            重置
          </button>
        </footer>
      </div>
    </div>
  )
}

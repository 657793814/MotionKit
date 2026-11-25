import { useEffect, useRef, useState } from 'react'
import { catalog, getEffect } from '../lib/catalog'
import { useStorageStatus } from '../lib/configStore'
import { useCopy } from '../lib/hooks'
import {
  DEFAULT_AI_CONFIG,
  EXAMPLE_PROMPTS,
  recommendLocal,
  recommendWithAI,
  type AIConfig,
  type RecommendResult,
} from '../lib/recommend'
import {
  IconArrowUpRight,
  IconCheck,
  IconCopy,
  IconGear,
  IconSparkles,
  IconX,
} from './Icons'
import { DecodeText, TypedTitle } from './SelfEffects'

interface RecommenderProps {
  open: boolean
  aiConfig: AIConfig
  onAiConfig: (patch: Partial<AIConfig>) => void
  onClose: () => void
  onOpenEffect: (id: string) => void
}

export default function Recommender({
  open,
  aiConfig,
  onAiConfig,
  onClose,
  onOpenEffect,
}: RecommenderProps) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<RecommendResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiError, setAiError] = useState('')
  const [usedAI, setUsedAI] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const abort = useRef<AbortController | null>(null)
  const { copied, copy } = useCopy()
  const storage = useStorageStatus()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const timer = window.setTimeout(() => textarea.current?.focus(), 220)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      window.clearTimeout(timer)
    }
  }, [open, onClose])

  useEffect(() => () => abort.current?.abort(), [])

  if (!open) return null

  const run = async (text = query) => {
    const q = text.trim()
    if (!q) {
      setError('先用一句话描述你的界面场景，比如「官网首屏想要科技感」。')
      return
    }
    setQuery(text)
    setError('')
    setAiError('')
    setLoading(true)
    setResult(null)
    abort.current?.abort()
    const controller = new AbortController()
    abort.current = controller

    if (aiConfig.enabled) {
      try {
        const res = await recommendWithAI(q, aiConfig, controller.signal)
        setResult(res)
        setUsedAI(true)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setAiError(`AI 调用失败：${(err as Error).message || '未知错误'}。已回退到本地匹配。`)
        setResult(recommendLocal(q))
        setUsedAI(false)
      } finally {
        setLoading(false)
      }
    } else {
      setResult(recommendLocal(q))
      setUsedAI(false)
      setLoading(false)
    }
  }

  const modeLabel = aiConfig.enabled ? 'AI 增强' : '本地语义匹配'

  return (
    <div className="ai-overlay" role="presentation" onClick={onClose}>
      <div
        className="ai-panel"
        role="dialog"
        aria-modal="true"
        aria-label="智能动效推荐"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ai-head">
          <div className="ai-head__title">
            <span className="ai-head__icon"><IconSparkles size={17} /></span>
            <div>
              <h2><TypedTitle text="智能选型" speed={70} delay={60} /></h2>
              <p>
                <DecodeText
                  text={`描述场景，从 ${catalog.length} 种动效里挑出最合适的`}
                  duration={760}
                  delay={260}
                />
              </p>
            </div>
          </div>
          <div className="ai-head__actions">
            <span className={'ai-mode' + (aiConfig.enabled ? ' is-ai' : '')}>
              <i />
              {modeLabel}
            </span>
            <button
              type="button"
              className={'icon-btn' + (settingsOpen ? ' is-active' : '')}
              onClick={() => setSettingsOpen((v) => !v)}
              aria-label="模型配置"
              title="模型配置"
            >
              <IconGear size={15} />
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="关闭">
              <IconX size={16} />
            </button>
          </div>
        </header>

        <div className="ai-body">
          <div className="ai-input-card">
            <div className="ai-input-card__label">
              <span>描述你想要的界面感觉</span>
              <em>支持中文 · ⌘ + Enter 提交</em>
            </div>
            <textarea
              ref={textarea}
              value={query}
              rows={3}
              placeholder="例如：官网首页想要科技感，标题先出现乱码再还原，鼠标移到卡片上有光晕…"
              onChange={(e) => {
                setQuery(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') run()
              }}
            />
            <div className="ai-input-card__foot">
              <span className="ai-input-card__count">{query.length} / 300</span>
              <button type="button" className="btn btn--primary" onClick={() => run()} disabled={loading}>
                {loading ? '正在挑选…' : aiConfig.enabled ? '让 AI 推荐' : '开始匹配'}
                <span>→</span>
              </button>
            </div>
          </div>

          {error && <div className="ai-alert">{error}</div>}
          {aiError && <div className="ai-alert ai-alert--warn">{aiError}</div>}

          {settingsOpen && (
            <section className="ai-settings">
              <div className="ai-settings__head">
                <div>
                  <h3><TypedTitle text="自定义模型" speed={46} delay={40} /></h3>
                  <p>
                    <DecodeText
                      text="任意 OpenAI 兼容接口，填好地址、模型与密钥即可。"
                      duration={720}
                      delay={180}
                    />
                  </p>
                </div>
                <span className="ai-settings__secure">
                  {storage.mode === 'file' ? 'LOCAL FILE' : storage.mode === 'local' ? 'BROWSER' : 'LOCAL'}
                </span>
              </div>

              <div className="ai-toggle-row">
                <button
                  type="button"
                  role="switch"
                  aria-checked={aiConfig.enabled}
                  className={'switch' + (aiConfig.enabled ? ' is-on' : '')}
                  onClick={() => onAiConfig({ enabled: !aiConfig.enabled })}
                >
                  <span />
                </button>
                <div>
                  <strong>启用 AI 增强推荐</strong>
                  <em>关闭时使用内置关键词匹配，无需网络与密钥</em>
                </div>
              </div>

              {aiConfig.enabled && (
                <>
                  <label className="ai-field">
                    <span>Base URL</span>
                    <input
                      type="text"
                      value={aiConfig.baseUrl}
                      spellCheck={false}
                      placeholder="https://api.openai.com/v1"
                      onChange={(e) => onAiConfig({ baseUrl: e.target.value })}
                    />
                  </label>

                  <div className="ai-field-row">
                    <label className="ai-field">
                      <span>模型</span>
                      <input
                        type="text"
                        value={aiConfig.model}
                        spellCheck={false}
                        placeholder="gpt-4o-mini"
                        onChange={(e) => onAiConfig({ model: e.target.value })}
                      />
                    </label>
                    <label className="ai-field">
                      <span>API Key</span>
                      <div className="ai-field__key">
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={aiConfig.apiKey}
                          spellCheck={false}
                          placeholder="sk-…（本地模型可留空）"
                          onChange={(e) => onAiConfig({ apiKey: e.target.value })}
                          autoComplete="off"
                        />
                        <button type="button" onClick={() => setShowKey((v) => !v)}>
                          {showKey ? '隐藏' : '显示'}
                        </button>
                      </div>
                    </label>
                  </div>

                  <button
                    type="button"
                    className={'ai-advanced' + (advancedOpen ? ' is-open' : '')}
                    onClick={() => setAdvancedOpen((v) => !v)}
                    aria-expanded={advancedOpen}
                  >
                    <span>系统提示词</span>
                    <em>
                      {aiConfig.promptTemplate.trim() === DEFAULT_AI_CONFIG.promptTemplate.trim()
                        ? '默认'
                        : '已自定义'}
                    </em>
                    <i />
                  </button>

                  {advancedOpen && (
                    <label className="ai-field ai-field--prompt">
                      <textarea
                        rows={4}
                        value={aiConfig.promptTemplate}
                        spellCheck={false}
                        placeholder="留空则使用内置默认提示词，决定推荐风格与输出格式"
                        onChange={(e) => onAiConfig({ promptTemplate: e.target.value })}
                      />
                    </label>
                  )}

                  <p className="ai-settings__note">
                    {storage.mode === 'file' ? (
                      <>
                        配置以明文保存在本地文件 <code>{storage.file}</code>，由本地开发服务直接读写，不经过第三方；
                        该文件已被 .gitignore 忽略，不要提交或分享。
                      </>
                    ) : storage.mode === 'local' ? (
                      <>未检测到本地文件接口（静态部署或非 Vite 环境），配置退回保存在浏览器 localStorage。</>
                    ) : (
                      <>正在读取本地配置文件…</>
                    )}
                    {storage.error && (
                      <span className="ai-settings__note-error">写入失败：{storage.error}</span>
                    )}
                  </p>
                </>
              )}
            </section>
          )}

          {!result && !loading && (
            <div className="ai-examples">
              <div className="ai-examples__head">
                <span>试试这样描述</span>
                <em>点击立即匹配</em>
              </div>
              <div className="ai-examples__list">
                {EXAMPLE_PROMPTS.slice(0, 8).map((prompt) => (
                  <div className="ai-examples__item" key={prompt}>
                    <button className="ai-examples__run" type="button" onClick={() => run(prompt)}>
                      <IconSparkles size={11} />
                      {prompt}
                    </button>
                    <button
                      className="ai-examples__copy"
                      type="button"
                      title="复制这条提示词"
                      aria-label="复制这条提示词"
                      onClick={() => void copy(prompt, prompt)}
                    >
                      {copied === prompt ? <IconCheck size={11} /> : <IconCopy size={11} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="ai-loading">
              <div className="ai-loading__status">
                <span className="ai-loading__spark"><IconSparkles size={13} /></span>
                {aiConfig.enabled ? '正在请求模型并比对动效库…' : '正在分析关键词与场景…'}
              </div>
              {[0, 1, 2].map((i) => (
                <div className="ai-skeleton" key={i} style={{ animationDelay: `${i * 100}ms` }}>
                  <i />
                  <div><b /><span /><span /></div>
                </div>
              ))}
            </div>
          )}

          {result && !loading && (
            <div className="ai-results">
              <div className="ai-summary">
                <span className="ai-summary__icon">
                  {usedAI ? <IconSparkles size={13} /> : <IconCheck size={13} />}
                </span>
                <p>{result.summary}</p>
              </div>
              <div className="ai-results__head">
                <span>推荐结果</span>
                <em>{usedAI ? '由大模型生成' : '基于内置场景词典'}</em>
              </div>
              <div className="rec-list">
                {result.results.map((rec, i) => {
                  const effect = getEffect(rec.id)
                  if (!effect) return null
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      className="rec-card kit-spotlight"
                      onClick={() => onOpenEffect(rec.id)}
                    >
                      <span className="rec-card__rank">{String(i + 1).padStart(2, '0')}</span>
                      <span className="rec-card__body">
                        <span className="rec-card__title">
                          <strong>{effect.name}</strong>
                          <em>{effect.en}</em>
                          <b>{rec.score}</b>
                        </span>
                        <span className="rec-card__reason">{rec.reason}</span>
                        <span className="rec-card__meta">
                          <span className="rec-card__bar">
                            <i style={{ width: `${rec.score}%` }} />
                          </span>
                          <span className="rec-card__tags">
                            {effect.tags.slice(0, 2).map((tag) => (
                              <i key={tag}>{tag}</i>
                            ))}
                          </span>
                        </span>
                      </span>
                      <span className="rec-card__open"><IconArrowUpRight size={14} /></span>
                    </button>
                  )
                })}
              </div>
              <p className="ai-disclaimer">
                推荐基于场景语义与动效特征匹配。打开 Demo 后可继续调节参数，收藏或复制代码。
              </p>
            </div>
          )}
        </div>

        <footer className="ai-foot">
          <span>MotionKit Recommender</span>
          <span>
            {aiConfig.enabled ? `Model · ${aiConfig.model || '未设置'}` : `本地词典 · ${DEFAULT_AI_CONFIG.model === aiConfig.model ? '默认' : '自定义'}`}
          </span>
        </footer>
      </div>
    </div>
  )
}

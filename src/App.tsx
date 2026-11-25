import { useCallback, useEffect, useMemo, useState } from 'react'
import Detail from './components/Detail'
import Home from './components/Home'
import Recommender from './components/Recommender'
import { SkinSettingsPanel } from './components/SkinSettingsPanel'
import Sidebar from './components/Sidebar'
import ToastHost from './components/ToastHost'
import { IconMenu, IconMoon, IconPalette, IconSparkles, IconSun } from './components/Icons'
import {
  allDefaultParams,
  catalog,
  categoryLabel,
  defaultParams,
  getEffect,
} from './lib/catalog'
import { usePersistentState } from './lib/configStore'
import { notify } from './lib/notify'
import { useMagnetic } from './components/SelfEffects'
import { DEFAULT_AI_CONFIG, type AIConfig } from './lib/recommend'
import { DEFAULT_SKIN_ID, applySkin, getSkin, type Theme } from './lib/skins'
import type { CategoryId, Params } from './lib/types'

export default function App() {
  const [theme, setTheme] = usePersistentState<Theme>('motionkit.theme', 'dark')
  const [favorites, setFavorites] = usePersistentState<string[]>('motionkit.favorites', [])
  const [storedParams, setStoredParams] = usePersistentState<Record<string, Params>>(
    'motionkit.params.v1',
    allDefaultParams(),
  )
  const [aiConfig, setAiConfig] = usePersistentState<AIConfig>('motionkit.ai.v1', DEFAULT_AI_CONFIG)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [replay, setReplay] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  const [skinId, setSkinId] = usePersistentState<string>('motionkit.skin', DEFAULT_SKIN_ID)
  const [accentColor, setAccentColor] = usePersistentState<string>('motionkit.accent.v1', '')
  const [skinOpen, setSkinOpen] = useState(false)

  // 皮肤 + 主题一次写入：皮肤决定配色性格，主题决定亮 / 暗渲染
  useEffect(() => {
    applySkin(skinId, theme, accentColor)
  }, [skinId, theme, accentColor])
  const aiMagnetic = useMagnetic<HTMLButtonElement>(8)

  const active = activeId ? getEffect(activeId) : undefined

  useEffect(() => {
    document.title = active
      ? `${active.name} · MotionKit`
      : 'MotionKit · UI 动效系统'
  }, [active])

  useEffect(() => {
    if (!skinOpen) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSkinOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [skinOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMenuOpen(true)
        window.setTimeout(() => {
          const input = document.getElementById('global-search') as HTMLInputElement | null
          input?.focus()
          input?.select()
        }, 40)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.filter((effect) => {
      if (onlyFavorites && !favorites.includes(effect.id)) return false
      if (category !== 'all' && effect.category !== category) return false
      if (!q) return true
      return [
        effect.name,
        effect.en,
        effect.tagline,
        effect.description,
        ...effect.tags,
        ...effect.keywords,
        ...effect.useCases,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [query, category, onlyFavorites, favorites])

  const params = useMemo<Params>(() => {
    if (!active) return {}
    return { ...defaultParams(active), ...(storedParams[active.id] ?? {}) }
  }, [active, storedParams])

  const selectEffect = useCallback((id: string) => {
    setActiveId(id)
    setMenuOpen(false)
    setAiOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goHome = useCallback(() => {
    setActiveId(null)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const changeParam = useCallback(
    (key: string, value: string | number | boolean) => {
      if (!active) return
      setStoredParams((prev) => ({
        ...prev,
        [active.id]: {
          ...defaultParams(active),
          ...(prev[active.id] ?? {}),
          [key]: value,
        },
      }))
    },
    [active, setStoredParams],
  )

  const resetParams = useCallback(() => {
    if (!active) return
    setStoredParams((prev) => ({ ...prev, [active.id]: defaultParams(active) }))
    setReplay((n) => n + 1)
  }, [active, setStoredParams])

  const toggleFavorite = useCallback(
    (id: string) => {
      const removing = favorites.includes(id)
      notify(removing ? '已取消收藏' : '已加入收藏', removing ? 'info' : 'success')
      setFavorites((prev) =>
        removing ? prev.filter((item) => item !== id) : [...prev, id],
      )
    },
    [favorites, setFavorites],
  )

  const openAI = useCallback(() => {
    setAiOpen(true)
    setMenuOpen(false)
  }, [])

  const patchAiConfig = useCallback(
    (patch: Partial<AIConfig>) => {
      setAiConfig((prev) => ({ ...prev, ...patch }))
    },
    [setAiConfig],
  )

  return (    <div className="app">
      <Sidebar
        activeId={activeId}
        query={query}
        favorites={favorites}
        onlyFavorites={onlyFavorites}
        open={menuOpen}
        onQuery={setQuery}
        onSelect={selectEffect}
        onToggleFavorite={toggleFavorite}
        onToggleFavorites={() => setOnlyFavorites((v) => !v)}
        onOpenAI={openAI}
        onClose={() => setMenuOpen(false)}
      />

      {menuOpen && <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="打开菜单"
            >
              <IconMenu size={16} />
            </button>
            <nav className="crumbs" aria-label="面包屑">
              <button
                type="button"
                onClick={goHome}
                style={{
                  border: 0,
                  background: 'none',
                  padding: 0,
                  color: 'inherit',
                  fontSize: 'inherit',
                }}
              >
                MotionKit
              </button>
              <i>/</i>
              {active ? (
                <>
                  <button
                    type="button"
                    onClick={goHome}
                    style={{
                      border: 0,
                      background: 'none',
                      padding: 0,
                      color: 'inherit',
                      fontSize: 'inherit',
                    }}
                  >
                    {categoryLabel[active.category]}
                  </button>
                  <i>/</i>
                  <b>{active.name}</b>
                </>
              ) : (
                <b>动效库</b>
              )}
            </nav>
          </div>

          <div className="topbar__right">
            <div className="topbar__skin">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSkinOpen((v) => !v)}
                aria-label={skinOpen ? '收起皮肤配置' : '打开皮肤配置'}
                title={skinOpen ? '收起皮肤配置' : '皮肤配置'}
              >
                <IconPalette size={16} />
              </button>
              <span
                className="topbar__skin-label"
                onClick={() => setSkinOpen((v) => !v)}
                role="presentation"
              >
                {getSkin(skinId).name}
              </span>
            </div>
            <button
              ref={aiMagnetic.ref}
              type="button"
              className="btn btn--primary btn--ai kit-magnetic"
              onPointerMove={aiMagnetic.onPointerMove}
              onPointerLeave={aiMagnetic.onPointerLeave}
              onClick={openAI}
            >
              <IconSparkles size={14} />
              <span>AI 智能选型</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
              title={theme === 'dark' ? '亮色主题' : '暗色主题'}
            >
              {theme === 'dark' ? <IconSun key="sun" size={15} /> : <IconMoon key="moon" size={15} />}
            </button>
          </div>
        </header>

        <main className="page">          {active ? (
            <Detail
              effect={active}
              params={params}
              replay={replay}
              favorite={favorites.includes(active.id)}
              onBack={goHome}
              onReplay={() => setReplay((n) => n + 1)}
              onParamChange={changeParam}
              onReset={resetParams}
              onToggleFavorite={() => toggleFavorite(active.id)}
              onOpenAI={openAI}
              onNavigate={selectEffect}
            />
          ) : (
            <Home
              effects={filtered}
              category={category}
              favorites={favorites}
              onlyFavorites={onlyFavorites}
              onCategory={(next) => {
                setCategory(next)
                setOnlyFavorites(false)
              }}
              onSelect={selectEffect}
              onOpenAI={openAI}
              onResetFilters={() => {
                setCategory('all')
                setOnlyFavorites(false)
                setQuery('')
              }}
              onToggleFavorites={() => setOnlyFavorites((v) => !v)}
            />
          )}
        </main>

        {skinOpen && <div className="skin-backdrop" onClick={() => setSkinOpen(false)} />}

        {skinOpen && (
          <SkinSettingsPanel
            open
            onClose={() => setSkinOpen(false)}
            skinId={skinId}
            theme={theme}
            accentColor={accentColor}
            onPickSkin={setSkinId}
            onPickAccent={setAccentColor}
          />
        )}

        <footer className="app-foot">
          <span>
            <b>MotionKit</b> · {catalog.length} 种可交互 UI 动效 · React + 原生 CSS
          </span>
          <span>⌘K 搜索 · 参数本地保存 · 支持 prefers-reduced-motion</span>
        </footer>
      </div>

      <Recommender
        open={aiOpen}
        aiConfig={aiConfig}
        onAiConfig={patchAiConfig}
        onClose={() => setAiOpen(false)}
        onOpenEffect={selectEffect}
      />

      <ToastHost />
    </div>
  )
}

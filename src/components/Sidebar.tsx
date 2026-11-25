import { useEffect, useMemo, useRef, useState } from 'react'
import { catalog, categoryLabel } from '../lib/catalog'
import type { CategoryId } from '../lib/types'
import { CountUp, DecodeText, useMagnetic } from './SelfEffects'
import { IconSearch, IconSparkles, IconStar, IconX } from './Icons'

interface SidebarProps {
  activeId: string | null
  query: string
  favorites: string[]
  onlyFavorites: boolean
  open: boolean
  onQuery: (value: string) => void
  onSelect: (id: string) => void
  onToggleFavorite: (id: string) => void
  onToggleFavorites: () => void
  onOpenAI: () => void
  onClose: () => void
}

const groups: { id: CategoryId; label: string }[] = [
  { id: 'pointer', label: '鼠标交互' },
  { id: 'scroll', label: '滚动控制' },
  { id: 'text', label: '文字动效' },
  { id: 'data', label: '数据与高光' },
  { id: 'base', label: '动画基础' },
  { id: 'overlay', label: '弹窗提示' },
  { id: 'component', label: '组件交互' },
  { id: 'glass', label: '液态玻璃' },
]

export default function Sidebar({
  activeId,
  query,
  favorites,
  onlyFavorites,
  open,
  onQuery,
  onSelect,
  onToggleFavorite,
  onToggleFavorites,
  onOpenAI,
  onClose,
}: SidebarProps) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.filter((e) => {
      if (onlyFavorites && !favorites.includes(e.id)) return false
      if (!q) return true
      return [e.name, e.en, e.tagline, ...e.tags, ...e.keywords, ...e.useCases]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [query, onlyFavorites, favorites])

  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState({ top: 0, height: 0, opacity: 0 })
  const ctaMagnetic = useMagnetic<HTMLButtonElement>(7)

  useEffect(() => {
    const measure = () => {
      const nav = navRef.current
      if (!nav) return
      const active = nav.querySelector<HTMLElement>('.nav__item.is-active')
      if (!active) {
        setIndicator((prev) => (prev.opacity ? { ...prev, opacity: 0 } : prev))
        return
      }
      setIndicator({ top: active.offsetTop, height: active.offsetHeight, opacity: 1 })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeId, query, onlyFavorites, favorites, open])

  let navIndex = 0

  return (
    <aside className={'sidebar' + (open ? ' is-open' : '')}>
      <div className="brand">
        <span className="brand__mark">
          <i />
          <b>✦</b>
        </span>
        <span className="brand__text">
          <strong>MotionKit</strong>
          <em>UI 动效系统</em>
        </span>
        <button type="button" className="brand__close" onClick={onClose} aria-label="关闭菜单">
          <IconX size={16} />
        </button>
      </div>

      <div className="search">
        <IconSearch size={15} className="search__icon" />
        <input
          id="global-search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="搜索动效 / 场景 / 关键词"
          aria-label="搜索动效"
        />
        {query && (
          <button type="button" className="search__clear" onClick={() => onQuery('')} aria-label="清空搜索">
            <IconX size={13} />
          </button>
        )}
        <kbd>⌘K</kbd>
      </div>

      <div className="nav__head">
        <span>动效库 <b><CountUp value={catalog.length} /></b></span>
        <button
          type="button"
          className={'fav-filter' + (onlyFavorites ? ' is-on' : '')}
          onClick={onToggleFavorites}
        >
          <IconStar size={11} filled={onlyFavorites} />
          收藏 {favorites.length ? <CountUp value={favorites.length} /> : ''}
        </button>
      </div>

      <nav ref={navRef} className="nav">
        <span
          className="kit-nav-indicator"
          aria-hidden="true"
          style={{
            transform: `translateY(${indicator.top}px)`,
            height: indicator.height,
            opacity: indicator.opacity,
          }}
        />
        {groups.map((group) => {
          const items = filtered.filter((e) => e.category === group.id)
          if (!items.length) return null
          return (
            <div className="nav__group" key={group.id}>
              <span className="nav__group-label">
                {group.label}
                <i>{items.length.toString().padStart(2, '0')}</i>
              </span>
              {items.map((effect) => {
                const fav = favorites.includes(effect.id)
                const delay = Math.min(navIndex++, 20)
                return (
                  <div
                    key={effect.id}
                    className={
                      'nav__item' +
                      (activeId === effect.id ? ' is-active' : '') +
                      (fav ? ' is-fav' : '')
                    }
                    style={{ '--nav-i': delay } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      className="nav__main"
                      onClick={() => onSelect(effect.id)}
                    >
                      <span className="nav__index">{effect.index.toString().padStart(2, '0')}</span>
                      <span className="nav__name">
                        {effect.name}
                        <em>{effect.en}</em>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="nav__star"
                      aria-label={fav ? '取消收藏' : '收藏'}
                      onClick={() => onToggleFavorite(effect.id)}
                    >
                      <IconStar size={13} filled={fav} />
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}

        {!filtered.length && (
          <div className="nav__empty">
            没有匹配的动效
            <button type="button" onClick={() => onQuery('')}>清空搜索</button>
          </div>
        )}
      </nav>

      <div className="sidebar__bottom">
        <div className="ai-cta kit-spotlight">
          <span className="ai-cta__glow" />
          <div className="ai-cta__head">
            <IconSparkles size={14} />
            AI 智能选型
            <em>NEW</em>
          </div>
          <p>
            <DecodeText
              text="说不清要什么动效？描述你的界面场景，让 AI 帮你挑。"
              duration={900}
              delay={260}
            />
          </p>
          <button
            ref={ctaMagnetic.ref}
            type="button"
            className="kit-magnetic"
            onPointerMove={ctaMagnetic.onPointerMove}
            onPointerLeave={ctaMagnetic.onPointerLeave}
            onClick={onOpenAI}
          >
            描述需求 <span>→</span>
          </button>
        </div>
        <div className="sidebar__foot">
          <span>v1.1 · <CountUp value={catalog.length} /> effects</span>
          <span>{categoryLabel.all}</span>
        </div>
      </div>
    </aside>
  )
}

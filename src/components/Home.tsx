import type { CSSProperties } from 'react'
import { catalog, categoryLabel } from '../lib/catalog'
import type { CategoryId, EffectMeta } from '../lib/types'
import EffectThumb from './EffectThumb'
import { IconArrowUpRight, IconSparkles, IconStar } from './Icons'
import {
  CountUp,
  DecodeText,
  MarqueeStrip,
  TypedTitle,
  TypewriterText,
  useMagnetic,
  useReveal,
  useSpotlight,
} from './SelfEffects'

interface HomeProps {
  effects: EffectMeta[]
  category: CategoryId | 'all'
  favorites: string[]
  onlyFavorites: boolean
  onCategory: (category: CategoryId | 'all') => void
  onSelect: (id: string) => void
  onOpenAI: () => void
  onResetFilters: () => void
  onToggleFavorites: () => void
}

const tabs: { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'pointer', label: '鼠标交互' },
  { id: 'scroll', label: '滚动控制' },
  { id: 'text', label: '文字动效' },
  { id: 'data', label: '数据与高光' },
  { id: 'base', label: '动画基础' },
  { id: 'overlay', label: '弹窗提示' },
  { id: 'component', label: '组件交互' },
  { id: 'glass', label: '液态玻璃' },
]

const HERO_PHRASES = ['拆成可复用的动效', '变成会呼吸的交互', '沉淀成可复制的代码']

const MARQUEE_WORDS = [
  'SPOTLIGHT',
  'TYPEWRITER',
  'MAGNETIC',
  'COUNT UP',
  'HOVER LIFT',
  'SHIMMER',
  'REVEAL',
  'LIQUID GLASS',
]

function FxCard({
  effect,
  index,
  favorite,
  onSelect,
}: {
  effect: EffectMeta
  index: number
  favorite: boolean
  onSelect: (id: string) => void
}) {
  const { ref, onPointerMove, onPointerLeave } = useSpotlight<HTMLButtonElement>()
  return (
    <button
      ref={ref}
      type="button"
      className="fx-card kit-spotlight"
      style={{ '--stagger': `${Math.min(index, 14) * 32}ms` } as CSSProperties}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={() => onSelect(effect.id)}
    >
      <div className="fx-card__thumb">
        <EffectThumb id={effect.id} />
        <span className="fx-card__index">{effect.index.toString().padStart(2, '0')}</span>
        {favorite && (
          <span className="fx-card__fav"><IconStar size={11} filled /></span>
        )}
        <span className="fx-card__open"><IconArrowUpRight size={14} /></span>
      </div>
      <div className="fx-card__body">
        <div className="fx-card__title">
          <h3>{effect.name}</h3>
          <em>{effect.en}</em>
        </div>
        <p>{effect.tagline}</p>
        <div className="fx-card__meta">
          <span>{categoryLabel[effect.category]}</span>
          <div className="fx-card__tags">
            {effect.tags.slice(0, 2).map((tag) => (
              <i key={tag}>{tag}</i>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function Home({
  effects,
  category,
  favorites,
  onlyFavorites,
  onCategory,
  onSelect,
  onOpenAI,
  onResetFilters,
  onToggleFavorites,
}: HomeProps) {
  const magnetic = useMagnetic<HTMLButtonElement>(9)
  const heroSpotlight = useSpotlight<HTMLDivElement>()
  const copyReveal = useReveal<HTMLDivElement>()
  const headReveal = useReveal<HTMLDivElement>()

  return (
    <div className="home">
      <section className="hero">
        <div ref={copyReveal} className="hero__copy kit-reveal">
          <span className="hero__badge">
            <i /> {catalog.length} 种可交互 UI 动效 · 本页已自用
          </span>
          <h1>
            把「高级感」
            <br />
            <TypewriterText className="hero__typed" phrases={HERO_PHRASES} speed={58} pause={1700} />
          </h1>
          <p>
            <DecodeText
              text="鼠标聚光灯、滚动叙事、弹窗提示、液态玻璃……每种效果都可以现场调参、复制代码。这个页面本身也用了打字机、磁吸按钮、数字递增、文字解码和轻提示——不是只展示给你看。"
              duration={1200}
              delay={520}
            />
          </p>
          <div className="hero__actions">
            <button
              ref={magnetic.ref}
              type="button"
              className="btn btn--primary kit-magnetic"
              onPointerMove={magnetic.onPointerMove}
              onPointerLeave={magnetic.onPointerLeave}
              onClick={onOpenAI}
            >
              <IconSparkles size={16} />
              描述需求，智能推荐
            </button>
            <a className="btn btn--ghost" href="#library">
              浏览全部动效
              <span>↓</span>
            </a>
          </div>
          <div className="hero__stats">
            <div><b><CountUp value={catalog.length} /></b><span>动效配方</span></div>
            <div><b><CountUp value={new Set(catalog.map((e) => e.category)).size} /></b><span>交互分类</span></div>
            <div><b><CountUp value={100} suffix="%" /></b><span>参数可调</span></div>
            <div><b><CountUp value={2} /></b><span>推荐引擎</span></div>
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <span className="hero__aurora" />
          <div className="hero-card hero-card--back">
            <EffectThumb id="borderBeam" />
            <span className="hero-card__name">Border Beam<em>03</em></span>
          </div>
          <div
            ref={heroSpotlight.ref}
            className="hero-card hero-card--front kit-spotlight"
            onPointerMove={heroSpotlight.onPointerMove}
            onPointerLeave={heroSpotlight.onPointerLeave}
          >
            <EffectThumb id="spotlight" />
            <span className="hero-card__name">Spotlight<em>01</em></span>
          </div>
          <span className="hero-chip kit-glass">
            <IconSparkles size={12} />
            AI 选型 · 本地语义
          </span>
          <span className="hero-code">cubic-bezier(.16, 1, .3, 1)</span>
        </div>
      </section>

      <MarqueeStrip words={MARQUEE_WORDS} />

      <section className="library" id="library">
        <div ref={headReveal} className="library__head kit-reveal">
          <div>
            <h2><TypedTitle text="动效库" speed={90} whenVisible /></h2>
            <p>
              <DecodeText
                text="点击任意卡片进入 Live Preview，所有参数即时生效。"
                duration={820}
                delay={420}
                whenVisible
              />
            </p>
          </div>
          <span className="library__count">
            <CountUp value={effects.length} /> / <CountUp value={catalog.length} />
          </span>
        </div>

        <div className="cat-tabs" role="tablist" aria-label="按分类筛选">
          {tabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? catalog.length
                : catalog.filter((e) => e.category === tab.id).length
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={category === tab.id && !onlyFavorites}
                className={category === tab.id && !onlyFavorites ? 'is-active' : ''}
                onClick={() => onCategory(tab.id)}
              >
                {tab.label}
                <i>{count}</i>
              </button>
            )
          })}
          <button
            type="button"
            role="tab"
            aria-selected={onlyFavorites}
            className={'cat-tabs__fav' + (onlyFavorites ? ' is-active' : '')}
            onClick={onToggleFavorites}
          >
            <IconStar size={11} filled={onlyFavorites} />
            收藏
            <i>{favorites.length}</i>
          </button>
        </div>

        {effects.length ? (
          <div className="fx-grid">
            {effects.map((effect, index) => (
              <FxCard
                key={effect.id}
                effect={effect}
                index={index}
                favorite={favorites.includes(effect.id)}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="library__empty">
            <span>⌕</span>
            <h3>没有找到匹配的动效</h3>
            <p>试试更宽泛的关键词，或者直接描述你的界面场景。</p>
            <div>
              <button type="button" className="btn btn--ghost" onClick={onResetFilters}>
                重置筛选
              </button>
              <button type="button" className="btn btn--primary" onClick={onOpenAI}>
                让 AI 帮我找
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

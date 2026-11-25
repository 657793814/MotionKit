import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { catalog, categoryLabel } from '../lib/catalog'
import { useCopy } from '../lib/hooks'
import type { EffectMeta, Params } from '../lib/types'
import { demos } from '../effects'
import CodeCard from './CodeCard'
import Controls from './Controls'
import { DecodeText, TypedTitle } from './SelfEffects'
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCheck,
  IconCopy,
  IconExpand,
  IconReplay,
  IconSparkles,
  IconStar,
  IconX,
} from './Icons'

interface DetailProps {
  effect: EffectMeta
  params: Params
  replay: number
  favorite: boolean
  onBack: () => void
  onReplay: () => void
  onParamChange: (key: string, value: string | number | boolean) => void
  onReset: () => void
  onToggleFavorite: () => void
  onOpenAI: () => void
  onNavigate: (id: string) => void
}

export default function Detail({
  effect,
  params,
  replay,
  favorite,
  onBack,
  onReplay,
  onParamChange,
  onReset,
  onToggleFavorite,
  onOpenAI,
  onNavigate,
}: DetailProps) {
  const [fullscreen, setFullscreen] = useState(false)
  const { copied, copy } = useCopy()
  const Demo = demos[effect.id]

  const position = catalog.findIndex((e) => e.id === effect.id)
  const prev = catalog[(position - 1 + catalog.length) % catalog.length]
  const next = catalog[(position + 1) % catalog.length]

  const prompt = useMemo(
    () =>
      `请帮我实现「${effect.name}」动效：${effect.tagline}。使用场景是${effect.useCases[0]}，${effect.tip.split('。')[0]}。`,
    [effect],
  )

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [fullscreen])

  const demo = (suffix: string) =>
    Demo ? (
      <Demo
        key={`${effect.id}-${suffix}-${replay}`}
        params={params}
        replay={replay}
        onParamChange={onParamChange}
        onReplay={onReplay}
      />
    ) : (
      <div className="stage-error">该动效正在加载中…</div>
    )

  return (
    <div className="detail">
      <button type="button" className="back-link" onClick={onBack}>
        <IconArrowLeft size={14} />
        返回动效库
      </button>

      <header className="detail__head">
        <div className="detail__title-row">
          <span className="detail__index">{effect.index.toString().padStart(2, '0')}</span>
          <div className="detail__title">
            <div className="detail__name">
              <h1>
                <TypedTitle text={effect.name} speed={64} delay={40} />
              </h1>
              <span>{effect.en}</span>
            </div>
            <p>
              <DecodeText text={effect.tagline} duration={680} delay={220} />
            </p>
          </div>
          <div className="detail__actions">
            <span className="detail__cat">{categoryLabel[effect.category]}</span>
            <button
              type="button"
              className={'icon-btn' + (favorite ? ' is-fav' : '')}
              onClick={onToggleFavorite}
              aria-label={favorite ? '取消收藏' : '收藏'}
              title={favorite ? '取消收藏' : '收藏'}
            >
              <IconStar size={15} filled={favorite} />
            </button>
          </div>
        </div>
        <p className="detail__desc">
          <DecodeText text={effect.description} duration={980} delay={320} />
        </p>
        <div className="detail__tags">
          {effect.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <div className="live-grid">
        <section className="stage-card">
          <div className="stage-bar">
            <div className="stage-bar__left">
              <span className="stage-bar__dots"><i /><i /><i /></span>
              <span className="stage-bar__label">
                <b>LIVE PREVIEW</b>
                <em>{effect.en}</em>
              </span>
            </div>
            <div className="stage-bar__actions">
              <button type="button" onClick={onReplay} title="重播动效">
                <IconReplay size={13} />
                重播
              </button>
              <button type="button" onClick={() => setFullscreen(true)} title="专注模式">
                <IconExpand size={13} />
                专注
              </button>
            </div>
          </div>
          <div className="stage dark-scope">{demo('inline')}</div>
        </section>

        <Controls
          params={effect.params}
          values={params}
          onChange={onParamChange}
          onReset={onReset}
          onOpenAI={onOpenAI}
        />
      </div>

      <div className="detail-lower">
        <CodeCard effect={effect} params={params} />

        <div className="info-col">
          <section className="panel">
            <div className="panel__head">
              <h3><TypedTitle text="适用场景" speed={36} whenVisible /></h3>
              <span>USE CASES</span>
            </div>
            <ul className="use-list">
              {effect.useCases.map((useCase, i) => (
                <li key={useCase}>
                  <i>0{i + 1}</i>
                  {useCase}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h3><TypedTitle text="使用建议" speed={36} whenVisible /></h3>
              <span>TIPS</span>
            </div>
            <p className="tip-text">
              <DecodeText text={effect.tip} duration={760} delay={160} whenVisible />
            </p>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h3><TypedTitle text="Prompt 模板" speed={36} whenVisible /></h3>
              <button type="button" className="mini-copy" onClick={() => copy(prompt, 'Prompt 已复制')}>
                {copied === 'Prompt 已复制' ? <IconCheck size={12} /> : <IconCopy size={12} />}
                {copied === 'Prompt 已复制' ? '已复制' : '复制'}
              </button>
            </div>
            <p className="prompt-text">{prompt}</p>
            <div className="keyword-row">
              {effect.keywords.slice(0, 7).map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          </section>

          <button type="button" className="ai-strip" onClick={onOpenAI}>
            <IconSparkles size={15} />
            <span>
              <strong>需要另一种感觉？</strong>
              <em>描述场景，让 AI 重新推荐</em>
            </span>
            <IconArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <nav className="prev-next">
        <button type="button" onClick={() => onNavigate(prev.id)}>
          <span>← 上一个</span>
          <strong>
            <i>{prev.index.toString().padStart(2, '0')}</i>
            {prev.name}
          </strong>
        </button>
        <button type="button" className="prev-next__next" onClick={() => onNavigate(next.id)}>
          <span>下一个 →</span>
          <strong>
            {next.name}
            <i>{next.index.toString().padStart(2, '0')}</i>
          </strong>
        </button>
      </nav>

      {fullscreen &&
        createPortal(
          <div className="fs-overlay">
            <div className="fs-bar">
              <span className="fs-bar__title">
                <i>{effect.index.toString().padStart(2, '0')}</i>
                {effect.name}
                <em>{effect.en}</em>
              </span>
              <div className="fs-bar__actions">
                <button type="button" onClick={onReplay}>
                  <IconReplay size={14} /> 重播
                </button>
                <button type="button" onClick={() => setFullscreen(false)} aria-label="退出专注模式">
                  <IconX size={16} />
                </button>
              </div>
            </div>
            <div className="fs-stage dark-scope">{demo('full')}</div>
            <span className="fs-hint">按 Esc 退出专注模式</span>
          </div>,
          document.body,
        )}
    </div>
  )
}

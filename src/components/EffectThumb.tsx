import './EffectThumb.css'

function BorderThumb({ variant }: { variant: string }) {
  return (
    <div className="thumb">
      <div className={`t-bx t-bx--${variant}`}>
        <span className="t-bx__ring" />
        <span className="t-bx__body">
          <span className="t-bx__line" />
          <span className="t-bx__line t-bx__line--short" />
          <span className="t-bx__pill" />
        </span>
      </div>
    </div>
  )
}

export default function EffectThumb({ id }: { id: string }) {
  switch (id) {
    case 'spotlight':
      return (
        <div className="thumb t-spot">
          <div className="t-spot__card">
            <span className="t-spot__icon">✦</span>
            <span className="t-spot__line" />
            <span className="t-spot__line t-spot__line--short" />
            <span className="t-spot__btn" />
            <span className="t-spot__light" />
          </div>
        </div>
      )
    case 'reveal':
      return (
        <div className="thumb t-reveal">
          <span className="t-reveal__bar t-reveal__bar--head" />
          <span className="t-reveal__bar" />
          <span className="t-reveal__bar" />
          <span className="t-reveal__bar t-reveal__bar--short" />
        </div>
      )
    case 'borderBeam':
      return (
        <div className="thumb t-beam">
          <div className="t-beam__card">
            <span className="t-beam__badge">PRO</span>
            <span className="t-beam__line" />
            <span className="t-beam__price">128</span>
            <span className="t-beam__line t-beam__line--short" />
          </div>
        </div>
      )
    case 'magnetic':
      return (
        <div className="thumb t-mag">
          <span className="t-mag__ring" />
          <span className="t-mag__cursor" />
          <span className="t-mag__btn" aria-hidden="true">→</span>
          <span className="t-mag__hint">MAGNET</span>
        </div>
      )
    case 'scrollStory':
      return (
        <div className="thumb t-story">
          <div className="t-story__frame">
            <span className="t-story__no">01</span>
            <span className="t-story__line" />
            <span className="t-story__line t-story__line--short" />
          </div>
          <div className="t-story__dots"><i /><i /><i /></div>
        </div>
      )
    case 'tilt3d':
      return (
        <div className="thumb t-tilt">
          <div className="t-tilt__card">
            <span className="t-tilt__brand">NOVA</span>
            <span className="t-tilt__title">AURORA</span>
            <span className="t-tilt__chip" />
            <span className="t-tilt__glare" />
          </div>
        </div>
      )
    case 'textDecode':
      return (
        <div className="thumb t-decode">
          <span className="t-decode__ghost">#0x9F</span>
          <span className="t-decode__text">DECODE</span>
          <span className="t-decode__caret" />
        </div>
      )
    case 'shimmer':
      return (
        <div className="thumb t-shimmer">
          <div className="t-shimmer__head">
            <span className="t-shimmer__avatar" />
            <span className="t-shimmer__meta"><i /><i /></span>
          </div>
          <span className="t-shimmer__block" />
          <span className="t-shimmer__line" />
        </div>
      )
    case 'parallax':
      return (
        <div className="thumb t-parallax">
          <span className="t-parallax__moon" />
          <span className="t-parallax__hill t-parallax__hill--back" />
          <span className="t-parallax__hill t-parallax__hill--mid" />
          <span className="t-parallax__hill t-parallax__hill--front" />
        </div>
      )
    case 'countUp':
      return (
        <div className="thumb t-count">
          <span className="t-count__ring" />
          <span className="t-count__value">98.2<em>%</em></span>
          <span className="t-count__bars"><i /><i /><i /><i /><i /><i /></span>
        </div>
      )
    case 'hoverLift':
      return (
        <div className="thumb t-lift">
          <div className="t-lift__card">
            <span className="t-lift__icon">◆</span>
            <span className="t-lift__line" />
            <span className="t-lift__line t-lift__line--short" />
          </div>
          <span className="t-lift__shadow" />
        </div>
      )
    case 'typewriter':
      return (
        <div className="thumb t-type">
          <span className="t-type__prompt">❯</span>
          <span className="t-type__text">MOTION</span>
          <span className="t-type__caret" />
          <span className="t-type__line" />
        </div>
      )
    case 'stagger':
      return (
        <div className="thumb t-stagger">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
              <i />
            </span>
          ))}
        </div>
      )
    case 'marquee':
      return (
        <div className="thumb t-marquee">
          <div className="t-marquee__row">
            {['DESIGN', 'MOTION', 'SYSTEM', 'DETAIL', 'DESIGN', 'MOTION'].map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </div>
          <div className="t-marquee__row t-marquee__row--alt">
            {['CRAFT', 'RHYTHM', 'CRAFT', 'RHYTHM'].map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </div>
        </div>
      )
    case 'spring':
      return (
        <div className="thumb t-spring">
          <span className="t-spring__rail" />
          <span className="t-spring__target" />
          <span className="t-spring__ball"><i /></span>
          <span className="t-spring__trail" />
        </div>
      )
    case 'easing':
      return (
        <div className="thumb t-easing">
          <svg viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="t-easing__grid" d="M20 20V80H140" />
            <path className="t-easing__curve" d="M20 80 C 44 12, 80 18, 140 20" />
            <circle className="t-easing__dot" r="4">
              <animateMotion
                dur="2.6s"
                repeatCount="indefinite"
                path="M20 80 C 44 12, 80 18, 140 20"
                keyPoints="0;1;1"
                keyTimes="0;0.75;1"
                calcMode="spline"
                keySplines="0.16 1 0.3 1;0 0 1 1"
              />
            </circle>
          </svg>
        </div>
      )
    case 'modalDialog':
      return (
        <div className="thumb t-modal">
          <div className="t-modal__veil" />
          <div className="t-modal__card">
            <span className="t-modal__line t-modal__line--title" />
            <span className="t-modal__line" />
            <span className="t-modal__line t-modal__line--short" />
            <div className="t-modal__actions"><i /><b /></div>
          </div>
        </div>
      )
    case 'toast':
      return (
        <div className="thumb t-toast">
          <div className="t-toast__item"><i /><span /><em /></div>
          <div className="t-toast__item t-toast__item--2"><i /><span /><em /></div>
          <span className="t-toast__trigger" />
        </div>
      )
    case 'drawer':
      return (
        <div className="thumb t-drawer">
          <div className="t-drawer__page"><i /><i /><i /><i /></div>
          <div className="t-drawer__panel">
            <span className="t-drawer__line t-drawer__line--head" />
            <span className="t-drawer__line" />
            <span className="t-drawer__line t-drawer__line--short" />
          </div>
        </div>
      )
    case 'popover':
      return (
        <div className="thumb t-pop">
          <div className="t-pop__bubble"><i /><span /><span /></div>
          <span className="t-pop__arrow" />
          <span className="t-pop__trigger">◉</span>
        </div>
      )
    case 'bottomSheet':
      return (
        <div className="thumb t-sheet">
          <div className="t-sheet__phone">
            <span className="t-sheet__status" />
            <i /><i /><i />
            <div className="t-sheet__panel"><b /><span /><span /><em /></div>
          </div>
        </div>
      )
    case 'notification':
      return (
        <div className="thumb t-notice">
          <div className="t-notice__item"><i /><span /><em /></div>
          <div className="t-notice__item t-notice__item--2"><i /><span /><em /></div>
          <span className="t-notice__trigger" />
        </div>
      )
    case 'liquidGlass':
      return (
        <div className="thumb t-glass">
          <span className="t-glass__blob t-glass__blob--a" />
          <span className="t-glass__blob t-glass__blob--b" />
          <span className="t-glass__blob t-glass__blob--c" />
          <div className="t-glass__card">
            <span className="t-glass__chip">LIQUID</span>
            <span className="t-glass__line" />
            <span className="t-glass__line t-glass__line--short" />
            <span className="t-glass__shine" />
          </div>
        </div>
      )
    case 'paperPlane':
      return (
        <div className="thumb t-plane">
          <div className="t-plane__card"><i /><i /><i /></div>
          <span className="t-plane__btn">分享 <b>➤</b></span>
          <span className="t-plane__fly">➤</span>
        </div>
      )
    case 'longPressMenu':
      return (
        <div className="thumb t-lpm">
          <div className="t-lpm__card"><i /><i /></div>
          <div className="t-lpm__actions"><b /><b /><b /><b /></div>
          <span className="t-lpm__ripple" />
        </div>
      )
    case 'accordion':
      return (
        <div className="thumb t-acc">
          <div className="t-acc__row"><i /><b>+</b></div>
          <div className="t-acc__row is-open"><i /><i className="t-acc__mini" /><b>×</b></div>
          <div className="t-acc__row"><i /><b>+</b></div>
        </div>
      )
    case 'multiSelectBar':
      return (
        <div className="thumb t-ms">
          <div className="t-ms__rows"><i /><i /><i /></div>
          <div className="t-ms__bar"><span>已选 2 项</span><b /><b /></div>
        </div>
      )
    case 'numberStepper':
      return (
        <div className="thumb t-stepper">
          <div className="t-stepper__box"><i /><i /></div>
          <div className="t-stepper__ctrl"><b>−</b><span>2</span><b>+</b></div>
        </div>
      )
    case 'cardFlip':
      return (
        <div className="thumb t-flip">
          <div className="t-flip__card">
            <span className="t-flip__front">PRO</span>
            <span className="t-flip__back">NO.01</span>
          </div>
          <span className="t-flip__hint">↻</span>
        </div>
      )
    case 'searchFilter':
      return (
        <div className="thumb t-sf">
          <span className="t-sf__search">⌕</span>
          <div className="t-sf__tabs"><i className="t-sf__pill" /><b /><b /><b /></div>
          <div className="t-sf__list"><i /><i /><i /></div>
        </div>
      )
    case 'stepProgress':
      return (
        <div className="thumb t-sp">
          <div className="t-sp__track"><i><b>✓</b></i><span /><i>2</i><span /><i>3</i><span /><i>4</i></div>
          <div className="t-sp__lines"><em /><em /></div>
        </div>
      )
    case 'glassTabBar':
      return (
        <div className="thumb t-gtab">
          <span className="t-gtab__blob" />
          <div className="t-gtab__bar"><i className="t-gtab__pill" /><b /><b /><b /><b /></div>
        </div>
      )
    case 'glassToggle':
      return (
        <div className="thumb t-gtog">
          <span className="t-gtog__blob" />
          <div className="t-gtog__track"><i /></div>
        </div>
      )
    case 'glassSlider':
      return (
        <div className="thumb t-gslider">
          <span className="t-gslider__blob" />
          <div className="t-gslider__track"><i /><b>60</b></div>
        </div>
      )
    case 'glassCard':
      return (
        <div className="thumb t-gcard">
          <span className="t-gcard__a" />
          <span className="t-gcard__b" />
          <div className="t-gcard__card"><i /><i /></div>
        </div>
      )
    case 'borderFlow':
      return <BorderThumb variant="flow" />
    case 'borderNeon':
      return <BorderThumb variant="neon" />
    case 'borderFade':
      return <BorderThumb variant="fade" />
    case 'borderDust':
      return <BorderThumb variant="dust" />
    case 'borderNebula':
      return <BorderThumb variant="nebula" />
    case 'borderScan':
      return <BorderThumb variant="scan" />
    default:
      return <div className="thumb" />
  }
}

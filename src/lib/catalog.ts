import type { EffectMeta, Params } from './types'
import { bool, num, str } from './utils'
import { borderCatalog } from './catalog.borders'

const pct = (n: number) => `${Math.round(n * 100)}%`

export const catalog: EffectMeta[] = [
  /* ---------------------------------------------------------------- 01 */
  {
    id: 'spotlight',
    index: 1,
    name: '鼠标聚光灯',
    en: 'Spotlight',
    tagline: '光晕跟随鼠标，让功能卡片自己发光',
    description:
      '在卡片内部监听鼠标坐标，把径向渐变光晕实时定位到指针位置，再叠加一圈边缘高光，让平面的卡片拥有「被照亮」的质感。适合功能区、定价卡、产品特性等需要强调高级感的模块。',
    category: 'pointer',
    tags: ['鼠标跟随', '光晕', '卡片'],
    useCases: ['SaaS 功能卡片', '定价方案', 'AI 产品首页', '作品集卡片'],
    keywords: ['鼠标', '光晕', '聚光灯', '跟随', '卡片', '发光', '高级', '照亮', '特性', '定价', '官网', '科技感', '光'],
    tip: '只更新两个 CSS 变量，不触发布局重排。触屏设备建议降级为静态渐变，避免出现无法关闭的悬浮光。',
    params: [
      { key: 'size', label: '光晕半径', type: 'range', default: 280, min: 120, max: 420, step: 10, unit: 'px' },
      { key: 'opacity', label: '光晕强度', type: 'range', default: 0.28, min: 0.06, max: 0.5, step: 0.02, unit: '' },
      { key: 'color', label: '光晕颜色', type: 'color', default: '#3b82f6' },
      { key: 'edge', label: '边缘高光', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef } from 'react'
import './Spotlight.css'

export function SpotlightCard() {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', e.clientX - rect.left + 'px')
    el.style.setProperty('--my', e.clientY - rect.top + 'px')
  }

  return (
    <div ref={ref} className="spotlight" onPointerMove={onMove}>
      <span className="spotlight__icon">✦</span>
      <h3 className="spotlight__title">AI 工作流</h3>
      <p className="spotlight__desc">把鼠标移到卡片上，光会跟着你。</p>
      <button className="spotlight__cta">开始使用</button>
    </div>
  )
}`,
      css: `.spotlight {
  --mx: 50%;
  --my: 50%;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 320px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: #12131a;
  color: #f4f4f8;
}

/* 跟随鼠标的径向光晕 */
.spotlight::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    ${num(p.size)}px circle at var(--mx) var(--my),
    ${'rgba(59, 130, 246, ' + num(p.opacity) + ')'},
    transparent 70%
  );
}

${
  bool(p.edge)
    ? `/* 指针附近的描边高光 */
.spotlight::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    200px circle at var(--mx) var(--my),
    rgba(255, 255, 255, 0.35),
    transparent 60%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1px;
}
`
    : ''
}.spotlight__icon { font-size: 22px; color: #60a5fa; }
.spotlight__title { margin: 18px 0 8px; font-size: 22px; }
.spotlight__desc { margin: 0; color: #9aa3b2; line-height: 1.6; }
.spotlight__cta {
  margin-top: 24px;
  padding: 10px 16px;
  border: 0;
  border-radius: 10px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}`,
    }),
  },

  /* ---------------------------------------------------------------- 02 */
  {
    id: 'reveal',
    index: 2,
    name: '滚动显现',
    en: 'Scroll Reveal',
    tagline: '内容随滚动逐段淡入，长页面不再平铺直叙',
    description:
      '用 IntersectionObserver 监听元素进入视口，再以位移、模糊与透明度过渡完成入场。支持方向、距离、延迟和模糊强度调节，是长落地页最通用的节奏控制器。',
    category: 'scroll',
    tags: ['滚动', '淡入', '长页面'],
    useCases: ['落地页长页', '产品介绍', '博客正文', '数据报告'],
    keywords: ['滚动', '显现', '淡入', '出现', '长页面', '入场', '内容', '视口', '官网', '介绍', '进入', '往下滑'],
    tip: '动画交给 CSS，JavaScript 只负责在进入视口时加 class。尊重 prefers-reduced-motion，直接显示全部内容。',
    params: [
      {
        key: 'direction',
        label: '入场方向',
        type: 'select',
        default: 'up',
        options: [
          { label: '向上淡入', value: 'up' },
          { label: '向下淡入', value: 'down' },
          { label: '从左滑入', value: 'left' },
          { label: '从右滑入', value: 'right' },
          { label: '缩放淡入', value: 'scale' },
        ],
      },
      { key: 'distance', label: '位移距离', type: 'range', default: 40, min: 0, max: 120, step: 4, unit: 'px' },
      { key: 'duration', label: '动画时长', type: 'range', default: 700, min: 200, max: 1400, step: 50, unit: 'ms' },
      { key: 'blur', label: '模糊强度', type: 'range', default: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'stagger', label: '组内间隔', type: 'range', default: 80, min: 0, max: 240, step: 10, unit: 'ms' },
    ],
    code: (p: Params) => {
      const dir = str(p.direction, 'up')
      const offset =
        dir === 'up'
          ? `translateY(${num(p.distance)}px)`
          : dir === 'down'
            ? `translateY(-${num(p.distance)}px)`
            : dir === 'left'
              ? `translateX(-${num(p.distance)}px)`
              : dir === 'right'
                ? `translateX(${num(p.distance)}px)`
                : 'scale(0.94)'
      return {
        tsx: `import { useEffect, useRef } from 'react'
import './Reveal.css'

export function RevealList() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { root: root.current, threshold: 0.2 },
    )
    root.current?.querySelectorAll('.reveal-item').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={root} className="reveal-scroll">
      {items.map((item, i) => (
        <article
          key={item.title}
          className="reveal-item"
          style={{ transitionDelay: i * ${num(p.stagger)} + 'ms' }}
        >
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </article>
      ))}
    </div>
  )
}`,
        css: `.reveal-scroll {
  height: 420px;
  overflow-y: auto;
  display: grid;
  gap: 16px;
  padding: 24px;
}

.reveal-item {
  opacity: 0;
  transform: ${offset};
  filter: blur(${num(p.blur)}px);
  transition:
    opacity ${num(p.duration)}ms ease,
    transform ${num(p.duration)}ms cubic-bezier(0.22, 1, 0.36, 1),
    filter ${num(p.duration)}ms ease;
  will-change: opacity, transform;
}

.reveal-item.is-visible {
  opacity: 1;
  transform: none;
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-item {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}`,
      }
    },
  },

  /* ---------------------------------------------------------------- 03 */
  {
    id: 'borderBeam',
    index: 3,
    name: '边缘流光',
    en: 'Border Beam',
    tagline: '一束光沿边框循环游走，把重点圈出来',
    description:
      '借助 @property 注册角度变量，让 conic-gradient 沿卡片边框持续旋转，再用 mask 裁出 1px 的描边。视觉上像一道流光在边缘巡逻，适合强调「推荐 / 在线 / 新增」等状态。',
    category: 'data',
    tags: ['边框', '流光', '强调'],
    useCases: ['推荐套餐卡', 'AI 功能入口', '限量活动', '在线状态'],
    keywords: ['边框', '流光', '循环', '高亮', '强调', '发光', '卡片', '科技', '推荐', '在线', '跑光', '描边'],
    tip: '同屏只保留一个到两个流光焦点。多个光束同时旋转会互相抢注意力，也增加合成层开销。',
    params: [
      { key: 'speed', label: '旋转周期', type: 'range', default: 4, min: 1, max: 12, step: 0.5, unit: 's' },
      { key: 'thickness', label: '描边粗细', type: 'range', default: 1.5, min: 1, max: 4, step: 0.5, unit: 'px' },
      { key: 'size', label: '光束长度', type: 'range', default: 100, min: 30, max: 200, step: 10, unit: 'deg' },
      { key: 'color1', label: '主色', type: 'color', default: '#3b82f6' },
      { key: 'color2', label: '辅色', type: 'color', default: '#22d3ee' },
      { key: 'glow', label: '外发光', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import './BorderBeam.css'

export function BorderBeamCard() {
  return (
    <div className="beam-wrap">
      <div className="beam-card">
        <span className="beam-badge">推荐</span>
        <h3>Pro 套餐</h3>
        <p className="beam-price">¥ 128 <span>/ 月</span></p>
        <ul>
          <li>不限次数的 AI 生成</li>
          <li>优先队列与专属模型</li>
          <li>团队协作空间</li>
        </ul>
        <button>立即升级</button>
      </div>
    </div>
  )
}`,
      css: `@property --beam-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.beam-wrap {
  --thickness: ${num(p.thickness)}px;
  position: relative;
  padding: var(--thickness);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

/* 旋转的圆锥渐变 + 描边遮罩 */
.beam-wrap::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: conic-gradient(
    from var(--beam-angle),
    transparent 0deg,
    ${str(p.color1)} ${num(p.size) * 0.25}deg,
    ${str(p.color2)} ${num(p.size) * 0.5}deg,
    transparent ${num(p.size)}deg
  );
  animation: beam-spin ${num(p.speed)}s linear infinite;
}

.beam-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #0f1016;
}

@keyframes beam-spin {
  to { --beam-angle: 360deg; }
}

.beam-card {
  position: relative;
  z-index: 1;
  padding: 32px;
  border-radius: 20px;
  background: #0f1016;
  color: #f4f4f8;
}

${
  bool(p.glow)
    ? `/* 在卡片外圈加一层柔光 */
.beam-wrap {
  box-shadow: 0 0 40px -12px ${str(p.color1)}66;
}`
    : ''
}`,
    }),
  },

  /* ---------------------------------------------------------------- 04 */
  {
    id: 'magnetic',
    index: 4,
    name: '磁吸按钮',
    en: 'Magnetic Button',
    tagline: '按钮被鼠标轻轻吸引，移开后弹回原位',
    description:
      '计算指针相对按钮中心的偏移量，按比例施加位移与内部视差，离开时用带回弹的缓动复位。微小而克制的「不听话感」，会让主 CTA 变得难以忽视。',
    category: 'pointer',
    tags: ['鼠标吸引', '回弹', 'CTA'],
    useCases: ['主 CTA', '下载按钮', '活动入口', '404 页面'],
    keywords: ['按钮', '磁吸', '鼠标', '吸引', '复位', '回弹', '点击', '引导', '交互', '靠近', 'CTA'],
    tip: '强度控制在 0.2–0.4 最自然；保留键盘焦点样式，触屏与 reduced-motion 场景直接跳过磁吸逻辑。',
    params: [
      { key: 'strength', label: '磁吸强度', type: 'range', default: 0.35, min: 0.05, max: 0.8, step: 0.05 },
      { key: 'range', label: '感应范围', type: 'range', default: 300, min: 180, max: 420, step: 10, unit: 'px' },
      { key: 'duration', label: '复位时长', type: 'range', default: 450, min: 200, max: 900, step: 50, unit: 'ms' },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef } from 'react'
import './Magnetic.css'

export function MagneticButton() {
  const field = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const area = field.current!.getBoundingClientRect()
    const b = btn.current!.getBoundingClientRect()
    const dx = e.clientX - (area.left + area.width / 2)
    const dy = e.clientY - (area.top + area.height / 2)
    // 只统计指针靠近按钮时的位移，越近吸引越强
    btn.current!.style.transform =
      'translate(' + dx * ${num(p.strength)} + 'px, ' + dy * ${num(p.strength)} + 'px)'
    btn.current!.style.setProperty('--gx', ((e.clientX - b.left) / b.width) * 100 + '%')
    btn.current!.style.setProperty('--gy', ((e.clientY - b.top) / b.height) * 100 + '%')
  }

  const reset = () => {
    btn.current!.style.transform = 'translate(0, 0)'
  }

  return (
    <div ref={field} className="magnetic-field" onPointerMove={onMove} onPointerLeave={reset}>
      <button ref={btn} className="magnetic-btn">
        <span>开始创造</span>
        <i>→</i>
      </button>
      <p className="magnetic-hint">把鼠标靠近按钮</p>
    </div>
  )
}`,
      css: `.magnetic-field {
  position: relative;
  display: grid;
  place-items: center;
  width: ${num(p.range)}px;
  height: ${num(p.range)}px;
  border-radius: 50%;
}

.magnetic-btn {
  --gx: 50%;
  --gy: 50%;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 34px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: #3b82f6;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: transform ${num(p.duration)}ms cubic-bezier(0.22, 1.4, 0.36, 1);
  will-change: transform;
}

.magnetic-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    120px circle at var(--gx) var(--gy),
    rgba(255, 255, 255, 0.35),
    transparent 70%
  );
  pointer-events: none;
}

.magnetic-field:active .magnetic-btn {
  transition-duration: 90ms;
}`,
    }),
  },

  /* ---------------------------------------------------------------- 05 */
  {
    id: 'scrollStory',
    index: 5,
    name: '滚动叙事',
    en: 'Scroll Storytelling',
    tagline: '滚动代替点击，让页面像分镜一样推进',
    description:
      '外层容器撑出足够的滚动距离，内层内容 sticky 固定，再根据滚动进度切换章节与进度条。用户不必点击，滚动本身就是叙事节奏，适合讲清楚一个复杂产品或流程。',
    category: 'scroll',
    tags: ['sticky', '分镜', '进度'],
    useCases: ['品牌官网', '产品原理讲解', '年度报告', '时间线'],
    keywords: ['滚动', '叙事', '固定', 'sticky', '切换', '官网', '介绍', '分镜', '章节', '流程', '故事', '进度', '翻页'],
    tip: '章节数控制在 3–5 个。移动端务必提供「跳过」入口，别让用户被长距离滚动困住。',
    params: [
      { key: 'accent', label: '强调色', type: 'color', default: '#3b82f6' },
      { key: 'smooth', label: '切换时长', type: 'range', default: 260, min: 80, max: 600, step: 20, unit: 'ms' },
      { key: 'zoom', label: '背景缩放', type: 'switch', default: true },
      { key: 'progress', label: '显示进度', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef, useState } from 'react'
import './ScrollStory.css'

const chapters = [
  { step: '01', title: '捕捉意图', desc: '自然语言进入系统，先理解，再行动。' },
  { step: '02', title: '编排流程', desc: '把复杂任务拆成可执行、可回滚的步骤。' },
  { step: '03', title: '交付结果', desc: '每一步都有依据，结果可以被验证。' },
]

export function ScrollStory() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = scroller.current!
    const onScroll = () => {
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setActive(Math.min(2, Math.floor(progress * 3)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={scroller} className="story-scroll">
      <div className="story-track">
        <div className="story-sticky">
          <div className="story-visual">
            {chapters.map((c, i) => (
              <div key={c.step} className={'story-layer' + (i === active ? ' is-active' : '')}>
                <span>{c.step}</span>
              </div>
            ))}
          </div>
          <div className="story-copy">
            {chapters.map((c, i) => (
              <article key={c.step} className={'story-chapter' + (i === active ? ' is-active' : '')}>
                <em>CHAPTER {c.step}</em>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </article>
            ))}
          </div>
          <div className="story-progress">
            <i style={{ transform: 'scaleX(' + (active + 1) / 3 + ')' }} />
          </div>
        </div>
      </div>
    </div>
  )
}`,
      css: `.story-scroll {
  height: 440px;
  overflow-y: auto;
  border-radius: 20px;
  background: #0c0d13;
}

.story-track { height: 300%; }
.story-sticky {
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 32px;
  height: 440px;
  padding: 40px;
  align-items: center;
}

.story-visual {
  position: relative;
  height: 280px;
  border-radius: 20px;
  overflow: hidden;
  background: radial-gradient(circle at 30% 30%, ${str(p.accent)}44, #12131a 70%);
}

.story-layer {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 120px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.08);
  opacity: 0;
  transform: scale(0.92);
  transition: opacity ${num(p.smooth)}ms ease, transform ${num(p.smooth)}ms ease;
}
.story-layer.is-active { opacity: 1; transform: scale(1); }

.story-chapter {
  position: absolute;
  inset: 0;
  align-self: center;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity ${num(p.smooth)}ms ease, transform ${num(p.smooth)}ms ease;
  pointer-events: none;
}
.story-chapter.is-active { opacity: 1; transform: none; }

.story-progress {
  position: absolute;
  left: 40px;
  right: 40px;
  bottom: 24px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
}
.story-progress i {
  display: block;
  height: 100%;
  background: ${str(p.accent)};
  transform-origin: left;
  transition: transform ${num(p.smooth)}ms ease;
}`,
    }),
  },

  /* ---------------------------------------------------------------- 06 */
  {
    id: 'tilt3d',
    index: 6,
    name: '3D 倾斜',
    en: '3D Tilt',
    tagline: '卡片跟着鼠标轻微转动，屏幕里有了纵深',
    description:
      '根据指针在卡片内的相对位置，映射为 rotateX / rotateY 角度，再叠加随位置移动的高光与轻微缩放，营造手持卡片般的空间感。角度越小越高级，越大越接近玩具。',
    category: 'pointer',
    tags: ['3D', '透视', '卡片'],
    useCases: ['产品展示', '会员卡', '游戏卡片', '作品集'],
    keywords: ['3D', '倾斜', '鼠标', '旋转', '空间', '卡片', '立体', '透视', '高级', '悬浮', '跟随'],
    tip: '最大角度建议 6–12°。离开时把角度缓动回 0，并给 transform 加 will-change，避免抖动。',
    params: [
      { key: 'max', label: '最大角度', type: 'range', default: 10, min: 2, max: 22, step: 1, unit: '°' },
      { key: 'perspective', label: '透视距离', type: 'range', default: 1000, min: 600, max: 1800, step: 50, unit: 'px' },
      { key: 'scale', label: '悬停缩放', type: 'range', default: 1.02, min: 1, max: 1.1, step: 0.01 },
      { key: 'glare', label: '高光强度', type: 'range', default: 0.45, min: 0, max: 1, step: 0.05 },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef } from 'react'
import './Tilt3D.css'

export function TiltCard() {
  const card = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current!
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * ${num(p.max) * 2}
    const ry = (px - 0.5) * ${num(p.max) * 2}
    el.style.transform =
      'perspective(${num(p.perspective)}px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(${num(p.scale)})'
    el.style.setProperty('--gx', px * 100 + '%')
    el.style.setProperty('--gy', py * 100 + '%')
  }

  const reset = () => {
    const el = card.current!
    el.style.transform = 'perspective(${num(p.perspective)}px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <div className="tilt-stage">
      <div ref={card} className="tilt-card" onPointerMove={onMove} onPointerLeave={reset}>
        <div className="tilt-glare" />
        <span className="tilt-chip">MEMBER · 04</span>
        <h3>ORBIT</h3>
        <p>把鼠标放到卡片上，观察轻微的空间旋转。</p>
      </div>
    </div>
  )
}`,
      css: `.tilt-stage {
  display: grid;
  place-items: center;
  perspective: ${num(p.perspective)}px;
}

.tilt-card {
  --gx: 50%;
  --gy: 50%;
  position: relative;
  width: 340px;
  height: 220px;
  padding: 26px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(140deg, #241a45, #0e1017 60%);
  color: #f4f4f8;
  transform-style: preserve-3d;
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.tilt-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    260px circle at var(--gx) var(--gy),
    rgba(255, 255, 255, ${num(p.glare) * 0.18}),
    transparent 65%
  );
  pointer-events: none;
}

.tilt-card h3 {
  margin: 60px 0 6px;
  font-size: 34px;
  letter-spacing: 0.08em;
  transform: translateZ(30px);
}`,
    }),
  },

  /* ---------------------------------------------------------------- 07 */
  {
    id: 'textDecode',
    index: 7,
    name: '文字解码',
    en: 'Text Decode',
    tagline: '乱码跳动后还原真身，科技感即刻拉满',
    description:
      '把目标文本逐位替换为随机字符，再按从左到右的顺序逐步「解密」回真实内容。用 requestAnimationFrame 控制节奏，可以让一排标题拥有终端解码般的观感。',
    category: 'text',
    tags: ['乱码', '科技感', '标题'],
    useCases: ['科技产品标题', 'AI 助手开场', '黑客风界面', '加载文案'],
    keywords: ['文字', '解码', '乱码', '随机', '科技', '标题', '黑客', '终端', '还原', '字符', '加密', '数字'],
    tip: '整个过程控制在 1–2 秒内。适合短的标题或标签，长段落会让可读性急剧下降。',
    params: [
      { key: 'text', label: '解码文本', type: 'text', default: '构建下一代交互体验' },
      { key: 'duration', label: '解码时长', type: 'range', default: 1500, min: 600, max: 2800, step: 100, unit: 'ms' },
      {
        key: 'charset',
        label: '乱码字符集',
        type: 'select',
        default: 'tech',
        options: [
          { label: '科技符号', value: 'tech' },
          { label: '字母数字', value: 'alnum' },
          { label: '二进制', value: 'binary' },
          { label: '片假名', value: 'kana' },
        ],
      },
      {
        key: 'trigger',
        label: '触发方式',
        type: 'select',
        default: 'auto',
        options: [
          { label: '自动播放', value: 'auto' },
          { label: '悬停触发', value: 'hover' },
        ],
      },
    ],
    code: (p: Params) => {
      const charset =
        str(p.charset) === 'binary'
          ? '01'
          : str(p.charset) === 'alnum'
            ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            : str(p.charset) === 'kana'
              ? 'アイウエオカキクケコサシスセソタチツテト'
              : '!<>-_\\\\/[]{}—=+*^?#$%&'
      return {
        tsx: `import { useEffect, useState } from 'react'

const CHARS = '${charset}'

function useDecode(text: string, duration = ${num(p.duration)}) {
  const [out, setOut] = useState(text)

  useEffect(() => {
    let frame = 0
    let raf = 0
    const total = Math.ceil(duration / 16)

    const tick = () => {
      frame++
      const progress = Math.min(1, frame / total)
      const resolved = Math.floor(progress * text.length)

      setOut(
        text
          .split('')
          .map((ch, i) => {
            if (i < resolved || ch === ' ') return ch
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )

      if (progress < 1) raf = requestAnimationFrame(tick)
      else setOut(text)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, duration])

  return out
}

export function DecodeTitle() {
  const value = useDecode('${str(p.text)}')
  return <h1 className="decode-title">{value}</h1>
}`,
        css: `.decode-title {
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 700;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(90deg, #fff, #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}`,
      }
    },
  },

  /* ---------------------------------------------------------------- 08 */
  {
    id: 'shimmer',
    index: 8,
    name: '流光扫过',
    en: 'Shimmer',
    tagline: '一道高光扫过，告诉用户「正在处理」',
    description:
      '一条倾斜的半透明高光在元素上循环掠过，配合底色渐变，构成最轻量的加载与占位反馈。也可用于按钮、徽章等需要周期性提示的元素。',
    category: 'data',
    tags: ['加载', '骨架屏', '高光'],
    useCases: ['骨架屏', 'AI 生成中', '按钮加载', '会员徽章'],
    keywords: ['流光', '扫过', '高光', '加载', '骨架屏', 'loading', '占位', '提示', '扫光', '等待', '生成中'],
    tip: '扫光速度 1.2–2s 最舒适。骨架屏必须保留真实布局尺寸，否则内容出现时会跳动。',
    params: [
      { key: 'duration', label: '扫光周期', type: 'range', default: 1.8, min: 0.6, max: 3, step: 0.1, unit: 's' },
      { key: 'angle', label: '高光角度', type: 'range', default: 105, min: 0, max: 160, step: 5, unit: '°' },
      { key: 'width', label: '高光宽度', type: 'range', default: 32, min: 10, max: 80, step: 5, unit: '%' },
      { key: 'color', label: '高光颜色', type: 'color', default: '#ffffff' },
      { key: 'loop', label: '循环播放', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import './Shimmer.css'

export function ShimmerSkeleton() {
  return (
    <div className="shimmer-card">
      <div className="shimmer-row">
        <div className="shimmer-avatar shimmer" />
        <div className="shimmer-lines">
          <div className="shimmer-line shimmer" style={{ width: '54%' }} />
          <div className="shimmer-line shimmer" style={{ width: '32%' }} />
        </div>
      </div>
      <div className="shimmer-block shimmer" />
      <div className="shimmer-line shimmer" style={{ width: '86%' }} />
      <div className="shimmer-line shimmer" style={{ width: '68%' }} />
      <div className="shimmer-actions">
        <span className="shimmer-pill shimmer">正在生成内容…</span>
      </div>
    </div>
  )
}`,
      css: `.shimmer {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    ${num(p.angle)}deg,
    transparent 30%,
    ${str(p.color)}2e 50%,
    transparent 70%
  );
  background-size: ${num(p.width) * 3}% 100%;
  animation: shimmer-slide ${num(p.duration)}s ease-in-out infinite;
}

@keyframes shimmer-slide {
  from { background-position: -150% 0; }
  to { background-position: 250% 0; }
}

.shimmer-card {
  width: 380px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #11121a;
}

.shimmer-row { display: flex; gap: 14px; align-items: center; }
.shimmer-avatar { width: 48px; height: 48px; border-radius: 50%; }
.shimmer-lines { flex: 1; display: grid; gap: 8px; }
.shimmer-line { height: 10px; border-radius: 6px; }
.shimmer-block { height: 120px; border-radius: 14px; margin: 20px 0 16px; }
.shimmer-pill {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}`,
    }),
  },

  /* ---------------------------------------------------------------- 09 */
  {
    id: 'parallax',
    index: 9,
    name: '视差滚动',
    en: 'Parallax',
    tagline: '前后景不同速滚动，一层屏幕装下山河',
    description:
      '监听滚动进度，把不同层级的元素乘以不同系数平移：近景快、远景慢，形成真实的纵深错觉。这里用纯 CSS 图层与滚动变量实现，无需任何动画库。',
    category: 'scroll',
    tags: ['视差', '景深', '场景'],
    useCases: ['品牌故事', '旅行专题', '游戏官网', '年度总结'],
    keywords: ['视差', '滚动', '前后景', '景深', '层次', '山水', '空间', '官网', '场景', '风景', '纵深'],
    tip: '位移系数控制在 0.1–0.6。层数越多性能压力越大，移动端建议降低模糊与层数。',
    params: [
      { key: 'strength', label: '视差强度', type: 'range', default: 0.55, min: 0, max: 1, step: 0.05 },
      { key: 'mouse', label: '鼠标微动', type: 'switch', default: true },
      { key: 'atmosphere', label: '氛围光雾', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef } from 'react'
import './Parallax.css'

export function ParallaxScene() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight)
      el.style.setProperty('--p', String(p))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="parallax-scroll">
      <div className="parallax-scene">
        <div className="layer sky" />
        <div className="layer sun" />
        <div className="layer stars" />
        <div className="layer mountain back" />
        <div className="layer mountain mid" />
        <div className="layer mountain front" />
        <div className="layer content">
          <p>INTO THE WILD</p>
          <h2>去山的那一边</h2>
        </div>
      </div>
    </div>
  )
}`,
      css: `.parallax-scroll {
  --p: 0;
  height: 420px;
  overflow-y: auto;
  border-radius: 20px;
  background: #0a0d18;
}

.parallax-scene {
  position: relative;
  height: 160%;
  overflow: hidden;
}

.layer { position: absolute; inset: -10% 0; }

.sky {
  background: linear-gradient(180deg, #090b16, #1a2140 55%, #3b2a54);
}

.sun {
  background: radial-gradient(circle at 50% 42%, #f8b48c 0 8%, #f8b48c33 12%, transparent 34%);
  filter: blur(2px);
  transform: translateY(calc(var(--p) * -30px));
}

.mountain {
  bottom: 0;
  top: auto;
  height: 60%;
  background-repeat: no-repeat;
}

.mountain.back {
  background: linear-gradient(180deg, #2b3158, #141a2e);
  clip-path: polygon(0 78%, 18% 48%, 34% 62%, 52% 30%, 68% 58%, 84% 42%, 100% 70%, 100% 100%, 0 100%);
  transform: translateY(calc(var(--p) * ${-num(p.strength) * 40}px));
}

.mountain.mid {
  background: linear-gradient(180deg, #1e2748, #0d1220);
  clip-path: polygon(0 86%, 22% 62%, 40% 74%, 60% 48%, 80% 68%, 100% 58%, 100% 100%, 0 100%);
  transform: translateY(calc(var(--p) * ${-num(p.strength) * 90}px));
}

.mountain.front {
  background: linear-gradient(180deg, #141a30, #070a12);
  clip-path: polygon(0 92%, 24% 76%, 46% 86%, 66% 68%, 86% 80%, 100% 72%, 100% 100%, 0 100%);
  transform: translateY(calc(var(--p) * ${-num(p.strength) * 150}px));
}

.content {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  color: #fff;
  text-align: center;
  transform: translateY(calc(var(--p) * -80px));
}`,
    }),
  },

  /* ---------------------------------------------------------------- 10 */
  {
    id: 'countUp',
    index: 10,
    name: '数字递增',
    en: 'Count Up',
    tagline: '数字滚到目标值，数据瞬间有了重量',
    description:
      '用 requestAnimationFrame 推进进度，再通过缓动函数插值到目标数字，支持小数位、前后缀与自定义时长。进入视口或点击重播时触发，比静态数字更有说服力。',
    category: 'data',
    tags: ['数字', '数据', '计数'],
    useCases: ['数据看板', '融资公告', '成绩单', '倒计时'],
    keywords: ['数字', '递增', '滚动', '数据', '计数', '目标', '倒计时', '看板', '统计', '百分比', '营收'],
    tip: '时长 1–1.8s 足够。金额与比例保留合理小数位，动画过程中也要避免数字宽度跳动，可使用等宽数字。',
    params: [
      { key: 'target', label: '目标数值', type: 'number', default: 128.6, min: 0, max: 99999, step: 1 },
      { key: 'duration', label: '动画时长', type: 'range', default: 1600, min: 600, max: 3000, step: 100, unit: 'ms' },
      { key: 'decimals', label: '小数位数', type: 'range', default: 1, min: 0, max: 2, step: 1 },
      { key: 'prefix', label: '前缀', type: 'text', default: '¥' },
      { key: 'suffix', label: '后缀', type: 'text', default: '万' },
      {
        key: 'easing',
        label: '缓动曲线',
        type: 'select',
        default: 'expo',
        options: [
          { label: '丝滑收尾', value: 'expo' },
          { label: '回弹感', value: 'back' },
          { label: '标准减速', value: 'ease-out' },
          { label: '匀速', value: 'linear' },
        ],
      },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef, useState } from 'react'
import { cubicBezier } from './easing'

const ease = cubicBezier(${str(p.easing) === 'expo' ? '0.16, 1, 0.3, 1' : str(p.easing) === 'back' ? '0.34, 1.56, 0.64, 1' : str(p.easing) === 'linear' ? '0, 0, 1, 1' : '0, 0, 0.58, 1'})

export function CountUp({ to = ${num(p.target)}, duration = ${num(p.duration)} }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(to * ease(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        raf = requestAnimationFrame(tick)
        io.disconnect()
      }
    })
    io.observe(ref.current!)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to, duration])

  return (
    <span ref={ref} className="count">
      ${str(p.prefix)}{value.toFixed(${num(p.decimals)})}${str(p.suffix)}
    </span>
  )
}`,
      css: `.count {
  font-size: 64px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(120deg, #fff 20%, #60a5fa 70%, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}`,
    }),
  },

  /* ---------------------------------------------------------------- 11 */
  {
    id: 'hoverLift',
    index: 11,
    name: '悬停上浮',
    en: 'Hover Lift',
    tagline: '悬停时轻轻抬起，暗示这里可以点',
    description:
      '通过 transform 位移、缩放和扩散阴影，让卡片在悬停时离开页面平面。成本极低，却是提升可点击感最有效的基础手法。',
    category: 'pointer',
    tags: ['悬停', '阴影', '卡片'],
    useCases: ['文章列表', '商品卡', '导航卡', '仪表盘入口'],
    keywords: ['悬停', '上浮', '卡片', '抬起', '点击', '可点击', 'hover', '阴影', '列表', '浮起', '交互'],
    tip: '抬起 4–10px 即可。阴影方向要与页面光源一致，避免出现「贴纸浮在半空」的违和感。',
    params: [
      { key: 'lift', label: '抬起高度', type: 'range', default: 8, min: 2, max: 24, step: 1, unit: 'px' },
      { key: 'scale', label: '悬停缩放', type: 'range', default: 1.02, min: 1, max: 1.08, step: 0.01 },
      { key: 'shadow', label: '阴影浓度', type: 'range', default: 0.5, min: 0, max: 1, step: 0.05 },
      { key: 'duration', label: '过渡时长', type: 'range', default: 280, min: 120, max: 600, step: 20, unit: 'ms' },
    ],
    code: (p: Params) => ({
      tsx: `import './HoverLift.css'

const cards = [
  { icon: '◈', title: '组件规范', desc: '统一的间距、圆角与色彩变量。' },
  { icon: '◐', title: '交互模式', desc: '把动效参数沉淀为可复用的行为。' },
  { icon: '◍', title: '交付流程', desc: '设计稿到代码，保持一致的节奏。' },
]

export function HoverLiftCards() {
  return (
    <div className="lift-grid">
      {cards.map((c) => (
        <a key={c.title} href="#" className="lift-card">
          <span className="lift-icon">{c.icon}</span>
          <h3>{c.title}</h3>
          <p>{c.desc}</p>
          <em>查看详情 →</em>
        </a>
      ))}
    </div>
  )
}`,
      css: `.lift-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.lift-card {
  position: relative;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 18px;
  background: #12131a;
  color: inherit;
  text-decoration: none;
  transition:
    transform ${num(p.duration)}ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow ${num(p.duration)}ms ease,
    border-color ${num(p.duration)}ms ease;
  will-change: transform;
}

.lift-card:hover,
.lift-card:focus-visible {
  transform: translateY(-${num(p.lift)}px) scale(${num(p.scale)});
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow:
    0 ${Math.round(num(p.lift) * 2.4)}px ${Math.round(num(p.lift) * 5)}px
    rgba(0, 0, 0, ${num(p.shadow) * 0.55});
  outline: none;
}

.lift-card em {
  display: inline-block;
  margin-top: 18px;
  font-style: normal;
  font-size: 13px;
  color: #60a5fa;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 240ms ease, transform 240ms ease;
}

.lift-card:hover em { opacity: 1; transform: none; }`,
    }),
  },

  /* ---------------------------------------------------------------- 12 */
  {
    id: 'typewriter',
    index: 12,
    name: '打字机效果',
    en: 'Typewriter',
    tagline: '文字逐字敲出，像有人在屏幕那头说话',
    description:
      '按节奏逐个追加字符，配合闪烁光标与可选的循环删除。适合短标题、对话界面和终端风格演示，能显著放慢用户的阅读速度。',
    category: 'text',
    tags: ['逐字', '光标', '对话'],
    useCases: ['首页大标题', 'AI 对话', '终端演示', '个人签名'],
    keywords: ['打字', '打字机', '文字', '逐个', '光标', '对话', '终端', '标题', '循环', '输入', '逐字'],
    tip: '每字 40–80ms。中文长句建议关闭循环，反复删除会让用户产生焦躁感。',
    params: [
      { key: 'text', label: '键入文本', type: 'text', default: '你好，我是 MotionKit。\n让界面动起来。' },
      { key: 'speed', label: '每字间隔', type: 'range', default: 60, min: 20, max: 160, step: 5, unit: 'ms' },
      { key: 'loop', label: '循环播放', type: 'switch', default: true },
      { key: 'cursor', label: '显示光标', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useState } from 'react'
import './Typewriter.css'

export function Typewriter({ text = '${str(p.text).replace(/\n/g, '\\n')}' }) {
  const [count, setCount] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const full = text.length
    const delay = deleting ? 28 : ${num(p.speed)}

    const timer = setTimeout(() => {
      if (!deleting && count < full) setCount(count + 1)
      else if (!deleting && count === full) setDeleting(true)
      else if (deleting && count > 0) setCount(count - 1)
      else setDeleting(false)
    }, count === full ? 1800 : delay)

    return () => clearTimeout(timer)
  }, [count, deleting, text])

  return (
    <p className="typewriter">
      {text.slice(0, count)}
      <span className="typewriter__caret" />
    </p>
  )
}`,
      css: `.typewriter {
  font-size: 28px;
  line-height: 1.7;
  white-space: pre-line;
  color: #f4f4f8;
}

.typewriter__caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 4px;
  vertical-align: -0.15em;
  background: #60a5fa;
  animation: caret-blink 900ms steps(2, start) infinite;
}

@keyframes caret-blink {
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .typewriter__caret { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 13 */
  {
    id: 'stagger',
    index: 13,
    name: '错峰动画',
    en: 'Stagger',
    tagline: '元素错峰入场，页面自然有了层次',
    description:
      '给同一组元素设置递增的延迟，让它们依次而不是同时出现。可以配合位移、透明度与模糊，是最容易复用的编排技巧。',
    category: 'base',
    tags: ['顺序', '入场', '编排'],
    useCases: ['导航菜单', '列表加载', '图标宫格', '定价对比'],
    keywords: ['错峰', '依次', '入场', '顺序', '延迟', '列表', '层次', '编排', '菜单', '逐个', '批量'],
    tip: '间隔 40–120ms。元素超过 10 个时改用分批入场，避免最后几个出现得太晚。',
    params: [
      { key: 'stagger', label: '间隔时间', type: 'range', default: 90, min: 20, max: 320, step: 10, unit: 'ms' },
      { key: 'duration', label: '单项时长', type: 'range', default: 500, min: 200, max: 900, step: 20, unit: 'ms' },
      { key: 'distance', label: '位移距离', type: 'range', default: 18, min: 4, max: 60, step: 2, unit: 'px' },
      {
        key: 'direction',
        label: '入场方向',
        type: 'select',
        default: 'up',
        options: [
          { label: '自下而上', value: 'up' },
          { label: '自左而右', value: 'left' },
          { label: '原地放大', value: 'scale' },
        ],
      },
    ],
    code: (p: Params) => {
      const dir = str(p.direction, 'up')
      const from =
        dir === 'left' ? `translateX(-${num(p.distance)}px)` : dir === 'scale' ? 'scale(0.86)' : `translateY(${num(p.distance)}px)`
      return {
        tsx: `import { useEffect, useState } from 'react'
import './Stagger.css'

const items = [
  { icon: '◆', name: '设计语言' },
  { icon: '◇', name: '组件资产' },
  { icon: '◈', name: '动效规范' },
  { icon: '◉', name: '交付流水线' },
]

export function StaggerList() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <ul className={'stagger-list' + (show ? ' is-in' : '')}>
      {items.map((item, i) => (
        <li
          key={item.name}
          className="stagger-item"
          style={{ transitionDelay: i * ${num(p.stagger)} + 'ms' }}
        >
          <span>{item.icon}</span>
          {item.name}
          <em>0{i + 1}</em>
        </li>
      ))}
    </ul>
  )
}`,
        css: `.stagger-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-radius: 14px;
  background: #12131a;
  border: 1px solid rgba(255, 255, 255, 0.07);
  opacity: 0;
  transform: ${from};
  transition:
    opacity ${num(p.duration)}ms ease,
    transform ${num(p.duration)}ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.stagger-list.is-in .stagger-item {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .stagger-item { opacity: 1; transform: none; transition: none; }
}`,
      }
    },
  },

  /* ---------------------------------------------------------------- 14 */
  {
    id: 'marquee',
    index: 14,
    name: '跑马灯',
    en: 'Marquee',
    tagline: '内容水平循环，悬停即停不打断阅读',
    description:
      '复制一份内容并让轨道匀速平移，首尾无缝衔接；悬停时暂停，让用户可以停下来阅读。常用于公告、品牌墙和标签流。',
    category: 'data',
    tags: ['循环', '水平滚动', '悬停暂停'],
    useCases: ['公告条', '客户 Logo 墙', '技能标签', '活动信息'],
    keywords: ['跑马灯', '循环', '水平', '滚动', '悬停暂停', '公告', 'logo', '标签', '无缝', '走马灯', '横向'],
    tip: '复制的内容必须完全一致且无额外间距，首尾才能无缝衔接。副本用 aria-hidden 隐藏，键盘聚焦时也要暂停。',
    params: [
      { key: 'speed', label: '滚动周期', type: 'range', default: 24, min: 8, max: 60, step: 1, unit: 's' },
      { key: 'gap', label: '元素间距', type: 'range', default: 20, min: 8, max: 48, step: 2, unit: 'px' },
      {
        key: 'direction',
        label: '滚动方向',
        type: 'select',
        default: 'left',
        options: [
          { label: '向左', value: 'left' },
          { label: '向右', value: 'right' },
        ],
      },
      { key: 'pause', label: '悬停暂停', type: 'switch', default: true },
      { key: 'fade', label: '两侧渐隐', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import './Marquee.css'

const clients = ['Northwind', 'Acme Corp', 'Lumen', 'Vertex', 'Monolith', 'Aperture', 'Helios']

export function LogoMarquee() {
  return (
    <div className="marquee">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group" aria-hidden={copy === 1}>
            {clients.map((name) => (
              <li key={name} className="marquee__item">
                <span className="marquee__mark">◇</span>
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}`,
      css: `.marquee {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 18px 0;
  ${bool(p.fade) ? `mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);` : ''}
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee ${num(p.speed)}s linear infinite;
  ${str(p.direction) === 'right' ? 'animation-direction: reverse;' : ''}
}

${bool(p.pause) ? '.marquee:hover .marquee__track { animation-play-state: paused; }' : ''}

.marquee__group {
  display: flex;
  align-items: center;
  gap: ${num(p.gap)}px;
  padding-right: ${num(p.gap)}px;
  margin: 0;
  list-style: none;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cdd3de;
  white-space: nowrap;
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 15 */
  {
    id: 'spring',
    index: 15,
    name: '弹性动画',
    en: 'Spring',
    tagline: '到位后轻轻回弹，让动效拥有物理感',
    description:
      '用刚度、阻尼、质量三个参数驱动的弹簧模型替代固定时长动画：它会自然加速、越过目标、再收敛回来。拖动小球或点击施力，感受参数变化带来的手感差异。',
    category: 'base',
    tags: ['弹簧', '回弹', '物理'],
    useCases: ['拖拽交互', '开关切换', '弹窗入场', '游戏化界面'],
    keywords: ['弹性', '弹簧', '回弹', '物理', '阻尼', '刚度', '拖拽', '抖动', 'Q弹', '自然', '惯性'],
    tip: '阻尼比 0.6–0.9 最接近真实手感。追求活泼可以降低阻尼，但别让界面长时间抖动。',
    params: [
      { key: 'stiffness', label: '刚度', type: 'range', default: 170, min: 40, max: 400, step: 5 },
      { key: 'damping', label: '阻尼', type: 'range', default: 14, min: 4, max: 40, step: 1 },
      { key: 'mass', label: '质量', type: 'range', default: 1, min: 0.5, max: 4, step: 0.1 },
      { key: 'trail', label: '拖尾残影', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef } from 'react'
import './Spring.css'

export function SpringBall() {
  const ball = useRef<HTMLDivElement>(null)
  const state = useRef({ x: -160, v: 0, target: 0 })

  useEffect(() => {
    const stiffness = ${num(p.stiffness)}
    const damping = ${num(p.damping)}
    const mass = ${num(p.mass)}
    let raf = 0
    let last = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(32, now - last) / 1000
      last = now
      const s = state.current
      // 胡克定律 + 阻尼
      const force = (s.target - s.x) * stiffness - s.v * damping
      s.v += (force / mass) * dt
      s.x += s.v * dt
      ball.current!.style.transform = 'translateX(' + s.x + 'px)'
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const kick = () => { state.current.v += 600 }

  return (
    <div className="spring-stage" onClick={kick}>
      <div className="spring-rail" />
      <div ref={ball} className="spring-ball" />
      <p>点击任意位置推它一把</p>
    </div>
  )
}`,
      css: `.spring-stage {
  position: relative;
  display: grid;
  place-items: center;
  height: 300px;
  border-radius: 20px;
  background: radial-gradient(circle at 50% 40%, #1b1733, #0b0c12 70%);
  overflow: hidden;
  cursor: pointer;
}

.spring-rail {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.spring-ball {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #93c5fd, #3b82f6 55%, #1e3a8a);
  box-shadow: 0 20px 40px -12px #3b82f688;
  will-change: transform;
}`,
    }),
  },

  /* ---------------------------------------------------------------- 16 */
  {
    id: 'easing',
    index: 16,
    name: '缓动效果',
    en: 'Easing',
    tagline: '决定动画是否自然的那条曲线',
    description:
      '用三次贝塞尔曲线描述速度变化：控制点越陡，起步越快；y 轴越过 1 会产生回弹。拖动控制点或选择预设，观察同一个位移在不同曲线下的性格差异。',
    category: 'base',
    tags: ['贝塞尔', '速度', '过渡'],
    useCases: ['所有过渡动画', '弹窗', '页面切换', '手势反馈'],
    keywords: ['缓动', '曲线', '速度', '贝塞尔', '自然', '过渡', '动画', '时间', '节奏', 'ease', '回弹'],
    tip: '入场用 ease-out，离场用 ease-in，双向过渡用 ease-in-out。高频操作别用超过 300ms 的动画。',
    params: [
      {
        key: 'preset',
        label: '缓动预设',
        type: 'select',
        default: 'expo',
        options: [
          { label: 'ease-out-expo', value: 'expo' },
          { label: 'ease-out', value: 'ease-out' },
          { label: 'ease-in-out', value: 'ease-in-out' },
          { label: 'ease-out-back', value: 'back' },
          { label: 'smooth', value: 'smooth' },
          { label: 'snap', value: 'snap' },
          { label: 'linear', value: 'linear' },
          { label: '自定义', value: 'custom' },
        ],
      },
      { key: 'duration', label: '动画时长', type: 'range', default: 900, min: 300, max: 1600, step: 50, unit: 'ms' },
      { key: 'x1', label: '控制点 1 · x', type: 'range', default: 0.16, min: 0, max: 1, step: 0.01 },
      { key: 'y1', label: '控制点 1 · y', type: 'range', default: 1, min: -0.5, max: 1.5, step: 0.01 },
      { key: 'x2', label: '控制点 2 · x', type: 'range', default: 0.3, min: 0, max: 1, step: 0.01 },
      { key: 'y2', label: '控制点 2 · y', type: 'range', default: 1, min: -0.5, max: 1.5, step: 0.01 },
    ],
    code: (p: Params) => ({
      tsx: `import './Easing.css'

export function EasingPanel() {
  return (
    <div className="easing-demo">
      <div className="easing-track">
        {/* 用 cubic-bezier 定义速度曲线 */}
        <div className="easing-dot" />
      </div>
      <p>cubic-bezier(${num(p.x1)}, ${num(p.y1)}, ${num(p.x2)}, ${num(p.y2)})</p>
    </div>
  )
}`,
      css: `.easing-track {
  position: relative;
  width: 320px;
  height: 64px;
  border-radius: 14px;
  background: #12131a;
}

.easing-dot {
  position: absolute;
  top: 18px;
  left: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #3b82f6;
  animation: ease-run ${num(p.duration)}ms cubic-bezier(${num(p.x1)}, ${num(p.y1)}, ${num(p.x2)}, ${num(p.y2)}) infinite alternate;
}

@keyframes ease-run {
  to { transform: translateX(268px); }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 17 */
  {
    id: 'modalDialog',
    index: 17,
    name: '模态弹窗',
    en: 'Modal Dialog',
    tagline: '先处理再继续，把注意力收拢到一个确认点上',
    description:
      '模态对话框用遮罩切断背景交互，把用户的选择收敛到标题、说明与操作按钮上。入场时从略微缩小的状态放大并淡入，危险操作再配合红色主按钮，既明确又不喧宾夺主。适合删除确认、登录授权等需要用户明确表态的场景。',
    category: 'overlay',
    tags: ['模态', '确认', '遮罩'],
    useCases: ['删除确认', '登录注册', '关键授权', '支付确认'],
    keywords: ['弹窗', '模态', 'modal', 'dialog', '确认', '对话框', '遮罩', '删除', '警告', '提示框', '确定', '取消'],
    tip: '一个流程里只出现一个模态框，主操作放在右侧。遮罩点击是否关闭要看后果：危险操作建议不关闭，避免误触。',
    params: [
      { key: 'backdrop', label: '模糊遮罩', type: 'switch', default: true },
      { key: 'scale', label: '起始缩放', type: 'range', default: 0.92, min: 0.8, max: 1.1, step: 0.01 },
      { key: 'duration', label: '入场时长', type: 'range', default: 420, min: 200, max: 800, step: 20, unit: 'ms' },
      { key: 'spring', label: '弹性回弹', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './ModalDialog.css'

export function ConfirmModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>删除项目</button>
${
  bool(p.backdrop)
    ? `      {open && <div className="modal-backdrop" onClick={() => setOpen(false)} />}\n`
    : ''
}      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h3 id="modal-title">删除这个项目？</h3>
          <p>删除后无法恢复，请确认后再继续。</p>
          <div className="modal__actions">
            <button type="button" onClick={() => setOpen(false)}>取消</button>
            <button type="button" className="modal__danger" onClick={() => setOpen(false)}>确认删除</button>
          </div>
        </div>
      )}
    </>
  )
}`,
      css: `/* 遮罩负责切断背景交互 */
${bool(p.backdrop) ? `.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8, 9, 14, 0.62);
  backdrop-filter: blur(10px);
  animation: fade-in ${num(p.duration)}ms ease both;
}
` : ''}.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  width: min(360px, calc(100vw - 32px));
  padding: 24px;
  border-radius: 18px;
  background: #151824;
  color: #f4f4f8;
  box-shadow: 0 30px 80px -24px rgba(0, 0, 0, 0.8);
  transform: translate(-50%, -50%);
  animation: modal-in ${num(p.duration)}ms ${
    bool(p.spring) ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  } both;
}

@keyframes modal-in {
  from { opacity: 0; transform: translate(-50%, -46%) scale(${num(p.scale)}); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.modal__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.modal__danger { background: #ef4444; color: #fff; }

@media (prefers-reduced-motion: reduce) {
  .modal, .modal-backdrop { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 18 */
  {
    id: 'toast',
    index: 18,
    name: '轻提示',
    en: 'Toast',
    tagline: '结果反馈自己出现又自己离开，不打断手上的事',
    description:
      'Toast 是非阻断的结果反馈：从屏幕顶部或底部滑入，停留几秒后自动消失，不需要用户点掉。用不同颜色区分成功、错误与信息，用进度条暗示剩余时间，悬停时可以暂停计时，让用户来得及读完。',
    category: 'overlay',
    tags: ['轻提示', '反馈', '自动消失'],
    useCases: ['保存成功', '复制反馈', '网络异常', '后台任务完成'],
    keywords: ['toast', '轻提示', '提示', '反馈', '消息', '自动消失', '保存成功', '复制成功', '报错', 'snackbar', '通知', '弹窗'],
    tip: '一条 Toast 只说一件事，默认 2.5～3.5 秒。重要且必须看到的信息不要用 Toast，改用通知或模态框。',
    params: [
      {
        key: 'position',
        label: '出现位置',
        type: 'select',
        default: 'top',
        options: [
          { label: '顶部', value: 'top' },
          { label: '底部', value: 'bottom' },
        ],
      },
      { key: 'duration', label: '停留时长', type: 'range', default: 2800, min: 1500, max: 5000, step: 100, unit: 'ms' },
      {
        key: 'variant',
        label: '视觉样式',
        type: 'select',
        default: 'glass',
        options: [
          { label: '毛玻璃', value: 'glass' },
          { label: '实色', value: 'solid' },
        ],
      },
      { key: 'pause', label: '悬停暂停', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef, useState } from 'react'
import './Toast.css'

type ToastItem = { id: number; text: string; tone: string }

export function ToastStack() {
  const [items, setItems] = useState<ToastItem[]>([])
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const push = (text: string, tone: string) => {
    setItems((prev) => [...prev.slice(-2), { id: Date.now(), text, tone }])
  }

  useEffect(() => {
    if (paused || !items.length) return
    timer.current = window.setTimeout(
      () => setItems((prev) => prev.slice(1)),
      ${num(p.duration)}
    )
    return () => window.clearTimeout(timer.current)
  }, [items, paused])

  return (
    <>
      <button type="button" onClick={() => push('保存成功', 'ok')}>保存</button>
      <button type="button" onClick={() => push('网络异常，请重试', 'error')}>同步</button>
      <div
        className="toast-stack ${str(p.position) === 'bottom' ? 'toast-stack--bottom' : 'toast-stack--top'}"
        onMouseEnter={() => ${bool(p.pause) ? 'setPaused(true)' : 'void 0'}}
        onMouseLeave={() => ${bool(p.pause) ? 'setPaused(false)' : 'void 0'}}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={'toast toast--' + item.tone + ' ${
              str(p.variant) === 'glass' ? 'toast--glass' : 'toast--solid'
            }' + (paused ? ' is-paused' : '')}
          >
            <span>{item.text}</span>
            <i className="toast__progress" />
          </div>
        ))}
      </div>
    </>
  )
}`,
      css: `.toast-stack {
  position: fixed;
  left: 50%;
  ${str(p.position) === 'bottom' ? 'bottom: 24px;' : 'top: 24px;'}
  display: grid;
  gap: 10px;
  z-index: 100;
  transform: translateX(-50%);
}

.toast {
  position: relative;
  min-width: 220px;
  padding: 12px 16px 16px;
  border-radius: 12px;
  color: #f4f4f8;
  overflow: hidden;
  animation: toast-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
${
  str(p.variant) === 'glass'
    ? `.toast--glass {
  background: rgba(28, 31, 44, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(18px) saturate(160%);
}`
    : `.toast--solid { background: #1c1f2c; border: 1px solid rgba(255, 255, 255, 0.08); }`
}
.toast--ok { border-left: 3px solid #34d399; }
.toast--error { border-left: 3px solid #f87171; }

.toast__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: currentColor;
  transform-origin: left;
  animation: toast-progress ${num(p.duration)}ms linear both;
}

.toast.is-paused .toast__progress { animation-play-state: paused; }

@keyframes toast-in {
  from { opacity: 0; transform: translateY(${str(p.position) === 'bottom' ? '16px' : '-16px'}) scale(0.96); }
  to { opacity: 1; transform: none; }
}
@keyframes toast-progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }

@media (prefers-reduced-motion: reduce) {
  .toast, .toast__progress { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 19 */
  {
    id: 'drawer',
    index: 19,
    name: '抽屉面板',
    en: 'Drawer',
    tagline: '从侧边滑出详情，原页面上下文还在眼前',
    description:
      '抽屉从屏幕左/右边缘滑入，用一块次级面板承载详情或筛选，而不像模态框那样完全遮住页面。它保留上下文，适合后台列表的查看详情、设置项编辑等「看完就关」的中等重量任务。',
    category: 'overlay',
    tags: ['抽屉', '侧滑', '详情'],
    useCases: ['订单详情', '筛选面板', '设置编辑', '任务面板'],
    keywords: ['抽屉', 'drawer', '侧边', '滑出', '详情', '面板', '筛选', '侧滑', '弹层', '弹窗', '查看'],
    tip: '宽度控制在 360–480px，内容超过一屏时让面板内部滚动。移动端改用底部面板更符合拇指操作。',
    params: [
      {
        key: 'side',
        label: '滑出方向',
        type: 'select',
        default: 'right',
        options: [
          { label: '从右侧', value: 'right' },
          { label: '从左侧', value: 'left' },
        ],
      },
      { key: 'width', label: '面板宽度', type: 'range', default: 420, min: 320, max: 560, step: 10, unit: 'px' },
      { key: 'backdrop', label: '背景遮罩', type: 'switch', default: true },
      { key: 'duration', label: '滑出时长', type: 'range', default: 420, min: 200, max: 700, step: 20, unit: 'ms' },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './Drawer.css'

export function DetailDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>查看详情</button>
      ${bool(p.backdrop) ? `{open && <div className="drawer-backdrop" onClick={() => setOpen(false)} />}\n      ` : ''}<aside
        className={'drawer drawer--${str(p.side)}' + (open ? ' is-open' : '')}
        aria-hidden={!open}
      >
        <header>
          <h3>订单详情</h3>
          <button type="button" onClick={() => setOpen(false)}>关闭</button>
        </header>
        <p>订单号 · MK-20261124</p>
        <p>状态 · 已完成</p>
      </aside>
    </>
  )
}`,
      css: `.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  ${str(p.side) === 'left' ? 'left: 0;' : 'right: 0;'}
  width: min(${num(p.width)}px, 92vw);
  padding: 24px;
  background: #151824;
  color: #f4f4f8;
  box-shadow: -20px 0 60px -30px rgba(0, 0, 0, 0.9);
  transform: translateX(${str(p.side) === 'left' ? '-100%' : '100%'});
  transition: transform ${num(p.duration)}ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 50;
}

.drawer.is-open { transform: translateX(0); }
${
  bool(p.backdrop)
    ? `.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(8, 9, 14, 0.55);
  backdrop-filter: blur(4px);
  z-index: 40;
}`
    : ''
}
@media (prefers-reduced-motion: reduce) {
  .drawer { transition: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 20 */
  {
    id: 'popover',
    index: 20,
    name: '气泡浮层',
    en: 'Popover',
    tagline: '贴着触发元素展开，比对话框轻、比文字提示重',
    description:
      '气泡浮层依附在按钮或头像附近出现，可承载补充说明与少量操作，不阻断全局操作。悬停触发、只显示文字的是 Tooltip；点击触发、带按钮和表单的才是 Popover。选对触发方式，浮层才不会挡住用户正在做的事。',
    category: 'overlay',
    tags: ['气泡', '浮层', '锚点'],
    useCases: ['头像菜单', '筛选面板', '图标说明', '快捷操作'],
    keywords: ['气泡', '浮层', 'popover', 'tooltip', '提示', '锚点', '悬停', '点击', '下拉', '菜单', '弹窗', '文字提示'],
    tip: '浮层要避开视口边缘，必要时自动翻转方向。Tooltip 只放一句说明，别在里面塞按钮。',
    params: [
      {
        key: 'trigger',
        label: '触发方式',
        type: 'select',
        default: 'click',
        options: [
          { label: '点击展开', value: 'click' },
          { label: '悬停展开', value: 'hover' },
        ],
      },
      {
        key: 'placement',
        label: '展开方向',
        type: 'select',
        default: 'bottom',
        options: [
          { label: '向下', value: 'bottom' },
          { label: '向上', value: 'top' },
        ],
      },
      { key: 'arrow', label: '显示箭头', type: 'switch', default: true },
      { key: 'width', label: '浮层宽度', type: 'range', default: 240, min: 200, max: 320, step: 10, unit: 'px' },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef, useState } from 'react'
import './Popover.css'

export function AvatarPopover() {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  return (
    <div
      ref={wrap}
      className="popover-wrap"
      ${str(p.trigger) === 'hover' ? `onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}` : `onClick={() => setOpen((v) => !v)}`}
    >
      <button type="button" aria-expanded={open}>我的账户</button>
      {open && (
        <div className="popover popover--${str(p.placement)}" role="dialog">
          <strong>林小满</strong>
          <p>产品设计师 · 已登录</p>
          <button type="button">编辑资料</button>
        </div>
      )}
    </div>
  )
}`,
      css: `.popover-wrap { position: relative; display: inline-block; }

.popover {
  position: absolute;
  ${str(p.placement) === 'top' ? 'bottom: calc(100% + 10px);' : 'top: calc(100% + 10px);'}
  left: 0;
  width: ${num(p.width)}px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #181b27;
  color: #f4f4f8;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.9);
  animation: popover-in 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
  z-index: 20;
}
${
  bool(p.arrow)
    ? `.popover::before {
  content: '';
  position: absolute;
  ${str(p.placement) === 'top' ? 'bottom: -6px;' : 'top: -6px;'}
  left: 24px;
  width: 12px;
  height: 12px;
  background: #181b27;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  transform: rotate(${str(p.placement) === 'top' ? '225deg' : '45deg'});
}`
    : ''
}
@keyframes popover-in {
  from { opacity: 0; transform: translateY(${str(p.placement) === 'top' ? '6px' : '-6px'}) scale(0.94); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .popover { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 21 */
  {
    id: 'bottomSheet',
    index: 21,
    name: '底部面板',
    en: 'Bottom Sheet',
    tagline: '从屏幕底部升起，把操作放到拇指够得到的地方',
    description:
      '底部面板是移动端的抽屉：从下往上滑出，承载筛选、分享、操作菜单等任务。顶部把手暗示它可以下拉关闭，高度可以停在半屏；与桌面端的侧边抽屉相比，它更符合单手操作的拇指热区。',
    category: 'overlay',
    tags: ['底部面板', '移动端', '手势'],
    useCases: ['筛选条件', '分享菜单', '操作选择', '移动端表单'],
    keywords: ['底部', '面板', 'bottom sheet', '抽屉', '手势', '下滑', '关闭', '移动端', '筛选', '弹窗', '半屏'],
    tip: '一定要提供明确的关闭方式（把手下滑、× 按钮或遮罩点击）。内容很多时先停靠半屏，再允许用户继续上拉。',
    params: [
      { key: 'height', label: '面板高度', type: 'range', default: 62, min: 40, max: 85, step: 1, unit: '%' },
      { key: 'backdrop', label: '背景遮罩', type: 'switch', default: true },
      { key: 'drag', label: '下滑关闭', type: 'switch', default: true },
      { key: 'radius', label: '顶部圆角', type: 'range', default: 22, min: 12, max: 32, step: 1, unit: 'px' },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef, useState } from 'react'
import './BottomSheet.css'

export function FilterSheet() {
  const [open, setOpen] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startY: 0, dy: 0 })

  const onDown = (e: React.PointerEvent) => {
    if (!${bool(p.drag)}) return
    drag.current = { active: true, startY: e.clientY, dy: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    drag.current.dy = Math.max(0, e.clientY - drag.current.startY)
    if (sheet.current) sheet.current.style.transform = 'translateY(' + drag.current.dy + 'px)'
  }
  const onUp = () => {
    if (!drag.current.active) return
    drag.current.active = false
    if (sheet.current) sheet.current.style.transform = ''
    if (drag.current.dy > 80) setOpen(false)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>筛选与排序</button>
      ${bool(p.backdrop) ? `{open && <div className="sheet-backdrop" onClick={() => setOpen(false)} />}\n      ` : ''}<div
        ref={sheet}
        className={'sheet' + (open ? ' is-open' : '')}
        style={{ height: '${num(p.height)}%' }}
      >
        <div className="sheet__grip" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} />
        <h3>筛选条件</h3>
        <p>价格区间 · 新品优先 · 包邮</p>
        <button type="button" onClick={() => setOpen(false)}>应用筛选</button>
      </div>
    </>
  )
}`,
      css: `.sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 24px 24px;
  border-radius: ${num(p.radius)}px ${num(p.radius)}px 0 0;
  background: #151824;
  color: #f4f4f8;
  transform: translateY(100%);
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 50;
}
.sheet.is-open { transform: translateY(0); }
.sheet__grip {
  width: 40px;
  height: 4px;
  margin: 0 auto 18px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.25);
  cursor: grab;
  touch-action: none;
}
${
  bool(p.backdrop)
    ? `.sheet-backdrop { position: fixed; inset: 0; background: rgba(8, 9, 14, 0.55); z-index: 40; }`
    : ''
}
@media (prefers-reduced-motion: reduce) {
  .sheet { transition: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 22 */
  {
    id: 'notification',
    index: 22,
    name: '通知卡片',
    en: 'Notification',
    tagline: '比 Toast 更完整，把需要稍后处理的消息留给你',
    description:
      '通知从角落滑入，可以带标题、正文和操作入口，比只反馈结果的 Toast 更重，又比阻断操作的模态框更轻。多条通知自动堆叠、到时移除，进度条会把剩余时间明确地展示出来，适合后台任务完成、协作消息等场景。',
    category: 'overlay',
    tags: ['通知', '消息', '堆叠'],
    useCases: ['任务完成', '协作提醒', '系统公告', '异步结果'],
    keywords: ['通知', '消息', 'notification', '提醒', '卡片', '右上角', '进度条', '公告', '堆叠', '提示', '弹窗'],
    tip: '通知不要超过 3 条同屏，正文控制在两行内。需要用户立刻处理的消息请改用模态弹窗。',
    params: [
      {
        key: 'position',
        label: '出现位置',
        type: 'select',
        default: 'topRight',
        options: [
          { label: '右上角', value: 'topRight' },
          { label: '顶部居中', value: 'topCenter' },
        ],
      },
      { key: 'duration', label: '存活时间', type: 'range', default: 3600, min: 2000, max: 6000, step: 200, unit: 'ms' },
      { key: 'progress', label: '倒计时进度', type: 'switch', default: true },
      { key: 'accent', label: '强调色', type: 'color', default: '#3b82f6' },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef, useState } from 'react'
import './Notification.css'

type Notice = { id: number; title: string; body: string }

export function NoticeStack() {
  const [items, setItems] = useState<Notice[]>([])
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!items.length) return
    timer.current = window.setTimeout(
      () => setItems((prev) => prev.slice(1)),
      ${num(p.duration)}
    )
    return () => window.clearTimeout(timer.current)
  }, [items])

  const push = () => setItems((prev) => [
    ...prev.slice(-2),
    { id: Date.now(), title: '导出已完成', body: '报表已生成，可随时下载查看。' },
  ])

  return (
    <>
      <button type="button" onClick={push}>触发通知</button>
      <div className="notice-stack notice-stack--${str(p.position)}">
        {items.map((item) => (
          <article key={item.id} className="notice">
            <span className="notice__icon">✓</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
            <button type="button" onClick={() => setItems((v) => v.filter((n) => n.id !== item.id))}>×</button>
            ${bool(p.progress) ? '<i className="notice__progress" />' : ''}
          </article>
        ))}
      </div>
    </>
  )
}`,
      css: `.notice-stack {
  position: fixed;
  ${str(p.position) === 'topCenter' ? 'left: 50%; transform: translateX(-50%);' : 'right: 24px;'}
  top: 24px;
  display: grid;
  gap: 10px;
  width: 320px;
  z-index: 90;
}

.notice {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #181b27;
  color: #f4f4f8;
  box-shadow: 0 20px 50px -24px rgba(0, 0, 0, 0.9);
  overflow: hidden;
  animation: notice-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.notice__icon { color: ${str(p.accent)}; }
.notice p { margin: 4px 0 0; color: rgba(255, 255, 255, 0.58); font-size: 12px; }
${
  bool(p.progress)
    ? `.notice__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: ${str(p.accent)};
  transform-origin: left;
  animation: notice-progress ${num(p.duration)}ms linear both;
}`
    : ''
}
@keyframes notice-in {
  from { opacity: 0; transform: translateX(24px) scale(0.96); }
  to { opacity: 1; transform: none; }
}
@keyframes notice-progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }

@media (prefers-reduced-motion: reduce) {
  .notice, .notice__progress { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 23 */
  {
    id: 'liquidGlass',
    index: 23,
    name: '液态玻璃',
    en: 'Liquid Glass',
    tagline: '会折射光、会呼吸的玻璃，让界面拥有真实的材质感',
    description:
      '液态玻璃在毛玻璃的基础上叠加折射、焦散和镜面高光：底层色彩被扭出流动的光学形变，边缘出现细亮的轮廓光，指针位置的改变会让高光跟着移动。它是 Apple 系统界面里最具辨识度的材质语言，适合强调层级与焦点的核心卡片、导航栏和控件。',
    category: 'glass',
    tags: ['液态玻璃', '折射', '材质'],
    useCases: ['核心功能卡片', '悬浮导航', '播放器控件', '系统级弹层'],
    keywords: ['液态玻璃', '玻璃', '毛玻璃', 'glass', 'glassmorphism', '折射', '高光', '焦散', '苹果', 'ios', '材质', '半透明', '模糊', 'backdrop'],
    tip: '折射强度控制在 10–20 之间，过大会让文字难以阅读。真实设备 Safari 支持最佳，Chromium 需保留纯模糊降级路径。',
    params: [
      { key: 'blur', label: '背景模糊', type: 'range', default: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'saturation', label: '色彩饱和', type: 'range', default: 170, min: 100, max: 220, step: 5, unit: '%' },
      { key: 'refraction', label: '液态折射', type: 'range', default: 14, min: 0, max: 30, step: 1 },
      { key: 'tint', label: '玻璃染色', type: 'color', default: '#93c5fd' },
      { key: 'radius', label: '圆角', type: 'range', default: 26, min: 12, max: 40, step: 1, unit: 'px' },
      { key: 'glow', label: '边缘辉光', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef } from 'react'
import './LiquidGlass.css'

export function LiquidGlassCard() {
  const card = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = card.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', ((e.clientX - r.left) / r.width) * 100 + '%')
    el.style.setProperty('--gy', ((e.clientY - r.top) / r.height) * 100 + '%')
  }

  return (
    <>
      <svg width="0" height="0" aria-hidden="true">
        <filter id="lg-distort">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="8" />
          <feDisplacementMap in="SourceGraphic" scale="${num(p.refraction)}" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        ref={card}
        className="lg-card"
        onPointerMove={onMove}
        style={
          {
            '--glass-blur': '${num(p.blur)}px',
            '--glass-sat': '${num(p.saturation)}%',
            '--glass-radius': '${num(p.radius)}px',
            '--glass-tint': '${str(p.tint)}',
          } as React.CSSProperties
        }
      >
        <div className="lg-caustics" />
        <h3>光，有了形状</h3>
        <p>底层色彩经过折射与高光，形成有厚度的玻璃材质。</p>
      </div>
    </>
  )
}`,
      css: `.lg-card {
  --gx: 50%;
  --gy: 50%;
  position: relative;
  isolation: isolate;
  width: 420px;
  padding: 32px;
  border-radius: var(--glass-radius);
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: color-mix(in srgb, var(--glass-tint) 16%, transparent);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat)) brightness(1.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.45),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12),
    0 30px 70px -30px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  color: #fff;
}

/* 镜面高光跟随指针 */
.lg-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    220px circle at var(--gx) var(--gy),
    rgba(255, 255, 255, 0.34),
    transparent 65%
  );
  pointer-events: none;
  z-index: 2;
}

/* 焦散折射层：用 turbulence + displacement 扭出液态光纹 */
.lg-caustics {
  position: absolute;
  inset: -20%;
  z-index: -1;
  filter: url(#lg-distort);
  opacity: ${num(p.refraction) / 30};
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.5), transparent 30%),
    linear-gradient(120deg, transparent 30%, rgba(147, 197, 253, 0.65) 50%, transparent 70%);
}
${
  bool(p.glow)
    ? `.lg-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.85), transparent 45%, rgba(255, 255, 255, 0.35));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 3;
}`
    : ''
}
@media (prefers-reduced-motion: reduce) {
  .lg-card::after { display: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 24 */
  {
    id: 'paperPlane',
    index: 24,
    name: '纸飞机发送',
    en: 'Paper Plane Send',
    tagline: '按钮轻压，纸飞机飞出，发送状态在原位交代清楚',
    description:
      '分享类按钮不要只切换文字：按下时先给一个轻微压缩，纸飞机带着弧线从按钮里飞出，按钮进入「发送中」，落地后落定成「已分享」。动作有起点、有去向、有结果，用户的眼睛始终跟得上。',
    category: 'component',
    tags: ['发送反馈', '纸飞机', '状态切换'],
    useCases: ['分享行程', '发布内容', '发送消息', '提交表单'],
    keywords: ['纸飞机', '发送', '分享', '提交', '按钮', '状态', '发送中', '已分享', '行程', '飞出', '反馈', '提示词'],
    tip: '飞行时长控制在 600–800ms。发送结果必须回到原按钮上，不要只靠远处 Toast 交代。',
    params: [
      { key: 'pressScale', label: '按下缩放', type: 'range', default: 0.94, min: 0.88, max: 0.98, step: 0.01 },
      { key: 'flight', label: '飞行时长', type: 'range', default: 720, min: 400, max: 1000, step: 20, unit: 'ms' },
      { key: 'arc', label: '弧线高度', type: 'range', default: 100, min: 40, max: 160, step: 10, unit: 'px' },
      { key: 'trail', label: '飞行尾迹', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './PaperPlane.css'

export function ShareTrip() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  const send = () => {
    if (state === 'sending') return
    setState('sending')
    window.setTimeout(() => setState('sent'), ${num(p.flight)})
  }

  return (
    <button type="button" className={'plane-btn is-' + state} onClick={send}>
      <svg className="plane-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12 22 3l-8 19-3.4-7.6L2 12Z" />
      </svg>
      <span>{state === 'idle' ? '分享行程' : state === 'sending' ? '发送中…' : '已分享'}</span>
    </button>
  )
}`,
      css: `.plane-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: 0;
  border-radius: 12px;
  background: #3b82f6;
  color: #fff;
  transition: transform 140ms ease, background 240ms ease;
}
.plane-btn:active { transform: scale(${num(p.pressScale)}); }
.plane-btn.is-sent { background: #0f9f6e; }
.plane-icon { width: 18px; height: 18px; fill: currentColor; }
.plane-btn.is-sending .plane-icon {
  animation: plane-fly ${num(p.flight)}ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
${
  bool(p.trail)
    ? `.plane-btn.is-sending::after {
  content: '';
  position: absolute;
  width: 52px;
  height: 1px;
  background: linear-gradient(90deg, transparent, currentColor);
  animation: plane-trail ${num(p.flight)}ms ease-out both;
}`
    : ''
}
@keyframes plane-fly {
  0% { transform: translate(0, 0) rotate(0); opacity: 1; }
  45% { transform: translate(38px, -${num(p.arc)}px) rotate(-18deg); opacity: 1; }
  100% { transform: translate(88px, -18px) rotate(8deg); opacity: 0; }
}
@keyframes plane-trail { from { opacity: 0.8; transform: scaleX(0.2); } to { opacity: 0; transform: scaleX(1); } }

@media (prefers-reduced-motion: reduce) {
  .plane-btn.is-sending .plane-icon { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 25 */
  {
    id: 'longPressMenu',
    index: 25,
    name: '长按快捷菜单',
    en: 'Long Press Menu',
    tagline: '按住才浮起，快捷操作从卡片周围长出来',
    description:
      '长按不是「点得久一点的点击」，而是一段明确的意图确认：按住超过阈值，卡片浮起、阴影加深，快捷操作错峰展开；提前松手就取消。选完操作后菜单收起、卡片归位，空间关系始终清楚。',
    category: 'component',
    tags: ['长按', '快捷操作', '浮起'],
    useCases: ['内容卡片', '图片操作', '文件管理', '移动端菜单'],
    keywords: ['长按', '快捷菜单', '菜单', '浮起', '卡片', '操作', '编辑', '复制', '删除', '手势', '提示词'],
    tip: '长按阈值建议 500ms 左右，太短会误触、太长让人以为没反应；操作项不要超过 4 个。',
    params: [
      { key: 'threshold', label: '长按判定', type: 'range', default: 520, min: 300, max: 900, step: 20, unit: 'ms' },
      { key: 'lift', label: '浮起高度', type: 'range', default: 10, min: 4, max: 16, step: 1, unit: 'px' },
      { key: 'scale', label: '浮起放大', type: 'range', default: 1.06, min: 1.02, max: 1.12, step: 0.01 },
      { key: 'blur', label: '背景压暗', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useEffect, useRef, useState } from 'react'
import './LongPressMenu.css'

export function PressCard() {
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const down = () => {
    timer.current = window.setTimeout(() => setOpen(true), ${num(p.threshold)})
  }
  const cancel = () => window.clearTimeout(timer.current)
  useEffect(() => () => cancel(), [])

  return (
    <div className="lpm-wrap ${bool(p.blur) ? 'has-veil' : ''}">
      <div
        className={'lpm-card' + (open ? ' is-open' : '')}
        onPointerDown={down}
        onPointerUp={cancel}
        onPointerLeave={cancel}
      >
        周末旅行计划
      </div>
      {open && (
        <div className="lpm-actions">
          {['编辑', '复制', '分享', '删除'].map((label) => (
            <button key={label} type="button" onClick={() => setOpen(false)}>{label}</button>
          ))}
        </div>
      )}
    </div>
  )
}`,
      css: `.lpm-wrap { position: relative; }
.lpm-wrap.has-veil::before {
  content: '';
  position: absolute;
  inset: -40px;
  background: rgba(6, 7, 12, 0.5);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 220ms ease;
}
.lpm-wrap.has-veil:has(.lpm-card.is-open)::before { opacity: 1; }
.lpm-card {
  position: relative;
  z-index: 1;
  padding: 20px;
  border-radius: 14px;
  background: #171a26;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease;
  touch-action: manipulation;
}
.lpm-card.is-open {
  transform: translateY(-${num(p.lift)}px) scale(${num(p.scale)});
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.85);
}
.lpm-actions {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: -18px;
  display: flex;
  gap: 10px;
  transform: translateX(-50%);
  animation: lpm-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.lpm-actions button {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #222638;
  color: #fff;
}
@keyframes lpm-in {
  from { opacity: 0; transform: translate(-50%, 10px) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, 0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .lpm-card, .lpm-actions { transition: none; animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 26 */
  {
    id: 'accordion',
    index: 26,
    name: '手风琴问答',
    en: 'Accordion',
    tagline: '答案推开下方内容，打开新的一项就收起旧的',
    description:
      '手风琴列表用高度过渡把「展开」做成一次有方向的推移：问题行保持不动，答案从 0 高度长出来并把下面的内容顶开。手风琴模式下始终只留一个答案，让读者的视线不用在多个开放区块之间来回跳。',
    category: 'component',
    tags: ['手风琴', '问答', '展开'],
    useCases: ['FAQ 问答', '设置分组', '详情折叠', '帮助中心'],
    keywords: ['手风琴', '问答', 'FAQ', '折叠', '展开', '列表', '答案', '问题', '收起', '提示词'],
    tip: '只动 grid-template-rows 或 max-height，不要改具体像素高度；内容多的答案要允许内部滚动。',
    params: [
      { key: 'duration', label: '展开时长', type: 'range', default: 380, min: 200, max: 600, step: 20, unit: 'ms' },
      {
        key: 'easing',
        label: '缓动曲线',
        type: 'select',
        default: 'smooth',
        options: [
          { label: '平滑', value: 'smooth' },
          { label: '弹性', value: 'spring' },
        ],
      },
      { key: 'single', label: '只开一项', type: 'switch', default: true },
      {
        key: 'icon',
        label: '图标样式',
        type: 'select',
        default: 'plus',
        options: [
          { label: '加号', value: 'plus' },
          { label: '箭头', value: 'chevron' },
        ],
      },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './Accordion.css'

const FAQ = [
  ['什么是 MotionKit？', '一套把高级动效拆成可复用配方的交互样式库。'],
  ['可以直接复制代码吗？', '可以，每个效果都提供 React 与原生 CSS 两段代码。'],
  ['支持参数调整吗？', '支持，所有配方都带实时调参面板。'],
]

export function FaqList() {
  const [open, setOpen] = useState<number | null>(0)
  const toggle = (i: number) =>
    setOpen((cur) => ${bool(p.single) ? '(cur === i ? null : i)' : '(cur === i ? null : cur)' })

  return (
    <div className="acc-list">
      {FAQ.map(([q, a], i) => (
        <div key={q} className={'acc-item' + (open === i ? ' is-open' : '')}>
          <button type="button" className="acc-q" onClick={() => toggle(i)}>
            {q}<span className="acc-icon acc-icon--${str(p.icon)}" />
          </button>
          <div className="acc-a"><div><p>{a}</p></div></div>
        </div>
      ))}
    </div>
  )
}`,
      css: `.acc-item { border-bottom: 1px solid rgba(255, 255, 255, 0.09); }
.acc-q {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.acc-icon { transition: transform ${num(p.duration)}ms ${
    str(p.easing) === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  }; }
.acc-item.is-open .acc-icon { transform: rotate(${str(p.icon) === 'plus' ? '45deg' : '180deg'}); }
.acc-a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows ${num(p.duration)}ms ${
    str(p.easing) === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  };
}
.acc-item.is-open .acc-a { grid-template-rows: 1fr; }
.acc-a > div { overflow: hidden; }
.acc-a p { margin: 0 0 16px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; }

@media (prefers-reduced-motion: reduce) {
  .acc-a, .acc-icon { transition: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 27 */
  {
    id: 'multiSelectBar',
    index: 27,
    name: '多选操作栏',
    en: 'Multi Select Bar',
    tagline: '选中即浮出操作栏，数量与选择状态始终同步',
    description:
      '多选态不需要额外的入口说明：第一项被选中的瞬间，底部操作栏滑入并显示已选数量；每次选择变化都同步刷新数字；全部取消后操作栏原路收回。勾选动画与计数联动，让用户确认「我选了什么」。',
    category: 'component',
    tags: ['多选', '操作栏', '勾选'],
    useCases: ['文件管理', '任务批量处理', '消息清理', '相册选图'],
    keywords: ['多选', '操作栏', '勾选', '批量', '已选', '全选', '删除', '移动', '列表', '提示词'],
    tip: '操作栏不要超过 3 个主操作；数量变化要有明确反馈，避免用户怀疑是否点中。',
    params: [
      { key: 'accent', label: '强调色', type: 'color', default: '#3b82f6' },
      { key: 'barHeight', label: '操作栏高度', type: 'range', default: 60, min: 48, max: 80, step: 2, unit: 'px' },
      {
        key: 'anim',
        label: '出现方式',
        type: 'select',
        default: 'slide',
        options: [
          { label: '平滑滑入', value: 'slide' },
          { label: '弹性滑入', value: 'spring' },
        ],
      },
      { key: 'selectAll', label: '显示全选', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './MultiSelectBar.css'

const ITEMS = ['设计稿 v3', '交互说明', '动效规范', '组件清单', '走查记录', '交付文档']

export function MultiList() {
  const [selected, setSelected] = useState<number[]>([])
  const toggle = (i: number) =>
    setSelected((prev) => prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i])

  return (
    <div className="ms-wrap">
      ${bool(p.selectAll) ? `<button type="button" onClick={() => setSelected(selected.length ? [] : ITEMS.map((_, i) => i))}>全选</button>\n      ` : ''}{ITEMS.map((name, i) => (
        <button key={name} type="button" className={'ms-row' + (selected.includes(i) ? ' is-on' : '')} onClick={() => toggle(i)}>
          <i className="ms-check" />{name}
        </button>
      ))}
      <div className={'ms-bar' + (selected.length ? ' is-open' : '')} aria-hidden={!selected.length}>
        已选 {selected.length} 项
        <button type="button" onClick={() => setSelected([])}>删除</button>
      </div>
    </div>
  )
}`,
      css: `.ms-wrap { position: relative; padding-bottom: ${num(p.barHeight) + 16}px; }
.ms-row { display: flex; gap: 12px; width: 100%; padding: 12px; background: none; border: 0; color: inherit; text-align: left; }
.ms-check { width: 18px; height: 18px; border-radius: 50%; border: 1px solid currentColor; }
.ms-row.is-on .ms-check { background: ${str(p.accent)}; border-color: ${str(p.accent)}; }
.ms-bar {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: ${num(p.barHeight)}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-radius: 14px;
  background: #1b1f2d;
  color: #fff;
  transform: translateY(calc(100% + 24px));
  opacity: 0;
  transition: transform 320ms ${
    str(p.anim) === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  }, opacity 200ms ease;
}
.ms-bar.is-open { transform: none; opacity: 1; }
.ms-bar button { border: 0; border-radius: 9px; padding: 8px 14px; background: ${str(p.accent)}; color: #fff; }

@media (prefers-reduced-motion: reduce) { .ms-bar { transition: none; } }`,
    }),
  },

  /* ---------------------------------------------------------------- 28 */
  {
    id: 'numberStepper',
    index: 28,
    name: '数量步进器',
    en: 'Number Stepper',
    tagline: '数字纵向滚动，按钮轻弹，数量不会跌破下限',
    description:
      '步进器的重点是「数字真的在滚动」：旧数字向上滑出、新数字从下方进入，按钮轻微回弹确认点击，金额与数量同步更新。减到下限后按钮禁用，不让用户点到没有结果的地方。',
    category: 'component',
    tags: ['步进器', '数字滚动', '回弹'],
    useCases: ['购物车数量', '票数选择', '人数配置', '规格数量'],
    keywords: ['步进器', '数量', '加减', '数字滚动', '回弹', '购物车', '最小值', '不能小于零', '提示词'],
    tip: '数字滚动容器要有固定高度并 overflow hidden，不然会出现上下数字同时露出的穿帮。',
    params: [
      { key: 'bounce', label: '按钮回弹', type: 'switch', default: true },
      { key: 'digitHeight', label: '数字行高', type: 'range', default: 34, min: 24, max: 48, step: 2, unit: 'px' },
      { key: 'duration', label: '滚动时长', type: 'range', default: 360, min: 200, max: 600, step: 20, unit: 'ms' },
      { key: 'min', label: '最小值', type: 'range', default: 0, min: 0, max: 5, step: 1 },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './NumberStepper.css'

export function Stepper() {
  const [value, setValue] = useState(1)
  const change = (d: number) => setValue((v) => Math.max(${num(p.min)}, v + d))

  return (
    <div className="stepper">
      <button type="button" className="step-btn" disabled={value <= ${num(p.min)}} onClick={() => change(-1)}>−</button>
      <div className="step-window" style={{ height: ${num(p.digitHeight)} }}>
        <div key={value} className="step-digit" style={{ animationDuration: '${num(p.duration)}ms' }}>{value}</div>
      </div>
      <button type="button" className="step-btn" onClick={() => change(1)}>+</button>
    </div>
  )
}`,
      css: `.stepper { display: inline-flex; align-items: center; gap: 14px; }
.step-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #1b1f2d;
  color: #fff;
  font-size: 18px;
}
${bool(p.bounce) ? `.step-btn:active { animation: step-bounce 320ms ease; }` : ''}
.step-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.step-window { width: 44px; overflow: hidden; text-align: center; }
.step-digit { line-height: ${num(p.digitHeight)}px; animation: digit-in ${num(p.duration)}ms cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes digit-in {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes step-bounce {
  0% { transform: scale(1); }
  40% { transform: scale(0.86); }
  70% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .step-digit, .step-btn { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 29 */
  {
    id: 'cardFlip',
    index: 29,
    name: '卡片翻面',
    en: 'Card Flip',
    tagline: '沿竖轴翻到背面，中途不会看到镜像文字',
    description:
      '翻面卡用 3D 旋转把正反两面讲成一个连续动作：正面转过 90° 后交给背面，两面都设置 backface-visibility: hidden，背面文字始终正向。它适合会员凭证、支付方式、答案卡这类「一张卡两层信息」的场景。',
    category: 'component',
    tags: ['翻面', '3D', '凭证'],
    useCases: ['会员凭证', '支付卡', '答案卡', '双语信息卡'],
    keywords: ['翻面', '翻转', '卡片', '3D', '旋转', '正面', '背面', '镜像', '凭证', '提示词'],
    tip: '一定要给两面加 backface-visibility: hidden，并在 90° 前后切换可见面，否则会看到反字穿帮。',
    params: [
      { key: 'duration', label: '翻转时长', type: 'range', default: 700, min: 400, max: 1000, step: 20, unit: 'ms' },
      { key: 'perspective', label: '透视距离', type: 'range', default: 1000, min: 600, max: 1400, step: 50, unit: 'px' },
      {
        key: 'axis',
        label: '翻转轴',
        type: 'select',
        default: 'y',
        options: [
          { label: '竖轴 Y', value: 'y' },
          { label: '横轴 X', value: 'x' },
        ],
      },
      { key: 'shadow', label: '翻转投影', type: 'switch', default: true },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './CardFlip.css'

export function FlipCard() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flip-scene" style={{ perspective: ${num(p.perspective)} }}>
      <div className={'flip-card' + (flipped ? ' is-flipped' : '')} onClick={() => setFlipped((v) => !v)}>
        <div className="flip-face flip-face--front">
          <span>PRO</span><h3>MotionKit</h3><p>点击翻到背面 →</p>
        </div>
        <div className="flip-face flip-face--back">
          <h3>专属凭证</h3><p>NO. 20261124</p><p>点击返回正面</p>
        </div>
      </div>
    </div>
  )
}`,
      css: `.flip-scene { width: 300px; }
.flip-card {
  position: relative;
  width: 100%;
  height: 200px;
  transform-style: preserve-3d;
  transition: transform ${num(p.duration)}ms cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  ${bool(p.shadow) ? 'filter: drop-shadow(0 24px 30px rgba(0, 0, 0, 0.55));' : ''}
}
.flip-card.is-flipped { transform: rotate${str(p.axis) === 'x' ? 'X' : 'Y'}(180deg); }
.flip-face {
  position: absolute;
  inset: 0;
  padding: 24px;
  border-radius: 18px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: linear-gradient(140deg, #1e3a8a, #0e1324);
  color: #fff;
}
.flip-face--back {
  transform: rotate${str(p.axis) === 'x' ? 'X' : 'Y'}(180deg);
  background: linear-gradient(140deg, #0f766e, #0e1324);
}
@media (prefers-reduced-motion: reduce) { .flip-card { transition: none; } }`,
    }),
  },

  /* ---------------------------------------------------------------- 30 */
  {
    id: 'searchFilter',
    index: 30,
    name: '搜索筛选标签',
    en: 'Search Filter Tabs',
    tagline: '选中底色滑到新标签，结果先淡出再依次落位',
    description:
      '筛选切换不是整页刷新：胶囊底色从旧标签滑到新标签，结果列表先整体淡出，再按短间隔依次进入。用户的视线能跟住「我点了哪里」和「内容从哪里换掉」，列表就不会显得突然跳变。',
    category: 'component',
    tags: ['筛选标签', '胶囊指示', '列表切换'],
    useCases: ['搜索结果', '内容分类', '商品筛选', '作品集过滤'],
    keywords: ['筛选', '标签', '搜索', '胶囊', '指示器', '淡出', '依次', '结果', '列表', '提示词'],
    tip: '切列表时先淡出再淡入，间隔别超过 100ms；否则用户会觉得内容来得拖沓。',
    params: [
      {
        key: 'indicator',
        label: '指示动画',
        type: 'select',
        default: 'spring',
        options: [
          { label: '平滑滑动', value: 'slide' },
          { label: '弹性滑动', value: 'spring' },
        ],
      },
      { key: 'fade', label: '淡出时长', type: 'range', default: 260, min: 150, max: 500, step: 10, unit: 'ms' },
      { key: 'stagger', label: '逐项间隔', type: 'range', default: 80, min: 40, max: 140, step: 10, unit: 'ms' },
      { key: 'accent', label: '强调色', type: 'color', default: '#3b82f6' },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './SearchFilter.css'

const TABS = ['全部', '交互', '文字', '数据']
const RESULTS: Record<string, string[]> = {
  全部: ['聚光灯卡片', '文字解码', '数字递增', '边缘流光'],
  交互: ['聚光灯卡片', '磁吸按钮', '悬停上浮'],
  文字: ['文字解码', '打字机效果'],
  数据: ['数字递增', '边缘流光'],
}

export function FilterDemo() {
  const [tab, setTab] = useState('全部')
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  const select = (next: string) => {
    setPhase('out')
    window.setTimeout(() => { setTab(next); setPhase('in') }, ${num(p.fade)})
  }

  return (
    <div className="sf-wrap">
      <div className="sf-tabs">
        {TABS.map((t) => (
          <button key={t} type="button" className={t === tab ? 'is-active' : ''} onClick={() => select(t)}>{t}</button>
        ))}
        <i className="sf-indicator" />
      </div>
      <div className={'sf-results is-' + phase}>
        {RESULTS[tab].map((name, i) => (
          <div key={name} style={{ animationDelay: i * ${num(p.stagger)}ms }}>{name}</div>
        ))}
      </div>
    </div>
  )
}`,
      css: `.sf-tabs { position: relative; display: flex; gap: 8px; }
.sf-tabs button { position: relative; z-index: 1; padding: 8px 14px; border: 0; background: none; color: inherit; }
.sf-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 64px;
  height: 34px;
  border-radius: 10px;
  background: ${str(p.accent)};
  transition: transform 340ms ${
    str(p.indicator) === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  };
}
.sf-results { transition: opacity ${num(p.fade)}ms ease; }
.sf-results.is-out { opacity: 0; }
.sf-results > div {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  animation: sf-item 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes sf-item { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .sf-indicator, .sf-results { transition: none; }
  .sf-results > div { animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 31 */
  {
    id: 'stepProgress',
    index: 31,
    name: '步骤进度条',
    en: 'Step Progress',
    tagline: '圆点变对勾、连接线逐段填充，下一步自己亮起来',
    description:
      '步骤条把「走到哪一步」画成一条会生长的路径：完成当前步骤时圆点缩一下并换成对勾，连接线按固定时长从左到右填满，下一步圆点放大高亮、说明文字同步更新。每个视觉变化都指向同一个事实。',
    category: 'component',
    tags: ['步骤条', '进度', '对勾'],
    useCases: ['注册流程', '支付流程', '表单向导', '安装引导'],
    keywords: ['步骤', '进度条', '对勾', '圆点', '连接线', '填充', '完成', '下一步', '向导', '提示词'],
    tip: '不要让连接线提前填满：必须等当前步骤确认完成后才开始，否则进度会「说谎」。',
    params: [
      { key: 'fill', label: '连线填充', type: 'range', default: 520, min: 300, max: 800, step: 20, unit: 'ms' },
      { key: 'check', label: '笔画对勾', type: 'switch', default: true },
      {
        key: 'style',
        label: '材质样式',
        type: 'select',
        default: 'solid',
        options: [
          { label: '实色', value: 'solid' },
          { label: '玻璃', value: 'glass' },
        ],
      },
      { key: 'accent', label: '强调色', type: 'color', default: '#3b82f6' },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './StepProgress.css'

const STEPS = [
  ['填写信息', '填写基本资料与联系方式'],
  ['验证身份', '完成手机或邮箱验证'],
  ['确认支付', '核对订单并确认付款'],
  ['全部完成', '你已经走完整个流程'],
]

export function Steps() {
  const [current, setCurrent] = useState(0)
  return (
    <div className="sp-wrap">
      <div className="sp-track">
        {STEPS.map(([title], i) => (
          <div key={title} className={'sp-step ' + (i < current ? 'is-done' : i === current ? 'is-current' : '')}>
            <span className="sp-dot">${bool(p.check) ? '{i < current ? <svg viewBox="0 0 16 16"><path d="M3 8l3.5 3.5L13 5" /></svg> : i + 1}' : '{i < current ? "✓" : i + 1}'}</span>
            <b>{title}</b>
            {i < STEPS.length - 1 && <i className="sp-line" />}
          </div>
        ))}
      </div>
      <p>{STEPS[current][1]}</p>
      <button type="button" disabled={current === 3} onClick={() => setCurrent((v) => Math.min(3, v + 1))}>
        {current === 3 ? '全部完成' : '完成当前步骤'}
      </button>
    </div>
  )
}`,
      css: `.sp-track { display: flex; align-items: flex-start; }
.sp-step { position: relative; flex: 1; text-align: center; color: rgba(255, 255, 255, 0.45); }
.sp-dot {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin: 0 auto 8px;
  border-radius: 50%;
  border: 1px solid currentColor;
  ${str(p.style) === 'glass' ? 'backdrop-filter: blur(8px); background: rgba(255, 255, 255, 0.12);' : 'background: rgba(255, 255, 255, 0.06);'}
  transition: transform 300ms ease, background 300ms ease;
}
.sp-step.is-done .sp-dot { background: ${str(p.accent)}; color: #fff; border-color: ${str(p.accent)}; }
.sp-step.is-current { color: ${str(p.accent)}; }
.sp-step.is-current .sp-dot { transform: scale(1.18); box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.16); }
.sp-dot svg { width: 15px; fill: none; stroke: currentColor; stroke-width: 2; }
${bool(p.check) ? `.sp-dot svg path { stroke-dasharray: 20; stroke-dashoffset: 20; animation: sp-check 420ms ease forwards; }
@keyframes sp-check { to { stroke-dashoffset: 0; } }` : ''}
.sp-line {
  position: absolute;
  left: 50%;
  top: 15px;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
}
.sp-line::after {
  content: '';
  display: block;
  width: 0;
  height: 100%;
  background: ${str(p.accent)};
  transition: width ${num(p.fill)}ms cubic-bezier(0.22, 1, 0.36, 1);
}
.sp-step.is-done .sp-line::after { width: 100%; }
@media (prefers-reduced-motion: reduce) { .sp-dot, .sp-line::after { transition: none; } }`,
    }),
  },

  /* ---------------------------------------------------------------- 32 */
  {
    id: 'glassTabBar',
    index: 32,
    name: '玻璃标签栏',
    en: 'Glass Tab Bar',
    tagline: '胶囊指示器按速度拉长压扁，落位时轻轻过冲弹回',
    description:
      '液态玻璃标签栏的灵魂是那枚跟随指尖的玻璃胶囊：滑动时沿运动方向拉长、垂直方向压扁，停住时按弹簧参数过冲再回弹；图标在胶囊下方被放大。它不是「一个块跳到另一格」，而是一滴有惯性的玻璃。',
    category: 'glass',
    tags: ['液态玻璃', '标签栏', '弹簧'],
    useCases: ['底部导航', '分段控制', '选择器', '工具栏'],
    keywords: ['玻璃标签栏', '液态玻璃', '胶囊', '指示器', '弹簧', '拉长', '压扁', '过冲', 'tab', '导航', '提示词'],
    tip: '弹簧刚度 300、阻尼比 0.5 手感最接近系统原生；拉长系数别超过 1.8，否则像橡皮筋。',
    params: [
      { key: 'stiffness', label: '弹簧刚度', type: 'range', default: 300, min: 180, max: 420, step: 10 },
      { key: 'damping', label: '阻尼比', type: 'range', default: 0.5, min: 0.3, max: 0.8, step: 0.05 },
      { key: 'stretch', label: '拉长系数', type: 'range', default: 1.4, min: 1.1, max: 1.8, step: 0.05 },
      { key: 'blur', label: '玻璃模糊', type: 'range', default: 10, min: 4, max: 20, step: 1, unit: 'px' },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef, useState } from 'react'
import './GlassTabBar.css'

const TABS = ['首页', '发现', '消息', '我的']

export function GlassTabs() {
  const [active, setActive] = useState(0)
  const bar = useRef<HTMLDivElement>(null)
  const capsule = useRef<HTMLSpanElement>(null)

  const select = (i: number) => {
    const el = capsule.current
    if (!el) return
    const from = active
    setActive(i)
    const distance = Math.abs(i - from)
    el.animate(
      [
        { left: from * 25 + '%', transform: 'scaleX(1)' },
        { left: (from + (i - from) * 0.55) + '%', transform: 'scaleX(${num(p.stretch)}) scaleY(0.86)' },
        { left: i * 25 + '%', transform: 'scaleX(0.96) scaleY(1.03)' },
        { left: i * 25 + '%', transform: 'scaleX(1)' },
      ],
      {
        duration: ${Math.round(520 - num(p.stiffness) * 0.4)} + distance * 40,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    )
  }

  return (
    <div ref={bar} className="gtab-bar">
      {TABS.map((t, i) => (
        <button key={t} type="button" className={i === active ? 'is-active' : ''} onClick={() => select(i)}>{t}</button>
      ))}
      <span ref={capsule} className="gtab-capsule" style={{ left: active * 25 + '%' }} />
    </div>
  )
}`,
      css: `.gtab-bar {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 360px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(${num(p.blur)}) saturate(160%);
}
.gtab-bar button {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 12px 0;
  border: 0;
  background: none;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 260ms ease, color 260ms ease;
}
.gtab-bar button.is-active { color: #fff; transform: scale(1.08); }
.gtab-capsule {
  position: absolute;
  top: 6px;
  bottom: 6px;
  width: calc(25% - 3px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(${num(p.blur)});
  transform-origin: center;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .gtab-bar button { transition: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 33 */
  {
    id: 'glassToggle',
    index: 33,
    name: '果冻开关',
    en: 'Jelly Toggle',
    tagline: '磨砂旋钮按下变玻璃珠，横纵两轴不同阻尼出果冻感',
    description:
      '开关静止时是白色磨砂，按下瞬间变成透明的玻璃珠；切换时横向与纵向用不同阻尼回弹，出现果冻般的挤压感，轨道填充同步跟上。一个小小的开关，也能有材质与性格。',
    category: 'glass',
    tags: ['液态玻璃', '开关', '果冻'],
    useCases: ['设置开关', '功能启用', '专注模式', '偏好切换'],
    keywords: ['果冻开关', '开关', '液态玻璃', 'toggle', '磨砂', '玻璃珠', '阻尼', '挤压', '提示词'],
    tip: '果冻形变只在按下与切换瞬间出现，静止时必须回到规整的圆形，不然会显得失控。',
    params: [
      { key: 'jelly', label: '果冻形变', type: 'switch', default: true },
      { key: 'aniso', label: '两轴差异', type: 'range', default: 0.45, min: 0.2, max: 0.8, step: 0.05 },
      { key: 'blur', label: '磨砂强度', type: 'range', default: 8, min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'tint', label: '旋钮染色', type: 'color', default: '#ffffff' },
    ],
    code: (p: Params) => ({
      tsx: `import { useState } from 'react'
import './GlassToggle.css'

export function JellySwitch() {
  const [on, setOn] = useState(false)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={'gtog-track' + (on ? ' is-on' : '')}
      onClick={() => setOn((v) => !v)}
    >
      <span className="gtog-knob" />
    </button>
  )
}`,
      css: `.gtog-track {
  position: relative;
  width: 108px;
  height: 56px;
  padding: 0;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(${num(p.blur)});
  cursor: pointer;
}
.gtog-track.is-on { background: rgba(59, 130, 246, 0.75); }
.gtog-knob {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${str(p.tint)};
  backdrop-filter: blur(${num(p.blur)});
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 8px 18px rgba(0, 0, 0, 0.4);
  transition: left 420ms cubic-bezier(0.22, 1, 0.36, 1);
}
.gtog-track.is-on .gtog-knob { left: 59px; }
${bool(p.jelly) ? `.gtog-track:active .gtog-knob {
  animation: gtog-jelly 460ms ease-out;
}
@keyframes gtog-jelly {
  0% { transform: scaleX(1) scaleY(1); }
  35% { transform: scaleX(${1 + num(p.aniso) * 0.4}) scaleY(${1 - num(p.aniso) * 0.24}); }
  65% { transform: scaleX(${1 - num(p.aniso) * 0.16}) scaleY(${1 + num(p.aniso) * 0.12}); }
  100% { transform: scaleX(1) scaleY(1); }
}` : ''}
@media (prefers-reduced-motion: reduce) {
  .gtog-knob { transition: none; animation: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 34 */
  {
    id: 'glassSlider',
    index: 34,
    name: '放大镜滑块',
    en: 'Magnifier Slider',
    tagline: '拖动时旋钮放大成透镜，轨道、数值、填充三者同步',
    description:
      '滑块被按住时，圆钮放大成放大镜，透过它能看清下方的轨道与刻度；轨道填充、旋钮位置、数值显示用同一套节奏同步变化，松手恢复原大小。同步是「顺滑」和「松垮」的分界线。',
    category: 'glass',
    tags: ['液态玻璃', '滑块', '放大镜'],
    useCases: ['音量亮度', '价格区间', '进度调节', '参数面板'],
    keywords: ['放大镜', '滑块', '液态玻璃', '拖动', '数值同步', '刻度', '吸附', '提示词'],
    tip: '放大倍数 1.6–2.0 最自然；轨道填充、滑块位置、数字三者必须同一时长，不能各走各的。',
    params: [
      { key: 'magnify', label: '放大倍数', type: 'range', default: 1.9, min: 1.2, max: 2.2, step: 0.1 },
      { key: 'blur', label: '透镜模糊', type: 'range', default: 8, min: 2, max: 16, step: 1, unit: 'px' },
      { key: 'snap', label: '整数吸附', type: 'switch', default: false },
      { key: 'accent', label: '轨道强调色', type: 'color', default: '#3b82f6' },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef, useState } from 'react'
import './GlassSlider.css'

export function MagnifySlider() {
  const [value, setValue] = useState(50)
  const [active, setActive] = useState(false)
  const track = useRef<HTMLDivElement>(null)

  const update = (clientX: number) => {
    const r = track.current?.getBoundingClientRect()
    if (!r) return
    const raw = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100))
    ${bool(p.snap) ? 'setValue(Math.round(raw / 10) * 10)' : 'setValue(Math.round(raw))'}
  }

  return (
    <div className="gslider">
      <div
        ref={track}
        className="gslider__track"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setActive(true); update(e.clientX) }}
        onPointerMove={(e) => active && update(e.clientX)}
        onPointerUp={() => setActive(false)}
      >
        <i className="gslider__fill" style={{ width: value + '%' }} />
        <span className={'gslider__knob' + (active ? ' is-active' : '')} style={{ left: value + '%' }}>
          <b>{value}</b>
        </span>
      </div>
    </div>
  )
}`,
      css: `:root { --slider-accent: ${str(p.accent)}; }
.gslider { padding: 28px 10px; }
.gslider__track {
  position: relative;
  height: 8px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.14);
  touch-action: none;
}
.gslider__fill {
  display: block;
  height: 100%;
  border-radius: 99px;
  background: var(--slider-accent);
  transition: width 120ms linear;
}
.gslider__knob {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.32);
  backdrop-filter: blur(${num(p.blur)}) saturate(170%);
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}
.gslider__knob.is-active { transform: scale(${num(p.magnify)}); }
.gslider__knob b { font-size: 11px; color: #fff; }
@media (prefers-reduced-motion: reduce) {
  .gslider__knob, .gslider__fill { transition: none; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 35 */
  {
    id: 'glassCard',
    index: 35,
    name: '跟随折射卡片',
    en: 'Refraction Card',
    tagline: '拖到哪儿，背后的光就在哪儿弯折',
    description:
      '真正的液态玻璃不是「把背景模糊」，而是把背景弯折：中心几乎不变，越靠边缘越像凸透镜；边缘分出红蓝彩边，颜色来自背景本身，外圈用 1–2px 细白边收住形状，内部只保留极轻的模糊。拖动卡片时，这团光学形变跟着走。',
    category: 'glass',
    tags: ['液态玻璃', '真折射', '色散'],
    useCases: ['悬浮卡片', '玻璃面板', '播放器控件', '系统弹层'],
    keywords: ['真折射', '色散', '彩边', '细白边', '液态玻璃', '拖动', '凸透镜', '玻璃卡片', '提示词'],
    tip: '同屏玻璃不要超过 5 块；像素参数按 min(devicePixelRatio, 2) 封顶，否则移动端会掉帧。',
    params: [
      { key: 'refraction', label: '折射强度', type: 'range', default: 24, min: 0, max: 40, step: 1 },
      { key: 'chromatic', label: '色散像素', type: 'range', default: 8, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'blur', label: '内部模糊', type: 'range', default: 2, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'edge', label: '细白边', type: 'range', default: 2, min: 1, max: 3, step: 0.5, unit: 'px' },
    ],
    code: (p: Params) => ({
      tsx: `import { useRef } from 'react'
import './GlassCard.css'

export function RefractionCard() {
  const card = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, x: 0, y: 0, bx: 0, by: 0 })

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, x: e.clientX, y: e.clientY, bx: 0, by: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active || !card.current) return
    d.bx += e.clientX - d.x
    d.by += e.clientY - d.y
    d.x = e.clientX
    d.y = e.clientY
    card.current.style.transform = 'translate(' + d.bx + 'px,' + d.by + 'px)'
  }
  const up = () => { drag.current.active = false }

  return (
    <>
      <svg width="0" height="0" aria-hidden="true">
        <filter id="glass-refract">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves={2} seed={4} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="${num(p.refraction)}" xChannelSelector="R" yChannelSelector="G" result="warp" />
          <feOffset in="warp" dx="${num(p.chromatic)}" dy="0" result="red" />
          <feOffset in="warp" dx="-${num(p.chromatic)}" dy="0" result="blue" />
          <feBlend in="red" in2="blue" mode="screen" />
        </filter>
      </svg>
      <div ref={card} className="gcard" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <i className="gcard__refraction" />
        <h3>拖动我</h3>
        <p>背景会跟着弯折</p>
      </div>
    </>
  )
}`,
      css: `.gcard {
  position: relative;
  isolation: isolate;
  width: 260px;
  height: 160px;
  padding: 24px;
  border-radius: 22px;
  border: ${num(p.edge)}px solid rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(${num(p.blur)}) saturate(180%);
  color: #fff;
  cursor: grab;
  touch-action: none;
  overflow: hidden;
}
.gcard:active { cursor: grabbing; }
.gcard__refraction {
  position: absolute;
  inset: -18%;
  z-index: -1;
  filter: url(#glass-refract);
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), transparent 34%),
    linear-gradient(120deg, transparent 30%, rgba(147, 197, 253, 0.5) 50%, transparent 70%);
  opacity: 0.85;
}
@media (prefers-reduced-motion: reduce) { .gcard__refraction { filter: none; } }`,
    }),
  },

  /* 边框系列：36–41 */
  ...borderCatalog,
]

export const getEffect = (id: string) => catalog.find((e) => e.id === id)

export const defaultParams = (effect: EffectMeta): Params =>
  Object.fromEntries(effect.params.map((p) => [p.key, p.default]))

export const allDefaultParams = (): Record<string, Params> =>
  Object.fromEntries(catalog.map((e) => [e.id, defaultParams(e)]))

export const categoryLabel: Record<string, string> = {
  all: '全部动效',
  pointer: '鼠标交互',
  scroll: '滚动控制',
  text: '文字动效',
  data: '数据与高光',
  base: '动画基础',
  overlay: '弹窗提示',
  component: '组件交互',
  glass: '液态玻璃',
}

export { pct }

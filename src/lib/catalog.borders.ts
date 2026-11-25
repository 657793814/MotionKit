import type { EffectMeta, Params } from './types'
import { num, str } from './utils'

/**
 * 边框系列：六种「光沿边框运动」的不同解法。
 * 视觉外壳与实现见 src/effects/borderKit/BorderCard.css。
 */
export const borderCatalog: EffectMeta[] = [
  /* ---------------------------------------------------------------- 36 */
  {
    id: 'borderFlow',
    index: 36,
    name: '多色渐变流光',
    en: 'Multi-color Flow',
    tagline: '四色首尾相接，光沿着整套色环滚动',
    description:
      '用 conic-gradient 把 3–4 个颜色首尾相接铺满一整圈，再让 @property 注册的角度变量持续旋转，卡片只保留 padding 让出的那一圈描边。颜色越多越接近「极光」，适合需要明确强调「新品 / 限量 / 主推」的卡片。',
    category: 'data',
    tags: ['边框', '多色', '流光'],
    useCases: ['新品发布卡', '会员权益页', '大促主推位', '潮流与音乐产品'],
    keywords: ['多色', '渐变', '流光', '彩虹', '极光', '边框', '旋转', '强调', '炫彩', '循环', '高级', '渐变边框'],
    tip: '颜色不要超过 4 个，且首尾必须回到同一个颜色，否则衔接处会出现一道硬边。',
    params: [
      { key: 'speed', label: '旋转周期', type: 'range', default: 6, min: 3, max: 14, step: 0.5, unit: 's' },
      { key: 'thickness', label: '描边粗细', type: 'range', default: 1.5, min: 1, max: 5, step: 0.5, unit: 'px' },
      { key: 'radius', label: '圆角', type: 'range', default: 20, min: 8, max: 32, step: 1, unit: 'px' },
      { key: 'color1', label: '色 1', type: 'color', default: '#3b82f6' },
      { key: 'color2', label: '色 2', type: 'color', default: '#22d3ee' },
      { key: 'color3', label: '色 3', type: 'color', default: '#34d399' },
      { key: 'color4', label: '色 4', type: 'color', default: '#f472b6' },
      { key: 'glow', label: '外发光', type: 'range', default: 0.55, min: 0, max: 1, step: 0.05, unit: '' },
    ],
    code: (p: Params) => ({
      tsx: `import './BorderFlow.css'

export function BorderFlowCard() {
  return (
    <div className="bx">
      <div className="bx__inner">
        <span className="bx__badge">FLOW</span>
        <h3>Aurora Pro</h3>
        <p className="bx__price">¥128 <span>/ 月</span></p>
        <button className="bx__cta">开始使用</button>
      </div>
    </div>
  )
}`,
      css: `@property --a {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.bx {
  --a: 0deg;
  --c1: ${str(p.color1, '#3b82f6')};
  --c2: ${str(p.color2, '#22d3ee')};
  --c3: ${str(p.color3, '#34d399')};
  --c4: ${str(p.color4, '#f472b6')};
  position: relative;
  width: 320px;
  padding: ${num(p.thickness, 1.5)}px;
  border-radius: ${num(p.radius, 20)}px;
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 0 40px -16px var(--c1);
}

/* 四色闭环，绕中心旋转 */
.bx::before {
  content: '';
  position: absolute;
  inset: -55%;
  background: conic-gradient(from var(--a), var(--c1), var(--c2), var(--c3), var(--c4), var(--c1));
  animation: bx-spin ${num(p.speed, 6)}s linear infinite;
}

.bx__inner {
  position: relative;
  padding: 24px;
  border-radius: ${Math.max(4, num(p.radius, 20) - num(p.thickness, 1.5))}px;
  background: #151a27;
  color: #f2f4f8;
}

@keyframes bx-spin {
  to { --a: 360deg; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 37 */
  {
    id: 'borderNeon',
    index: 37,
    name: '局部霓虹描边',
    en: 'Local Neon Stroke',
    tagline: '只亮一小段弧，暗线拖出霓虹的余味',
    description:
      '把 conic-gradient 的绝大部分设为透明，只在一段约 60° 的弧上放亮色和一点白色高光核心，再叠一层模糊的同款渐变做辉光。它区别于整圈流光的地方是「克制」：像霓虹灯管的一截，不抢内容，但足够抓眼。',
    category: 'data',
    tags: ['边框', '霓虹', '局部'],
    useCases: ['夜间模式产品', '游戏与电竞', '音乐 App', '赛博风落地页'],
    keywords: ['霓虹', '局部', '描边', '边框', '发光', '赛博', '夜间', '克制', '灯管', '强调', '一圈', '光弧'],
    tip: '亮段长度控制在 45°–75°：太长会退回普通流光，太短则像描边上沾了一块脏东西。',
    params: [
      { key: 'speed', label: '循环周期', type: 'range', default: 5, min: 2, max: 12, step: 0.5, unit: 's' },
      { key: 'thickness', label: '描边粗细', type: 'range', default: 1.5, min: 1, max: 4, step: 0.5, unit: 'px' },
      { key: 'radius', label: '圆角', type: 'range', default: 20, min: 8, max: 32, step: 1, unit: 'px' },
      { key: 'color1', label: '霓虹色', type: 'color', default: '#22d3ee' },
      { key: 'color2', label: '拖尾色', type: 'color', default: '#a855f7' },
      { key: 'glow', label: '辉光强度', type: 'range', default: 0.7, min: 0, max: 1, step: 0.05, unit: '' },
    ],
    code: (p: Params) => ({
      tsx: `import './BorderNeon.css'

export function BorderNeonCard() {
  return (
    <div className="nbx">
      <div className="nbx__inner">
        <span className="nbx__badge">NEON</span>
        <h3>Aurora Pro</h3>
        <p className="nbx__price">¥128 <span>/ 月</span></p>
        <button className="nbx__cta">开始使用</button>
      </div>
    </div>
  )
}`,
      css: `@property --a {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.nbx {
  --a: 0deg;
  --c1: ${str(p.color1, '#22d3ee')};
  --c2: ${str(p.color2, '#a855f7')};
  position: relative;
  width: 320px;
  padding: ${num(p.thickness, 1.5)}px;
  border-radius: ${num(p.radius, 20)}px;
  overflow: hidden;
  isolation: isolate;
  /* 未点亮处保留一条极暗的线，避免边框「断开」 */
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* 只有 300deg → 360deg 这一小段是亮的 */
.nbx::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: conic-gradient(
    from var(--a),
    transparent 0deg 296deg,
    var(--c1) 326deg,
    #fff 340deg,
    var(--c1) 350deg,
    transparent 360deg
  );
  animation: nbx-spin ${num(p.speed, 5)}s linear infinite;
}

/* 同款渐变整体模糊，做外圈辉光 */
.nbx::after {
  content: '';
  position: absolute;
  inset: -50%;
  background: conic-gradient(from var(--a), transparent 0deg 268deg, var(--c2) 330deg, transparent 360deg);
  filter: blur(14px);
  opacity: ${num(p.glow, 0.7)};
  animation: nbx-spin ${num(p.speed, 5)}s linear infinite;
}

.nbx__inner {
  position: relative;
  padding: 24px;
  border-radius: ${Math.max(4, num(p.radius, 20) - num(p.thickness, 1.5))}px;
  background: #151a27;
  color: #f2f4f8;
}

@keyframes nbx-spin {
  to { --a: 360deg; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 38 */
  {
    id: 'borderFade',
    index: 38,
    name: '淡出透明柔光',
    en: 'Soft Fade Glow',
    tagline: '光在边缘呼吸，两端自然化开',
    description:
      '用一条两端透明的线性渐变铺在边框上，再让整层透明度缓慢呼吸；外圈叠一层大范围模糊光晕。画面里没有明确的「光点」，只有明暗的起伏，最容易和高级感、留白、克制这些词挂上钩。',
    category: 'data',
    tags: ['边框', '柔光', '呼吸'],
    useCases: ['高端品牌官网', '定价卡', '邀请制产品', '极简作品集'],
    keywords: ['柔光', '淡出', '透明', '呼吸', '边框', '高级', '克制', '留白', '柔', '光晕', '渐变', '品牌'],
    tip: '呼吸周期不要低于 4s。快于 3s 会从「呼吸」变成「闪烁」，质感立刻掉一档。',
    params: [
      { key: 'speed', label: '呼吸周期', type: 'range', default: 5, min: 2, max: 12, step: 0.5, unit: 's' },
      { key: 'color1', label: '主光色', type: 'color', default: '#93c5fd' },
      { key: 'color2', label: '高光色', type: 'color', default: '#e2e8f0' },
      { key: 'thickness', label: '描边粗细', type: 'range', default: 1.5, min: 1, max: 4, step: 0.5, unit: 'px' },
      { key: 'radius', label: '圆角', type: 'range', default: 22, min: 8, max: 32, step: 1, unit: 'px' },
      { key: 'glow', label: '光晕强度', type: 'range', default: 0.6, min: 0, max: 1, step: 0.05, unit: '' },
    ],
    code: (p: Params) => ({
      tsx: `import './BorderFade.css'

export function BorderFadeCard() {
  return (
    <div className="fbx">
      <div className="fbx__inner">
        <span className="fbx__badge">SOFT</span>
        <h3>Aurora Pro</h3>
        <p className="fbx__price">¥128 <span>/ 月</span></p>
        <button className="fbx__cta">开始使用</button>
      </div>
    </div>
  )
}`,
      css: `.fbx {
  position: relative;
  width: 320px;
  padding: ${num(p.thickness, 1.5)}px;
  border-radius: ${num(p.radius, 22)}px;
  overflow: hidden;
  isolation: isolate;
}

/* 两端透明的斜向柔光 */
.fbx::before {
  content: '';
  position: absolute;
  inset: -30%;
  background: linear-gradient(
    125deg,
    transparent 12%,
    ${str(p.color1, '#93c5fd')} 36%,
    ${str(p.color2, '#e2e8f0')} 50%,
    ${str(p.color1, '#93c5fd')} 64%,
    transparent 88%
  );
  animation: fbx-breathe ${num(p.speed, 5)}s ease-in-out infinite;
}

/* 外圈大范围光晕，同样跟着呼吸 */
.fbx::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  filter: blur(30px);
  background: radial-gradient(60% 60% at 50% 50%, ${str(p.color1, '#93c5fd')}, transparent 72%);
  animation: fbx-halo ${num(p.speed, 5)}s ease-in-out infinite;
}

.fbx__inner {
  position: relative;
  padding: 24px;
  border-radius: ${Math.max(4, num(p.radius, 22) - num(p.thickness, 1.5))}px;
  background: #151a27;
  color: #f2f4f8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

@keyframes fbx-breathe {
  0%, 100% { opacity: ${(num(p.glow, 0.6) * 0.45).toFixed(2)}; }
  50% { opacity: ${(num(p.glow, 0.6) * 1.15).toFixed(2)}; }
}

@keyframes fbx-halo {
  0%, 100% { transform: scale(0.96); opacity: ${(num(p.glow, 0.6) * 0.55).toFixed(2)}; }
  50% { transform: scale(1.04); opacity: ${(num(p.glow, 0.6) * 1.05).toFixed(2)}; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 39 */
  {
    id: 'borderDust',
    index: 39,
    name: '粒子流光消散',
    en: 'Particle Dissolve',
    tagline: '光点沿边框奔跑，跑到尾部就散掉',
    description:
      '用 repeating-conic-gradient 把圆周切成等距的小点，再用同角度、同速度旋转的锥形遮罩让某一段圆弧渐隐。光点像跑进雾里一样消失，天然带「数据正在流动」的暗示，适合传输、推理、实时处理这类状态。',
    category: 'data',
    tags: ['边框', '粒子', '消散'],
    useCases: ['数据传输状态', 'AI 推理中', '实时监控大屏', '加载与处理中'],
    keywords: ['粒子', '光点', '消散', '边框', '数据', '流动', '传输', '加载', '处理中', '科技', '遮罩', '流光'],
    tip: '点间距 8°–14° 最舒服；渐隐遮罩不要短于 90°，否则光点会「啪」地消失，反而显得掉帧。',
    params: [
      { key: 'speed', label: '奔跑周期', type: 'range', default: 7, min: 2, max: 14, step: 0.5, unit: 's' },
      { key: 'gap', label: '粒子间距', type: 'range', default: 10, min: 6, max: 20, step: 1, unit: '°' },
      { key: 'thickness', label: '描边粗细', type: 'range', default: 2, min: 1, max: 5, step: 0.5, unit: 'px' },
      { key: 'radius', label: '圆角', type: 'range', default: 20, min: 8, max: 32, step: 1, unit: 'px' },
      { key: 'color1', label: '主粒子色', type: 'color', default: '#7dd3fc' },
      { key: 'color2', label: '辅粒子色', type: 'color', default: '#a5f3fc' },
      { key: 'glow', label: '外发光', type: 'range', default: 0.45, min: 0, max: 1, step: 0.05, unit: '' },
    ],
    code: (p: Params) => ({
      tsx: `import './BorderDust.css'

export function BorderDustCard() {
  return (
    <div className="dbx">
      <div className="dbx__inner">
        <span className="dbx__badge">DUST</span>
        <h3>Aurora Pro</h3>
        <p className="dbx__price">¥128 <span>/ 月</span></p>
        <button className="dbx__cta">开始使用</button>
      </div>
    </div>
  )
}`,
      css: `@property --a {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.dbx {
  --a: 0deg;
  --c1: ${str(p.color1, '#7dd3fc')};
  --c2: ${str(p.color2, '#a5f3fc')};
  position: relative;
  width: 320px;
  padding: ${num(p.thickness, 2)}px;
  border-radius: ${num(p.radius, 20)}px;
  overflow: hidden;
  isolation: isolate;
}

/* 等距光点 + 同速旋转的锥形遮罩：尾部渐隐 */
.dbx::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: repeating-conic-gradient(
    from var(--a),
    var(--c1) 0deg 1.7deg,
    transparent 1.7deg ${num(p.gap, 10)}deg
  );
  mask-image: conic-gradient(
    from calc(var(--a) - 30deg),
    transparent 0deg,
    #000 110deg,
    #000 250deg,
    transparent 360deg
  );
  animation: dbx-run ${num(p.speed, 7)}s linear infinite;
}

.dbx__inner {
  position: relative;
  padding: 24px;
  border-radius: ${Math.max(4, num(p.radius, 20) - num(p.thickness, 2))}px;
  background: #151a27;
  color: #f2f4f8;
}

@keyframes dbx-run {
  to { --a: 360deg; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 40 */
  {
    id: 'borderNebula',
    index: 40,
    name: '星云流光',
    en: 'Nebula Drift',
    tagline: '几团模糊的色云在边框里缓慢漂移',
    description:
      '三层不同尺寸的径向渐变色团，各自以不同的速度旋转、缩放，再用 blur 与 screen 混合叠在一起。因为没有清晰边界，边框读起来像「星云在玻璃后面流动」，适合需要氛围而不是锐利科技感的场景。',
    category: 'data',
    tags: ['边框', '星云', '氛围'],
    useCases: ['品牌故事页', '音乐与音频产品', '冥想与健康 App', '年度报告封面'],
    keywords: ['星云', '氛围', '朦胧', '色云', '边框', '梦幻', '艺术', '漂移', '柔', '渐变', '高级', '情绪'],
    tip: '色团之间要留出重叠，否则接缝会出现明显暗带；整体周期建议 ≥ 10s，慢才是「漂移」。',
    params: [
      { key: 'speed', label: '漂移周期', type: 'range', default: 12, min: 6, max: 24, step: 1, unit: 's' },
      { key: 'color1', label: '色团 1', type: 'color', default: '#3b82f6' },
      { key: 'color2', label: '色团 2', type: 'color', default: '#22d3ee' },
      { key: 'color3', label: '色团 3', type: 'color', default: '#f472b6' },
      { key: 'thickness', label: '描边粗细', type: 'range', default: 2, min: 1, max: 6, step: 0.5, unit: 'px' },
      { key: 'radius', label: '圆角', type: 'range', default: 22, min: 8, max: 32, step: 1, unit: 'px' },
      { key: 'glow', label: '外发光', type: 'range', default: 0.6, min: 0, max: 1, step: 0.05, unit: '' },
    ],
    code: (p: Params) => ({
      tsx: `import './BorderNebula.css'

export function BorderNebulaCard() {
  return (
    <div className="nbx2">
      <div className="nbx2__inner">
        <span className="nbx2__badge">NEBULA</span>
        <h3>Aurora Pro</h3>
        <p className="nbx2__price">¥128 <span>/ 月</span></p>
        <button className="nbx2__cta">开始使用</button>
      </div>
    </div>
  )
}`,
      css: `.nbx2 {
  position: relative;
  width: 320px;
  padding: ${num(p.thickness, 2)}px;
  border-radius: ${num(p.radius, 22)}px;
  overflow: hidden;
  isolation: isolate;
}

/* 三层色团叠在一起，模糊掉边界 */
.nbx2::before {
  content: '';
  position: absolute;
  inset: -25%;
  background:
    radial-gradient(58% 58% at 22% 24%, ${str(p.color1, '#3b82f6')}, transparent 68%),
    radial-gradient(52% 52% at 78% 32%, ${str(p.color2, '#22d3ee')}, transparent 68%),
    radial-gradient(62% 62% at 48% 88%, ${str(p.color3, '#f472b6')}, transparent 70%);
  filter: blur(7px) saturate(1.35);
  animation: nbx2-drift ${num(p.speed, 12)}s ease-in-out infinite alternate;
}

/* 外圈光晕，跟随漂移放大缩小 */
.nbx2::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background:
    radial-gradient(circle at 30% 30%, ${str(p.color1, '#3b82f6')}, transparent 60%),
    radial-gradient(circle at 70% 70%, ${str(p.color2, '#22d3ee')}, transparent 60%);
  filter: blur(30px);
  opacity: ${num(p.glow, 0.6)};
  animation: nbx2-halo ${num(p.speed, 12)}s ease-in-out infinite;
}

.nbx2__inner {
  position: relative;
  padding: 24px;
  border-radius: ${Math.max(4, num(p.radius, 22) - num(p.thickness, 2))}px;
  background: #151a27;
  color: #f2f4f8;
  box-shadow: inset 0 0 60px -24px ${str(p.color1, '#3b82f6')};
}

@keyframes nbx2-drift {
  0% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(28deg) scale(1.14); }
}

@keyframes nbx2-halo {
  0%, 100% { transform: scale(0.96); opacity: ${(num(p.glow, 0.6) * 0.6).toFixed(2)}; }
  50% { transform: scale(1.04); opacity: ${(num(p.glow, 0.6) * 1.05).toFixed(2)}; }
}`,
    }),
  },

  /* ---------------------------------------------------------------- 41 */
  {
    id: 'borderScan',
    index: 41,
    name: '扫描高光边框',
    en: 'Scan Highlight',
    tagline: '一道光带斜扫过边框，像设备自检',
    description:
      '把高光带做成一条锐利的线性渐变，用 background-position 让它从一角扫到另一角，并且只显示在边框区域；卡面再叠一条更暗的扫描线。它自带「正在识别 / 校验 / 加载」的语义，扫完停一拍，比一直扫更让人安心。',
    category: 'data',
    tags: ['边框', '扫描', '高光'],
    useCases: ['身份校验', '支付确认', '设备自检', 'AI 扫描与识别'],
    keywords: ['扫描', '高光', '边框', '校验', '识别', '加载', '光带', '自检', '斜扫', '科技', '一次性', '状态'],
    tip: '扫完要留一段静止时间（缓动的后 35%）。持续不停会制造焦虑，配合一次性的结果动效更自然。',
    params: [
      { key: 'speed', label: '扫描周期', type: 'range', default: 4, min: 1.5, max: 8, step: 0.5, unit: 's' },
      { key: 'thickness', label: '描边粗细', type: 'range', default: 1.5, min: 1, max: 4, step: 0.5, unit: 'px' },
      { key: 'radius', label: '圆角', type: 'range', default: 18, min: 8, max: 32, step: 1, unit: 'px' },
      { key: 'color1', label: '光带主色', type: 'color', default: '#60a5fa' },
      { key: 'color2', label: '光带辅色', type: 'color', default: '#22d3ee' },
      { key: 'glow', label: '外发光', type: 'range', default: 0.55, min: 0, max: 1, step: 0.05, unit: '' },
    ],
    code: (p: Params) => ({
      tsx: `import './BorderScan.css'

export function BorderScanCard() {
  return (
    <div className="sbx">
      <div className="sbx__inner">
        <span className="sbx__badge">SCAN</span>
        <h3>Aurora Pro</h3>
        <p className="sbx__price">¥128 <span>/ 月</span></p>
        <button className="sbx__cta">开始使用</button>
      </div>
    </div>
  )
}`,
      css: `.sbx {
  position: relative;
  width: 320px;
  padding: ${num(p.thickness, 1.5)}px;
  border-radius: ${num(p.radius, 18)}px;
  overflow: hidden;
  isolation: isolate;
}

/* 高光带：渐变做得很窄，靠位移扫过整圈 */
.sbx::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    104deg,
    transparent 34%,
    rgba(255, 255, 255, 0.16) 44%,
    #fff 49%,
    ${str(p.color1, '#60a5fa')} 52%,
    ${str(p.color2, '#22d3ee')} 57%,
    transparent 66%
  );
  background-size: 280% 100%;
  animation: sbx-sweep ${num(p.speed, 4)}s cubic-bezier(0.55, 0.05, 0.3, 0.95) infinite;
}

.sbx__inner {
  position: relative;
  padding: 24px;
  border-radius: ${Math.max(4, num(p.radius, 18) - num(p.thickness, 1.5))}px;
  background: #151a27;
  color: #f2f4f8;
}

/* 后 38% 保持静止，形成「扫完停一拍」的节奏 */
@keyframes sbx-sweep {
  0% { background-position: 140% 0; }
  62%, 100% { background-position: -40% 0; }
}`,
    }),
  },
]

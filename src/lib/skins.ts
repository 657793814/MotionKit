import { hexToRgba } from './utils'

/**
 * 一套皮肤 = 一组完整调色（surface 表面 token + accent 主色族），
 * 且分别给出 暗色 / 亮色 两种渲染，因此皮肤与主题是正交的两个维度：
 * 皮肤决定「气质」（配色性格），主题决定「明暗」。
 */
export interface SkinTokens {
  bg: string
  bgSoft: string
  panel: string
  panel2: string
  panel3: string
  line: string
  lineStrong: string
  text: string
  textSoft: string
  muted: string
  faint: string
  shadow: string
  accent: string
  accentBright: string
  accentSoft: string
  cyan: string
  emerald: string
  pink: string
}

export interface SkinPreset {
  id: string
  name: string
  en: string
  note: string
  /** 用于面板上的三联色卡 */
  swatch: [string, string, string]
  dark: SkinTokens
  light: SkinTokens
}

export type Theme = 'dark' | 'light'

/** 内置皮肤：全部基于「低饱和 + 单一主色 + 中性底色」的高级配色逻辑。 */
export const SKIN_PRESETS: SkinPreset[] = [
  {
    id: 'deepspace',
    name: '深空蓝',
    en: 'DEEP SPACE',
    note: '冷蓝主色配近黑蓝底，最稳妥的科技感',
    swatch: ['#3b82f6', '#22d3ee', '#0b0f1a'],
    dark: {
      bg: '#0b0f1a',
      bgSoft: '#101623',
      panel: '#141b2a',
      panel2: '#18202f',
      panel3: '#1f293c',
      line: 'rgba(255, 255, 255, 0.09)',
      lineStrong: 'rgba(255, 255, 255, 0.17)',
      text: '#f2f5fa',
      textSoft: '#c8d0de',
      muted: '#98a2b4',
      faint: '#6c7688',
      shadow: '0 40px 90px -50px rgba(0, 0, 0, 0.95)',
      accent: '#3b82f6',
      accentBright: '#93c5fd',
      accentSoft: 'rgba(59, 130, 246, 0.13)',
      cyan: '#22d3ee',
      emerald: '#34d399',
      pink: '#f472b6',
    },
    light: {
      bg: '#f2f5fb',
      bgSoft: '#e9eef7',
      panel: '#ffffff',
      panel2: '#f4f7fd',
      panel3: '#e8eef8',
      line: 'rgba(18, 25, 40, 0.09)',
      lineStrong: 'rgba(18, 25, 40, 0.16)',
      text: '#0f1524',
      textSoft: '#37415a',
      muted: '#5f6a82',
      faint: '#98a2b4',
      shadow: '0 30px 70px -45px rgba(30, 45, 80, 0.3)',
      accent: '#1d4ed8',
      accentBright: '#2563eb',
      accentSoft: 'rgba(29, 78, 216, 0.09)',
      cyan: '#0e7490',
      emerald: '#047857',
      pink: '#be185d',
    },
  },
  {
    id: 'obsidian',
    name: '曜石金',
    en: 'OBSIDIAN GOLD',
    note: '近黑曜石底 + 哑光金，克制的贵气',
    swatch: ['#d9a441', '#e8c98a', '#0d0c0a'],
    dark: {
      bg: '#0d0c0a',
      bgSoft: '#14120f',
      panel: '#171512',
      panel2: '#1d1a15',
      panel3: '#27221b',
      line: 'rgba(255, 243, 220, 0.1)',
      lineStrong: 'rgba(255, 243, 220, 0.18)',
      text: '#f7f1e6',
      textSoft: '#d9cdb8',
      muted: '#a99b84',
      faint: '#7b705d',
      shadow: '0 40px 90px -50px rgba(0, 0, 0, 0.95)',
      accent: '#d9a441',
      accentBright: '#f3d196',
      accentSoft: 'rgba(217, 164, 65, 0.14)',
      cyan: '#9dc6c0',
      emerald: '#93bd9a',
      pink: '#d99a86',
    },
    light: {
      bg: '#faf5ec',
      bgSoft: '#f3ebdd',
      panel: '#fffdf8',
      panel2: '#f9f3e8',
      panel3: '#efe5d4',
      line: 'rgba(58, 44, 20, 0.1)',
      lineStrong: 'rgba(58, 44, 20, 0.18)',
      text: '#1d1810',
      textSoft: '#4a3f2d',
      muted: '#6f6350',
      faint: '#a1947f',
      shadow: '0 30px 70px -45px rgba(80, 60, 20, 0.28)',
      accent: '#96701c',
      accentBright: '#b0861f',
      accentSoft: 'rgba(150, 112, 28, 0.1)',
      cyan: '#41766f',
      emerald: '#4b7a58',
      pink: '#9d5346',
    },
  },
  {
    id: 'celadon',
    name: '青瓷',
    en: 'CELADON',
    note: '青绿如玉，安静而清透的东方色',
    swatch: ['#34b394', '#7fd7cc', '#0a1210'],
    dark: {
      bg: '#0a1210',
      bgSoft: '#0f1917',
      panel: '#121e1b',
      panel2: '#16241f',
      panel3: '#1e302a',
      line: 'rgba(214, 255, 241, 0.09)',
      lineStrong: 'rgba(214, 255, 241, 0.16)',
      text: '#eef7f2',
      textSoft: '#c3d8ce',
      muted: '#93a9a0',
      faint: '#6a7d75',
      shadow: '0 40px 90px -50px rgba(0, 0, 0, 0.95)',
      accent: '#34b394',
      accentBright: '#86e0c4',
      accentSoft: 'rgba(52, 179, 148, 0.14)',
      cyan: '#6fd3d8',
      emerald: '#86d39a',
      pink: '#d9a7a0',
    },
    light: {
      bg: '#f2f7f4',
      bgSoft: '#e7f0ea',
      panel: '#ffffff',
      panel2: '#f3f8f5',
      panel3: '#e6efe9',
      line: 'rgba(20, 48, 38, 0.09)',
      lineStrong: 'rgba(20, 48, 38, 0.16)',
      text: '#0e1a16',
      textSoft: '#33473f',
      muted: '#5c7268',
      faint: '#93a69c',
      shadow: '0 30px 70px -45px rgba(20, 60, 45, 0.26)',
      accent: '#0f7f68',
      accentBright: '#129377',
      accentSoft: 'rgba(15, 127, 104, 0.09)',
      cyan: '#0e7490',
      emerald: '#1a7a4a',
      pink: '#a35366',
    },
  },
  {
    id: 'caramel',
    name: '焦糖',
    en: 'CARAMEL',
    note: '赤陶暖棕，像傍晚的日光落在纸上',
    swatch: ['#d97b4a', '#e8a97c', '#120e0c'],
    dark: {
      bg: '#120e0c',
      bgSoft: '#18130f',
      panel: '#1c1613',
      panel2: '#231b17',
      panel3: '#2e241d',
      line: 'rgba(255, 235, 222, 0.1)',
      lineStrong: 'rgba(255, 235, 222, 0.17)',
      text: '#f9f0e9',
      textSoft: '#dfcabc',
      muted: '#b09a8c',
      faint: '#82705f',
      shadow: '0 40px 90px -50px rgba(0, 0, 0, 0.95)',
      accent: '#d97b4a',
      accentBright: '#f0ab84',
      accentSoft: 'rgba(217, 123, 74, 0.15)',
      cyan: '#8fc0b6',
      emerald: '#97c08a',
      pink: '#e0938f',
    },
    light: {
      bg: '#faf4ef',
      bgSoft: '#f4eae1',
      panel: '#fffdfa',
      panel2: '#f9f1e9',
      panel3: '#f0e2d5',
      line: 'rgba(58, 35, 20, 0.1)',
      lineStrong: 'rgba(58, 35, 20, 0.17)',
      text: '#1e150f',
      textSoft: '#4c3a2c',
      muted: '#74604f',
      faint: '#a8927f',
      shadow: '0 30px 70px -45px rgba(90, 55, 30, 0.28)',
      accent: '#b4552a',
      accentBright: '#c4632f',
      accentSoft: 'rgba(180, 85, 42, 0.1)',
      cyan: '#3d7f78',
      emerald: '#4f7a3f',
      pink: '#a8504a',
    },
  },
  {
    id: 'sakura',
    name: '樱粉',
    en: 'SAKURA',
    note: '灰调玫瑰，比粉色成熟、比紫更柔和',
    swatch: ['#cf7090', '#f0a8bd', '#100d11'],
    dark: {
      bg: '#100d11',
      bgSoft: '#171218',
      panel: '#1b151c',
      panel2: '#221a24',
      panel3: '#2d2330',
      line: 'rgba(255, 235, 245, 0.1)',
      lineStrong: 'rgba(255, 235, 245, 0.17)',
      text: '#f8eff3',
      textSoft: '#dbc9d1',
      muted: '#ab97a0',
      faint: '#7d6b74',
      shadow: '0 40px 90px -50px rgba(0, 0, 0, 0.95)',
      accent: '#cf7090',
      accentBright: '#f0a8bd',
      accentSoft: 'rgba(207, 112, 144, 0.15)',
      cyan: '#93b9c9',
      emerald: '#8fbfa6',
      pink: '#ef92b0',
    },
    light: {
      bg: '#fbf4f6',
      bgSoft: '#f6eaee',
      panel: '#fffdfe',
      panel2: '#fbf1f4',
      panel3: '#f3e4e9',
      line: 'rgba(60, 25, 40, 0.09)',
      lineStrong: 'rgba(60, 25, 40, 0.16)',
      text: '#1c1117',
      textSoft: '#483039',
      muted: '#715761',
      faint: '#a08b94',
      shadow: '0 30px 70px -45px rgba(80, 35, 55, 0.26)',
      accent: '#a83a5c',
      accentBright: '#b84468',
      accentSoft: 'rgba(168, 58, 92, 0.09)',
      cyan: '#2f7488',
      emerald: '#3f7a5f',
      pink: '#b04a6a',
    },
  },
  {
    id: 'graphite',
    name: '石墨',
    en: 'GRAPHITE',
    note: '无彩灰阶 + 一点冷光，极简到底',
    swatch: ['#8b98ad', '#c9d3e2', '#0c0d0f'],
    dark: {
      bg: '#0c0d0f',
      bgSoft: '#121316',
      panel: '#16171a',
      panel2: '#1c1d21',
      panel3: '#26272c',
      line: 'rgba(255, 255, 255, 0.09)',
      lineStrong: 'rgba(255, 255, 255, 0.17)',
      text: '#f4f5f7',
      textSoft: '#c8cbd2',
      muted: '#9aa0aa',
      faint: '#6f747d',
      shadow: '0 40px 90px -50px rgba(0, 0, 0, 0.92)',
      accent: '#8b98ad',
      accentBright: '#d3dceb',
      accentSoft: 'rgba(139, 152, 173, 0.14)',
      cyan: '#a8bcc4',
      emerald: '#a9c0b3',
      pink: '#cbb0c4',
    },
    light: {
      bg: '#f5f6f8',
      bgSoft: '#eceef1',
      panel: '#ffffff',
      panel2: '#f6f7f9',
      panel3: '#e9ebef',
      line: 'rgba(20, 22, 28, 0.09)',
      lineStrong: 'rgba(20, 22, 28, 0.16)',
      text: '#12141a',
      textSoft: '#3a3f49',
      muted: '#626873',
      faint: '#9aa0aa',
      shadow: '0 30px 70px -45px rgba(20, 25, 35, 0.24)',
      accent: '#4a5568',
      accentBright: '#5c6879',
      accentSoft: 'rgba(74, 85, 104, 0.09)',
      cyan: '#4d6b73',
      emerald: '#4f6b5c',
      pink: '#7a5a68',
    },
  },
]

export const DEFAULT_SKIN_ID = 'deepspace'

export const getSkin = (id: string): SkinPreset =>
  SKIN_PRESETS.find((s) => s.id === id) ?? SKIN_PRESETS[0]

/** 向白（amount > 0）或向黑（amount < 0）偏移，非法值原样返回。 */
export function shiftHex(hex: string, amount: number): string {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return hex
  const target = amount >= 0 ? 255 : 0
  const t = Math.min(1, Math.abs(amount))
  const out = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16)
    return Math.round(v + (target - v) * t)
      .toString(16)
      .padStart(2, '0')
  })
  return `#${out.join('')}`
}

export const isValidHex = (v: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim())

/** 把一套 token 展开成 CSS 变量表。 */
function toVars(tokens: SkinTokens, accent?: string): Record<string, string> {
  const accentValue = accent && isValidHex(accent) ? accent : tokens.accent
  const overridden = accentValue !== tokens.accent
  return {
    '--bg': tokens.bg,
    '--bg-soft': tokens.bgSoft,
    '--panel': tokens.panel,
    '--panel-2': tokens.panel2,
    '--panel-3': tokens.panel3,
    '--line': tokens.line,
    '--line-strong': tokens.lineStrong,
    '--text': tokens.text,
    '--text-soft': tokens.textSoft,
    '--muted': tokens.muted,
    '--faint': tokens.faint,
    '--shadow-lg': tokens.shadow,
    '--accent': accentValue,
    '--accent-bright': overridden ? shiftHex(accentValue, -0.35) : tokens.accentBright,
    '--accent-soft': overridden ? hexToRgba(accentValue, 0.14) : tokens.accentSoft,
    '--cyan': tokens.cyan,
    '--emerald': tokens.emerald,
    '--pink': tokens.pink,
  }
}

/**
 * 应用皮肤：写入 data-skin / data-theme 并以内联变量覆盖整套 token。
 * 主题只决定取哪一套渲染；皮肤决定配色性格。
 * 同时写入 --sk-* 供 .dark-scope（动效画布）继承主色族，使演示区跟随皮肤。
 */
export function applySkin(skinId: string, theme: Theme = 'dark', accent?: string) {
  const root = document.documentElement
  const preset = getSkin(skinId)
  const mode = theme === 'light' ? preset.light : preset.dark
  const darkMode = preset.dark

  root.dataset.skin = preset.id
  root.dataset.theme = theme

  const vars = toVars(mode, accent)
  for (const [key, value] of Object.entries(vars)) root.style.setProperty(key, value)

  // 动效画布永远在深色底上渲染，因此主色族取该皮肤的深色版本
  const customAccent = accent && isValidHex(accent) ? accent : ''
  const demoAccent = customAccent || darkMode.accent
  root.style.setProperty('--sk-accent', demoAccent)
  root.style.setProperty(
    '--sk-accent-bright',
    customAccent ? shiftHex(customAccent, 0.35) : darkMode.accentBright,
  )
  root.style.setProperty(
    '--sk-accent-soft',
    customAccent ? hexToRgba(customAccent, 0.16) : darkMode.accentSoft,
  )
  root.style.setProperty('--sk-cyan', darkMode.cyan)
  root.style.setProperty('--sk-emerald', darkMode.emerald)
  root.style.setProperty('--sk-pink', darkMode.pink)
}

/** 面板预览：直接取一套 token（不写 DOM）。 */
export const skinTokens = (id: string, theme: Theme): SkinTokens =>
  theme === 'light' ? getSkin(id).light : getSkin(id).dark

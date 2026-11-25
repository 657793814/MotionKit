export type ParamType = 'range' | 'color' | 'select' | 'text' | 'number' | 'switch'

export interface ParamDef {
  key: string
  label: string
  type: ParamType
  default: string | number | boolean
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: { label: string; value: string }[]
  hint?: string
}

export type Params = Record<string, string | number | boolean>

export type CategoryId = 'pointer' | 'scroll' | 'text' | 'data' | 'base' | 'overlay' | 'component' | 'glass'

export interface CategoryDef {
  id: CategoryId | 'all'
  label: string
  desc: string
}

export interface EffectMeta {
  id: string
  index: number
  name: string
  en: string
  tagline: string
  description: string
  category: CategoryId
  tags: string[]
  useCases: string[]
  keywords: string[]
  params: ParamDef[]
  tip: string
  code: (p: Params) => { tsx: string; css: string }
}

export interface DemoProps {
  params: Params
  replay: number
  onParamChange?: (key: string, value: string | number | boolean) => void
  onReplay?: () => void
}

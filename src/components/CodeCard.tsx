import { useMemo, useState } from 'react'
import type { EffectMeta, Params } from '../lib/types'
import { useCopy } from '../lib/hooks'
import { IconCheck, IconCopy } from './Icons'

export default function CodeCard({ effect, params }: { effect: EffectMeta; params: Params }) {
  const [tab, setTab] = useState<'tsx' | 'css'>('tsx')
  const { copied, copy } = useCopy()
  const code = useMemo(() => effect.code(params), [effect, params])
  const value = tab === 'tsx' ? code.tsx : code.css
  const filename = `${effect.en.replace(/\s+/g, '')}.${tab === 'tsx' ? 'tsx' : 'css'}`

  return (
    <section className="code-card">
      <div className="code-card__head">
        <div className="code-tabs">
          <button
            type="button"
            className={tab === 'tsx' ? 'is-active' : ''}
            onClick={() => setTab('tsx')}
          >
            React
          </button>
          <button
            type="button"
            className={tab === 'css' ? 'is-active' : ''}
            onClick={() => setTab('css')}
          >
            CSS
          </button>
        </div>
        <span className="code-card__file">{filename}</span>
        <button
          type="button"
          className={'code-card__copy' + (copied ? ' is-copied' : '')}
          onClick={() => copy(value, '代码已复制')}
        >
          {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
          {copied ? '已复制' : '复制代码'}
        </button>
      </div>
      <div className="codeblock">
        <pre>
          <code>
            {value.split('\n').map((line, i) => (
              <span className="codeblock__line" key={i}>
                <i>{i + 1}</i>
                <b>{line || ' '}</b>
              </span>
            ))}
          </code>
        </pre>
      </div>
      <div className="code-card__foot">
        <span>React + 原生 CSS · 无第三方动画库</span>
        <span>支持 prefers-reduced-motion</span>
      </div>
    </section>
  )
}

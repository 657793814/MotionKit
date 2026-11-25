import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import BorderCard from './borderKit/BorderCard'

export default function BorderFlowDemo({ params }: DemoProps) {
  const speed = num(params.speed, 6)
  const thickness = num(params.thickness, 1.5)
  const radius = num(params.radius, 20)
  const glow = num(params.glow, 0.55)

  return (
    <BorderCard
      variant="flow"
      speed={speed}
      thickness={thickness}
      radius={radius}
      glow={glow}
      colors={[
        str(params.color1, '#3b82f6'),
        str(params.color2, '#22d3ee'),
        str(params.color3, '#34d399'),
        str(params.color4, '#f472b6'),
      ]}
      badge="FLOW"
      hint={`四色首尾相接 · 每 ${speed}s 绕一圈`}
    />
  )
}

import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import BorderCard from './borderKit/BorderCard'

export default function BorderNeonDemo({ params }: DemoProps) {
  const speed = num(params.speed, 5)
  const thickness = num(params.thickness, 1.5)
  const radius = num(params.radius, 20)
  const glow = num(params.glow, 0.7)

  return (
    <BorderCard
      variant="neon"
      speed={speed}
      thickness={thickness}
      radius={radius}
      glow={glow}
      colors={[str(params.color1, '#22d3ee'), str(params.color2, '#a855f7')]}
      badge="NEON"
      hint="只点亮约 60° 的弧段，其余保持暗线"
    />
  )
}

import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import BorderCard from './borderKit/BorderCard'

export default function BorderFadeDemo({ params }: DemoProps) {
  const speed = num(params.speed, 5)
  const thickness = num(params.thickness, 1.5)
  const radius = num(params.radius, 22)
  const glow = num(params.glow, 0.6)

  return (
    <BorderCard
      variant="fade"
      speed={speed}
      thickness={thickness}
      radius={radius}
      glow={glow}
      colors={[str(params.color1, '#93c5fd'), str(params.color2, '#e2e8f0')]}
      badge="SOFT"
      hint={`柔光两端淡出 · ${speed}s 一次呼吸`}
    />
  )
}

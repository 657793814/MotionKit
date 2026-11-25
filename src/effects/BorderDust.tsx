import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import BorderCard from './borderKit/BorderCard'

export default function BorderDustDemo({ params }: DemoProps) {
  const speed = num(params.speed, 7)
  const thickness = num(params.thickness, 2)
  const radius = num(params.radius, 20)
  const gap = num(params.gap, 10)
  const glow = num(params.glow, 0.45)

  return (
    <BorderCard
      variant="dust"
      speed={speed}
      thickness={thickness}
      radius={radius}
      gap={gap}
      glow={glow}
      colors={[str(params.color1, '#7dd3fc'), str(params.color2, '#a5f3fc')]}
      badge="DUST"
      hint={`粒子间距 ${gap}° · 尾部渐隐消散`}
    />
  )
}

import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import BorderCard from './borderKit/BorderCard'

export default function BorderNebulaDemo({ params }: DemoProps) {
  const speed = num(params.speed, 12)
  const thickness = num(params.thickness, 2)
  const radius = num(params.radius, 22)
  const glow = num(params.glow, 0.6)

  return (
    <BorderCard
      variant="nebula"
      speed={speed}
      thickness={thickness}
      radius={radius}
      glow={glow}
      colors={[
        str(params.color1, '#3b82f6'),
        str(params.color2, '#22d3ee'),
        str(params.color3, '#f472b6'),
        str(params.color4, '#34d399'),
      ]}
      badge="NEBULA"
      hint={`三层色团各自漂移 · ${speed}s 一轮`}
    />
  )
}

import type { DemoProps } from '../lib/types'
import { num, str } from '../lib/utils'
import BorderCard from './borderKit/BorderCard'

export default function BorderScanDemo({ params }: DemoProps) {
  const speed = num(params.speed, 4)
  const thickness = num(params.thickness, 1.5)
  const radius = num(params.radius, 18)
  const glow = num(params.glow, 0.55)

  return (
    <BorderCard
      variant="scan"
      speed={speed}
      thickness={thickness}
      radius={radius}
      glow={glow}
      colors={[str(params.color1, '#60a5fa'), str(params.color2, '#22d3ee')]}
      badge="SCAN"
      hint={`光带斜扫边框 · ${speed}s 一次`}
    />
  )
}

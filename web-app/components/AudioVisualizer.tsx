'use client'

interface AudioVisualizerProps {
  level: number
  isActive: boolean
}

export function AudioVisualizer({ level, isActive }: AudioVisualizerProps) {
  const bars = 5
  const heights = Array.from({ length: bars }, (_, i) => {
    const baseHeight = 20
    const maxHeight = 100
    const threshold = (i + 1) / bars
    if (level >= threshold - 0.15) {
      return baseHeight + (maxHeight - baseHeight) * level
    }
    return baseHeight
  })

  return (
    <div className="flex items-end justify-center gap-1 h-24">
      {heights.map((height, i) => (
        <div
          key={i}
          className={`w-3 rounded-full transition-all duration-75 ${
            isActive ? 'bg-blue-500' : 'bg-gray-600'
          }`}
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}

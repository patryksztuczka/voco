import { useEffect, useRef } from 'react'

interface WaveformProps {
  isRecording: boolean
  barCount?: number
}

export const Waveform = ({ isRecording, barCount = 24 }: WaveformProps) => {
  const barsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isRecording || !barsRef.current) return

    const bars = barsRef.current.children
    const intervals: NodeJS.Timeout[] = []

    // Animate each bar with random heights
    Array.from(bars).forEach((bar, i) => {
      const animate = () => {
        const height = Math.random() * 100
        ;(bar as HTMLElement).style.height = `${Math.max(15, height)}%`
      }

      // Stagger the animation start
      const interval = setInterval(animate, 80 + Math.random() * 40)
      intervals.push(interval)

      // Initial animation
      setTimeout(animate, i * 20)
    })

    return () => intervals.forEach(clearInterval)
  }, [isRecording])

  return (
    <div ref={barsRef} className="flex items-center justify-center gap-[3px] h-8 w-full">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-accent transition-all duration-75"
          style={{
            height: isRecording ? '30%' : '15%',
            opacity: isRecording ? 1 : 0.4
          }}
        />
      ))}
    </div>
  )
}

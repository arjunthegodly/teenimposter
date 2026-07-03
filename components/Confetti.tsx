'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useTheme } from './Providers'

interface ConfettiProps {
  trigger: boolean
  win?: boolean
}

const THEME_COLORS: Record<string, [string, string]> = {
  'dark-neon':      ['#8B5CF6', '#EC4899'],
  'gradient-glass': ['#D946EF', '#FBBF24'],
  'bold-bright':    ['#F97316', '#3B82F6'],
  'retro-y2k':      ['#FF0090', '#00FF41'],
  'sunset-vibe':    ['#FF6B9D', '#FFBA08'],
  'ocean-deep':     ['#00D4FF', '#00FFA3'],
  'candy-pop':      ['#E91E8C', '#7C3AED'],
  'rose-gold':      ['#C97060', '#B8860B'],
  'dark-academia':  ['#C8973A', '#A67C52'],
  'cyber-pulse':    ['#00C8FF', '#FF00CC'],
}

export function Confetti({ trigger, win = true }: ConfettiProps) {
  const { theme } = useTheme()

  useEffect(() => {
    if (!trigger) return

    const [primary, secondary] = THEME_COLORS[theme] ?? ['#8B5CF6', '#EC4899']
    const colors = [primary, secondary, '#FFFFFF', '#FFD700']

    if (win) {
      const burst = (opts?: confetti.Options) => {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.5 },
          colors,
          zIndex: 9999,
          ...opts,
        })
      }

      burst()
      const t1 = setTimeout(() => burst({ origin: { x: 0.25, y: 0.6 }, spread: 60 }), 250)
      const t2 = setTimeout(() => burst({ origin: { x: 0.75, y: 0.6 }, spread: 60 }), 500)

      return () => { clearTimeout(t1); clearTimeout(t2) }
    } else {
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.5 },
        colors: ['#6B7280', '#9CA3AF'],
        gravity: 1.2,
        zIndex: 9999,
      })
    }
  }, [trigger, win, theme])

  return null
}

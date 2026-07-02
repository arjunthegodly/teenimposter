'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiProps {
  trigger: boolean
}

export function Confetti({ trigger }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return

    const burst = () => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981'],
        zIndex: 9999,
      })
    }

    burst()
    const t1 = setTimeout(() => burst(), 300)
    const t2 = setTimeout(() => burst(), 600)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [trigger])

  return null
}

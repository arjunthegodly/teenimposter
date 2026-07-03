'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { haptics } from '@/lib/haptics'

interface CardFlipProps {
  front: React.ReactNode
  back: React.ReactNode
  onFlip?: () => void
}

export function CardFlip({ front, back, onFlip }: CardFlipProps) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => {
    if (flipped) return
    haptics.flip()
    setFlipped(true)
    onFlip?.()
  }

  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: '1200px', height: '280px' }}
      onClick={handleFlip}
    >
      {/* Front */}
      <motion.div
        className={`absolute inset-0 card flex flex-col items-center justify-center gap-4 p-6 ${!flipped ? 'card-interactive' : ''}`}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
      >
        {front}
      </motion.div>

      {/* Back */}
      <motion.div
        className="absolute inset-0 card flex flex-col items-center justify-center gap-4 p-6"
        initial={{ rotateY: -180 }}
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
      >
        {back}
      </motion.div>
    </div>
  )
}

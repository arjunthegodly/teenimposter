'use client'

import { motion } from 'framer-motion'

interface PassScreenProps {
  name: string
  onReady: () => void
  label?: string
}

export function PassScreen({ name, onReady, label = 'Tap when ready' }: PassScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-8 h-full min-h-80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-lg" style={{ color: 'var(--muted)' }}>Pass to</p>
        <h2
          className="text-4xl font-bold font-heading"
          style={{ color: 'var(--primary)' }}
        >
          {name}
        </h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Make sure only {name} can see the screen
        </p>
      </div>

      <button
        onClick={onReady}
        className="px-10 py-4 rounded-2xl text-xl font-bold font-heading glow-primary transition-transform active:scale-95"
        style={{ background: 'var(--primary)', color: '#fff' }}
      >
        {label} →
      </button>
    </motion.div>
  )
}

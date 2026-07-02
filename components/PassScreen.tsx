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
      className="flex flex-col items-center justify-center gap-8 min-h-80 py-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Avatar with initial */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold font-heading glow-primary flex-shrink-0"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col items-center gap-1">
          <p
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: 'var(--muted)' }}
          >
            Pass to
          </p>
          <h2
            className="text-5xl font-extrabold font-heading leading-tight"
            style={{ color: 'var(--foreground)' }}
          >
            {name}
          </h2>
        </div>

        <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Turn the screen away until {name} is ready
        </p>
      </div>

      {/* Divider */}
      <div className="w-12 h-px" style={{ background: 'var(--card-border)' }} />

      <button
        onClick={onReady}
        className="px-10 py-4 rounded-2xl text-lg font-bold font-heading glow-primary transition-transform active:scale-95"
        style={{ background: 'var(--primary)', color: '#fff' }}
      >
        {label} →
      </button>
    </motion.div>
  )
}

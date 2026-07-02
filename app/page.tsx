'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center px-6 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="text-7xl font-bold font-heading leading-none tracking-tight"
            style={{ color: 'var(--primary)' }}
          >
            Teen
          </div>
          <div
            className="text-7xl font-bold font-heading leading-none tracking-tight"
            style={{ color: 'var(--secondary)' }}
          >
            Imposter
          </div>
        </div>

        {/* Tagline */}
        <p className="text-lg" style={{ color: 'var(--muted)' }}>
          Can you blend in?
        </p>

        {/* CTA */}
        <Link
          href="/setup"
          className="w-full py-5 rounded-2xl text-xl font-bold font-heading text-center glow-primary transition-transform active:scale-95 mt-4"
          style={{ background: 'var(--primary)', color: '#fff', display: 'block' }}
        >
          Start Game
        </Link>

        {/* How to play */}
        <Link
          href="/how-to-play"
          className="text-sm transition-opacity hover:opacity-80"
          style={{ color: 'var(--muted)' }}
        >
          How to Play →
        </Link>
      </motion.div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative flex flex-col flex-1 items-center justify-center px-6 py-12 text-center overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 35%, var(--primary) 0%, transparent 70%)',
          opacity: 0.08,
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex flex-col items-center gap-7 w-full max-w-sm"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--muted)',
          }}
        >
          <span>😈</span>
          <span>Pass-and-play · No sign-up</span>
        </motion.div>

        {/* Logo */}
        <div className="flex flex-col items-center -gap-1">
          <div
            className="text-8xl font-extrabold font-heading leading-none tracking-tight"
            style={{ color: 'var(--primary)' }}
          >
            Teen
          </div>
          <div
            className="text-8xl font-extrabold font-heading leading-none tracking-tight"
            style={{ color: 'var(--secondary)' }}
          >
            Imposter
          </div>
        </div>

        {/* Tagline */}
        <p className="text-base leading-relaxed max-w-xs" style={{ color: 'var(--muted)' }}>
          Can you blend in?
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/setup"
            className="w-full py-5 rounded-2xl text-xl font-bold font-heading glow-primary transition-transform active:scale-95 flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            Start Game
            <ArrowRight size={20} />
          </Link>

          <Link
            href="/how-to-play"
            className="py-3.5 rounded-xl text-sm font-medium transition-all active:scale-95 hover:opacity-80"
            style={{
              color: 'var(--muted)',
              background: 'var(--card)',
              border: '1px solid var(--card-border)',
            }}
          >
            How to Play
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)', opacity: 0.7 }}>
          <span>7 themes</span>
          <span>·</span>
          <span>780+ words</span>
          <span>·</span>
          <span>3+ players</span>
        </div>
      </motion.div>
    </main>
  )
}

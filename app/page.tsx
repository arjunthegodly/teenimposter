'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '@/components/Providers'
import { themes } from '@/lib/theme-config'

const FEATURE_PILLS = [
  { label: '😈 Word Mode', desc: 'Give clues. Catch the imposter.' },
  { label: '❓ Question Mode', desc: 'Blind imposter. Social chaos.' },
  { label: '🦎 Chameleon', desc: 'Grid-based bluffing.' },
  { label: '⚖️ Last Stand', desc: '10 seconds to plead your case.' },
]

export default function Home() {
  const { theme: currentTheme } = useTheme()

  return (
    <main className="relative flex flex-col flex-1 items-center justify-center px-6 py-10 text-center overflow-hidden">
      {/* Background glow blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 30%, var(--primary) 0%, transparent 65%)',
          opacity: 0.07,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 80% 70%, var(--secondary) 0%, transparent 60%)',
          opacity: 0.05,
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex flex-col items-center gap-7 w-full max-w-sm"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.3 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--muted)',
          }}
        >
          <span>🎭</span>
          <span>Pass-and-play · No sign-up · Free</span>
        </motion.div>

        {/* Wordmark */}
        <div className="flex flex-col items-center" style={{ gap: '-4px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="text-8xl font-extrabold font-heading leading-none tracking-tighter"
            style={{ color: 'var(--primary)' }}
          >
            Teen
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="text-8xl font-extrabold font-heading leading-none tracking-tighter text-gradient"
          >
            Imposter
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-base leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          The social deduction game for{' '}
          <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>3+ players</span>.
          <br />
          One phone. Zero setup. Pure chaos.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {FEATURE_PILLS.map((pill) => (
            <div
              key={pill.label}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                color: 'var(--foreground)',
              }}
            >
              {pill.label}
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="flex flex-col gap-3 w-full"
        >
          <Link
            href="/setup"
            className="w-full py-5 rounded-2xl text-xl font-extrabold font-heading glow-primary transition-transform active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            Start Game
            <ArrowRight size={22} />
          </Link>

          <Link
            href="/how-to-play"
            className="py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{
              color: 'var(--muted)',
              background: 'var(--card)',
              border: '1px solid var(--card-border)',
            }}
          >
            How to Play
          </Link>
        </motion.div>

        {/* Theme dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-1.5">
            {themes.map(t => (
              <div
                key={t.id}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{
                  background: t.swatch,
                  opacity: t.id === currentTheme ? 1 : 0.35,
                  transform: t.id === currentTheme ? 'scale(1.35)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)', opacity: 0.55 }}>
            10 themes · 1,500+ prompts · 2 modes
          </p>
        </motion.div>
      </motion.div>
    </main>
  )
}

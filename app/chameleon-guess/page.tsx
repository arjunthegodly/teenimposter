'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { GameLayout } from '@/components/GameLayout'
import { tallyVotes, getVotedOut } from '@/lib/game-logic'
import { haptics } from '@/lib/haptics'

export default function ChameleonGuessPage() {
  const router = useRouter()
  const { config, round, submitChameleonGuess } = useGame()
  const [selected, setSelected] = useState<string | null>(null)
  const [phase, setPhase] = useState<'pass' | 'guess'>('pass')

  useEffect(() => {
    if (!config || !round) router.replace('/')
  }, [config, round, router])

  if (!config || !round || !round.wordGrid) return null

  const tally = tallyVotes(round.votes)
  const eligible = round.tiedPlayers.length > 0 ? round.tiedPlayers : config.players
  const votedOut = getVotedOut(tally, eligible)

  if (!votedOut) {
    router.replace('/results')
    return null
  }

  const handleGuess = () => {
    if (!selected) return
    haptics.confirm()
    submitChameleonGuess(selected)
  }

  if (phase === 'pass') {
    return (
      <GameLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center py-8"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
            style={{ background: 'var(--card-border)' }}
          >
            🦎
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--muted)' }}>
              Chameleon Escape
            </p>
            <h2 className="text-3xl font-extrabold font-heading" style={{ color: 'var(--secondary)' }}>
              {votedOut}
            </h2>
            <p className="text-base mt-2" style={{ color: 'var(--muted)' }}>
              was voted out
            </p>
          </div>
          <div className="card px-5 py-4 max-w-xs">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Hand the phone to{' '}
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>{votedOut}</span>.
              They can still win by guessing the secret word from the grid.
            </p>
          </div>
          <button
            onClick={() => { haptics.tap(); setPhase('guess') }}
            className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            I&apos;m Ready — Show Grid
          </button>
        </motion.div>
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-5"
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--muted)' }}>
            {votedOut}&apos;s final guess
          </p>
          <h2 className="text-2xl font-extrabold font-heading" style={{ color: 'var(--foreground)' }}>
            What was the secret word?
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Guess correctly and the Chameleon wins!
          </p>
        </div>

        <div
          className="card px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--muted)' }}
        >
          {round.subcategoryName}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {round.wordGrid.map(word => (
            <motion.button
              key={word}
              onClick={() => { haptics.tap(); setSelected(word) }}
              whileTap={{ scale: 0.93 }}
              className="py-3 px-1 rounded-xl text-center text-xs font-bold font-heading leading-tight transition-all"
              style={{
                background: selected === word ? 'var(--primary)' : 'var(--card)',
                border: `2px solid ${selected === word ? 'var(--primary)' : 'var(--card-border)'}`,
                color: selected === word ? '#fff' : 'var(--foreground)',
                boxShadow: selected === word ? `0 0 16px color-mix(in srgb, var(--primary) 50%, transparent)` : 'none',
                minHeight: '52px',
              }}
            >
              {word}
            </motion.button>
          ))}
        </div>

        <button
          onClick={handleGuess}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95 disabled:opacity-40"
          style={{ background: 'var(--secondary)', color: '#fff' }}
        >
          {selected ? `Lock in: ${selected} →` : 'Select a word'}
        </button>
      </motion.div>
    </GameLayout>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { haptics } from '@/lib/haptics'

interface VoteGridProps {
  players: string[]
  voter: string
  onVote: (votedFor: string) => void
  gameMode?: 'word' | 'question' | 'chameleon'
}

export function VoteGrid({ players, voter, onVote, gameMode = 'word' }: VoteGridProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const eligible = players.filter(p => p !== voter)

  const confirm = () => {
    if (selected) { haptics.confirm(); onVote(selected) }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>voting as</p>
        <h3 className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
          {voter}
        </h3>
        <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
          {gameMode === 'question'
            ? "Who had a different question?"
            : gameMode === 'chameleon'
            ? "Who is the Chameleon?"
            : "Who's the imposter?"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {eligible.map(p => (
          <motion.button
            key={p}
            onClick={() => { haptics.tap(); setSelected(p) }}
            whileTap={{ scale: 0.95 }}
            className="py-4 px-3 rounded-2xl text-center font-bold text-lg font-heading transition-all"
            style={{
              background: selected === p ? 'var(--primary)' : 'var(--card)',
              border: `2px solid ${selected === p ? 'var(--primary)' : 'var(--card-border)'}`,
              color: selected === p ? '#fff' : 'var(--foreground)',
              boxShadow: selected === p ? `0 0 20px color-mix(in srgb, var(--primary) 40%, transparent)` : 'none',
            }}
          >
            {p}
          </motion.button>
        ))}
      </div>

      <button
        onClick={confirm}
        disabled={!selected}
        className="w-full py-4 rounded-2xl font-bold text-lg font-heading transition-all active:scale-95 disabled:opacity-40"
        style={{ background: 'var(--secondary)', color: '#fff' }}
      >
        Confirm Vote →
      </button>
    </div>
  )
}

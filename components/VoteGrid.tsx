'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { haptics } from '@/lib/haptics'
import { Check } from 'lucide-react'

interface VoteGridProps {
  players: string[]
  voter: string
  onVote: (votedFor: string[]) => void
  gameMode?: 'word' | 'question' | 'chameleon'
}

export function VoteGrid({ players, voter, onVote, gameMode = 'word' }: VoteGridProps) {
  const [selected, setSelected] = useState<string[]>([])
  const eligible = players.filter(p => p !== voter)

  const toggle = (name: string) => {
    haptics.tap()
    setSelected(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    )
  }

  const confirm = () => {
    if (selected.length === 0) return
    haptics.confirm()
    onVote(selected)
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
            ? 'Select everyone who had a different question'
            : gameMode === 'chameleon'
            ? 'Select who you think is the Chameleon'
            : "Select everyone you suspect — most votes gets eliminated"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {eligible.map(p => {
          const isSelected = selected.includes(p)
          return (
            <motion.button
              key={p}
              onClick={() => toggle(p)}
              whileTap={{ scale: 0.95 }}
              className="py-4 px-3 rounded-2xl text-center font-bold text-lg font-heading transition-all relative"
              style={{
                background: isSelected ? 'var(--primary)' : 'var(--card)',
                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--card-border)'}`,
                color: isSelected ? '#fff' : 'var(--foreground)',
                boxShadow: isSelected ? `0 0 20px color-mix(in srgb, var(--primary) 40%, transparent)` : 'none',
              }}
            >
              {isSelected && (
                <span
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.25)' }}
                >
                  <Check size={11} strokeWidth={3} color="#fff" />
                </span>
              )}
              {p}
            </motion.button>
          )
        })}
      </div>

      {selected.length > 1 && (
        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          {selected.length} suspects selected
        </p>
      )}

      <button
        onClick={confirm}
        disabled={selected.length === 0}
        className="w-full py-4 rounded-2xl font-bold text-lg font-heading transition-all active:scale-95 disabled:opacity-40"
        style={{ background: 'var(--secondary)', color: '#fff' }}
      >
        {selected.length === 0
          ? 'Select at least one'
          : selected.length === 1
          ? `Vote for ${selected[0]} →`
          : `Vote for ${selected.length} players →`}
      </button>
    </div>
  )
}

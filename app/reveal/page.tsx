'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { CardFlip } from '@/components/CardFlip'
import { PassScreen } from '@/components/PassScreen'
import { GameLayout } from '@/components/GameLayout'
import { Eye, EyeOff } from 'lucide-react'

export default function RevealPage() {
  const router = useRouter()
  const { config, round, advanceReveal } = useGame()
  const [showingPass, setShowingPass] = useState(true)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!config || !round) router.replace('/')
  }, [config, round, router])

  if (!config || !round || round.phase !== 'reveal') return null

  const currentPlayer = config.players[round.revealIndex]
  const isImposter = round.imposters.includes(currentPlayer)
  const isLastPlayer = round.revealIndex === config.players.length - 1

  const handleReady = () => {
    setShowingPass(false)
    setFlipped(false)
  }

  const handleFlipped = () => {
    setFlipped(true)
  }

  const handleNext = () => {
    setShowingPass(true)
    setFlipped(false)
    advanceReveal()
  }

  const frontContent = (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--card-border)' }}>
        <Eye size={28} style={{ color: 'var(--muted)' }} />
      </div>
      <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>Tap to reveal</p>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>For {currentPlayer} only</p>
    </div>
  )

  const backContent = isImposter ? (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        className="text-5xl font-bold font-heading tracking-wider"
        style={{ color: 'var(--secondary)' }}
      >
        IMPOSTER
      </div>
      {config.imposterHint === 'pairedWord' && round.pairedWord && (
        <div className="flex flex-col items-center gap-1 mt-2">
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Your word</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{round.pairedWord}</p>
        </div>
      )}
      {config.imposterHint === 'hint' && round.hint && (
        <p className="text-sm max-w-xs text-center" style={{ color: 'var(--muted)' }}>{round.hint}</p>
      )}
      {config.imposterHint === 'category' && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{round.subcategoryName}</p>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
        {round.subcategoryName}
      </p>
      <div
        className="text-4xl font-bold font-heading"
        style={{ color: 'var(--primary)' }}
      >
        {round.word}
      </div>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Remember this word
      </p>
    </div>
  )

  return (
    <GameLayout>
      <div className="flex flex-col gap-6">
        {/* Progress */}
        <div className="flex gap-1">
          {config.players.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{
                background: i <= round.revealIndex ? 'var(--primary)' : 'var(--card-border)',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {showingPass ? (
            <PassScreen
              key="pass"
              name={currentPlayer}
              onReady={handleReady}
              label="I'm ready"
            />
          ) : (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center">
                <p className="text-lg font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                  {currentPlayer}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Cover the screen after reading
                </p>
              </div>

              <CardFlip
                front={frontContent}
                back={backContent}
                onFlip={handleFlipped}
              />

              {flipped && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl font-bold text-lg font-heading flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
                >
                  <EyeOff size={18} />
                  {isLastPlayer ? 'Start Game →' : `Pass to ${config.players[round.revealIndex + 1]} →`}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  )
}

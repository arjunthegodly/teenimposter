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

  const handleFlipped = () => setFlipped(true)

  const handleNext = () => {
    setShowingPass(true)
    setFlipped(false)
    advanceReveal()
  }

  const frontContent = (
    <div className="flex flex-col items-center gap-4 text-center">
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--card-border)' }}
      >
        <Eye size={30} style={{ color: 'var(--primary)' }} />
      </motion.div>
      <div>
        <p className="text-lg font-semibold font-heading" style={{ color: 'var(--foreground)' }}>
          Tap to reveal
        </p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          For {currentPlayer} only
        </p>
      </div>
    </div>
  )

  const backContent = isImposter ? (
    <div className="flex flex-col items-center gap-3 text-center w-full">
      <div
        className="text-6xl font-extrabold font-heading tracking-widest text-gradient leading-none"
      >
        IMPOSTER
      </div>
      <div
        className="w-12 h-0.5 rounded-full mt-1"
        style={{ background: 'var(--secondary)' }}
      />
      {config.imposterHint === 'pairedWord' && round.pairedWord && (
        <div className="flex flex-col items-center gap-1 mt-1">
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted)' }}>
            Your word
          </p>
          <p className="text-2xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
            {round.pairedWord}
          </p>
        </div>
      )}
      {config.imposterHint === 'hint' && round.hint && (
        <p className="text-sm max-w-xs leading-relaxed mt-1" style={{ color: 'var(--muted)' }}>
          {round.hint}
        </p>
      )}
      {config.imposterHint === 'category' && (
        <div className="flex flex-col items-center gap-1 mt-1">
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted)' }}>
            Category
          </p>
          <p className="text-lg font-semibold font-heading" style={{ color: 'var(--foreground)' }}>
            {round.subcategoryName}
          </p>
        </div>
      )}
      {config.imposterHint === 'nothing' && (
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          No hints — good luck
        </p>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-3 text-center">
      <p
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ color: 'var(--muted)' }}
      >
        {round.subcategoryName}
      </p>
      <div
        className="text-5xl font-extrabold font-heading leading-tight"
        style={{ color: 'var(--primary)' }}
      >
        {round.word}
      </div>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Remember this — don&apos;t say it out loud
      </p>
    </div>
  )

  return (
    <GameLayout>
      <div className="flex flex-col gap-6">
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {config.players.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i < round.revealIndex
                  ? 'var(--secondary)'
                  : i === round.revealIndex
                  ? 'var(--primary)'
                  : 'var(--card-border)',
              }}
            />
          ))}
        </div>

        {/* Player counter */}
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted)' }}>
            Player {round.revealIndex + 1} of {config.players.length}
          </p>
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
                <p className="text-xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                  {currentPlayer}
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
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
                  className="w-full py-4 rounded-2xl font-bold text-lg font-heading flex items-center justify-center gap-2 transition-all active:scale-95 glow-primary"
                  style={{
                    background: isLastPlayer ? 'var(--secondary)' : 'var(--primary)',
                    color: '#fff',
                  }}
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

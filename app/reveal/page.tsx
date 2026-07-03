'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { CardFlip } from '@/components/CardFlip'
import { PassScreen } from '@/components/PassScreen'
import { GameLayout } from '@/components/GameLayout'
import { Eye, EyeOff, MessageSquare } from 'lucide-react'
import { haptics } from '@/lib/haptics'

export default function RevealPage() {
  const router = useRouter()
  const { config, round, advanceReveal } = useGame()
  const [showingPass, setShowingPass] = useState(true)
  const [flipped, setFlipped] = useState(false)
  const [answer, setAnswer] = useState('')
  const redirected = useRef(false)

  useEffect(() => {
    if (redirected.current) return
    const t = setTimeout(() => {
      if (!config || !round) {
        redirected.current = true
        router.replace('/')
      }
    }, 120)
    return () => clearTimeout(t)
  }, [config, round, router])

  if (!config || !round || round.phase !== 'reveal') return null

  const isQuestionMode = config.gameMode === 'question'
  const isChameleonMode = config.gameMode === 'chameleon'
  const currentPlayer = config.players[round.revealIndex]
  const isImposter = round.imposters.includes(currentPlayer)
  const isLastPlayer = round.revealIndex === config.players.length - 1

  const handleReady = () => {
    setShowingPass(false)
    setFlipped(false)
    setAnswer('')
  }

  const handleFlipped = () => {
    haptics.flip()
    setFlipped(true)
  }

  const handleNext = () => {
    haptics.tap()
    setShowingPass(true)
    setFlipped(false)
    setAnswer('')
    advanceReveal()
  }

  // Question mode: "Next" only enabled after writing an answer
  const canProceedQuestion = !isQuestionMode || answer.trim().length > 0

  const frontContent = (
    <div className="flex flex-col items-center gap-4 text-center">
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--card-border)' }}
      >
        {isQuestionMode
          ? <MessageSquare size={30} style={{ color: 'var(--primary)' }} />
          : isChameleonMode
          ? <span style={{ fontSize: 28 }}>🦎</span>
          : <Eye size={30} style={{ color: 'var(--primary)' }} />
        }
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

  // Question mode: show just the question in the card (clean, no height issues)
  const questionModeBack = (
    <div className="flex flex-col items-center gap-4 text-center w-full">
      <p
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ color: 'var(--muted)' }}
      >
        {round.subcategoryName}
      </p>
      <div
        className="text-xl font-bold font-heading leading-snug px-2"
        style={{ color: 'var(--foreground)' }}
      >
        {isImposter ? round.pairedWord : round.word}
      </div>
      <p className="text-xs" style={{ color: 'var(--muted)' }}>
        Think of your answer — write it below before passing
      </p>
    </div>
  )

  const wordModeBack = isImposter ? (
    <div className="flex flex-col items-center gap-3 text-center w-full">
      <div className="text-6xl font-extrabold font-heading tracking-widest text-gradient leading-none">
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

  // Chameleon mode: civilians see grid with secret word glowing, chameleon sees plain grid
  const chameleonModeBack = round.wordGrid ? (
    <div className="flex flex-col items-center gap-3 text-center w-full">
      <p
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ color: isImposter ? 'var(--secondary)' : 'var(--muted)' }}
      >
        {isImposter ? '🦎 You are the Chameleon' : round.subcategoryName}
      </p>
      {isImposter && (
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Blend in. Listen to clues and guess the secret word before you get caught.
        </p>
      )}
      <div className="grid grid-cols-4 gap-1.5 w-full">
        {round.wordGrid.map(word => {
          const isSecret = !isImposter && word === round.word
          return (
            <div
              key={word}
              className="py-2 px-1 rounded-lg text-center font-bold leading-tight"
              style={{
                background: isSecret ? 'var(--primary)' : 'var(--card-border)',
                color: isSecret ? '#fff' : 'var(--foreground)',
                fontSize: '9px',
                boxShadow: isSecret ? `0 0 12px color-mix(in srgb, var(--primary) 60%, transparent)` : 'none',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {word}
            </div>
          )
        })}
      </div>
      {!isImposter && (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Give a clue without saying the highlighted word
        </p>
      )}
    </div>
  ) : null

  const backContent = isQuestionMode
    ? questionModeBack
    : isChameleonMode
    ? (chameleonModeBack ?? wordModeBack)
    : wordModeBack

  return (
    <GameLayout>
      <div className="flex flex-col gap-6">
        {/* Progress bar */}
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

        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted)' }}>
            Player {round.revealIndex + 1} of {config.players.length}
          </p>
          {isQuestionMode && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              ❓ Question Mode
            </span>
          )}
          {isChameleonMode && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--secondary)', color: '#fff' }}
            >
              🦎 Chameleon
            </span>
          )}
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
                  {isQuestionMode
                    ? 'Read your question and write your answer below'
                    : isChameleonMode
                    ? 'Study the grid — cover the screen after'
                    : 'Cover the screen after reading'}
                </p>
              </div>

              <CardFlip
                front={frontContent}
                back={backContent}
                onFlip={handleFlipped}
              />

              {flipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3"
                >
                  {isQuestionMode && (
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: 'var(--muted)' }}
                      >
                        Your answer
                      </label>
                      <input
                        type="text"
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Write it here..."
                        className="w-full px-4 py-3 rounded-xl text-base outline-none font-medium"
                        style={{
                          background: 'var(--card)',
                          border: `1px solid ${answer.trim() ? 'var(--primary)' : 'var(--card-border)'}`,
                          color: 'var(--foreground)',
                        }}
                        autoComplete="off"
                        autoCapitalize="sentences"
                      />
                    </div>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!canProceedQuestion}
                    className="w-full py-4 rounded-2xl font-bold text-lg font-heading flex items-center justify-center gap-2 transition-all active:scale-95 glow-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: isLastPlayer ? 'var(--secondary)' : 'var(--primary)',
                      color: '#fff',
                    }}
                  >
                    <EyeOff size={18} />
                    {isLastPlayer ? 'Start Game →' : `Pass to ${config.players[round.revealIndex + 1]} →`}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { Timer } from '@/components/Timer'
import { GameLayout } from '@/components/GameLayout'
import { SkipForward, ArrowRight, Trophy, X } from 'lucide-react'

export default function GamePage() {
  const router = useRouter()
  const { config, round, advanceSpeaker, startVoting, sessionScores } = useGame()
  const [showScores, setShowScores] = useState(false)
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

  if (!config || !round || round.phase !== 'clue') return null

  const isQuestionMode = config.gameMode === 'question'
  const isChameleonMode = config.gameMode === 'chameleon'
  const isSpeedRound = config.speedRound.enabled
  const speedDuration = config.speedRound.duration
  const hasOverallTimer = config.timer.enabled
  const currentSpeaker = isSpeedRound ? config.players[round.speakerIndex] : null

  const handleTimerExpire = () => {
    if (isSpeedRound) advanceSpeaker()
  }

  return (
    <GameLayout>
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1
              className="text-3xl font-extrabold font-heading"
              style={{ color: 'var(--foreground)' }}
            >
              {isQuestionMode ? 'Share your answers' : isChameleonMode ? 'Give clues from the grid' : 'Give your clues'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {isSpeedRound
                ? `⚡ Speed round — ${speedDuration}s per player`
                : isQuestionMode
                ? 'Take turns sharing your answer — try to sound like everyone else'
                : isChameleonMode
                ? 'Give a clue from the grid — Chameleon is bluffing without knowing the word'
                : 'One clue each, no repeating what others said'}
            </p>
          </div>
          {Object.keys(sessionScores).length > 0 && (
            <button
              onClick={() => setShowScores(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-90"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}
            >
              <Trophy size={12} style={{ color: 'var(--secondary)' }} />
              Scores
            </button>
          )}
        </div>

        {/* Scores modal */}
        <AnimatePresence>
          {showScores && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setShowScores(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="w-full max-w-md p-5 rounded-t-3xl flex flex-col gap-4"
                style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold font-heading text-lg" style={{ color: 'var(--foreground)' }}>
                    🏆 Session Scores
                  </p>
                  <button onClick={() => setShowScores(false)} style={{ color: 'var(--muted)' }}>
                    <X size={18} />
                  </button>
                </div>
                {config.players
                  .slice()
                  .sort((a, b) => (sessionScores[b] ?? 0) - (sessionScores[a] ?? 0))
                  .map((player, i) => {
                    const pts = sessionScores[player] ?? 0
                    const maxPts = Math.max(...config.players.map(p => sessionScores[p] ?? 0), 1)
                    const isLeader = pts === maxPts && pts > 0
                    return (
                      <div key={player} className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: isLeader ? 'var(--secondary)' : 'var(--card-border)',
                            color: isLeader ? '#fff' : 'var(--muted)',
                          }}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1 font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                          {player}{isLeader ? ' 👑' : ''}
                        </span>
                        <span
                          className="font-bold text-sm font-heading"
                          style={{ color: isLeader ? 'var(--secondary)' : 'var(--primary)' }}
                        >
                          {pts} pt{pts !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )
                  })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode reminder */}
        {isQuestionMode && (
          <div
            className="card px-4 py-3 flex gap-2 items-center"
            style={{ borderColor: 'var(--primary)' }}
          >
            <span style={{ color: 'var(--primary)', fontSize: '16px' }}>🕵️</span>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Someone answered a different question — find out who sounds off
            </p>
          </div>
        )}
        {isChameleonMode && (
          <div
            className="card px-4 py-3 flex gap-2 items-center"
            style={{ borderColor: 'var(--secondary)' }}
          >
            <span style={{ fontSize: '16px' }}>🦎</span>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              One player has the same grid but doesn&apos;t know the secret word
            </p>
          </div>
        )}

        {/* Overall timer */}
        {hasOverallTimer && !isSpeedRound && (
          <div className="card p-5">
            <Timer seconds={config.timer.duration} onExpire={startVoting} />
          </div>
        )}

        {/* Speed round — current speaker + timer */}
        {isSpeedRound && currentSpeaker && (
          <div className="card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--muted)' }}>
                  Now speaking
                </p>
                <p className="text-2xl font-extrabold font-heading mt-0.5" style={{ color: 'var(--primary)' }}>
                  {currentSpeaker}
                </p>
              </div>
              <button
                onClick={advanceSpeaker}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all active:scale-95 font-medium"
                style={{ background: 'var(--card-border)', color: 'var(--muted)' }}
              >
                <SkipForward size={12} />
                Skip
              </button>
            </div>
            <Timer
              key={`${round.speakerIndex}`}
              seconds={speedDuration}
              onExpire={handleTimerExpire}
            />
          </div>
        )}

        {/* Player order list */}
        <div className="card overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--muted)' }}>
              {isQuestionMode ? 'Answer order' : isChameleonMode ? 'Clue order' : 'Player order'}
            </p>
          </div>
          <div className="flex flex-col px-2 pb-2">
            {config.players.map((player, i) => {
              const isActive = isSpeedRound && i === round.speakerIndex
              const isDone = isSpeedRound && i < round.speakerIndex

              return (
                <motion.div
                  key={player}
                  layout
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                  style={{
                    background: isActive ? 'var(--primary)' : 'transparent',
                  }}
                >
                  <span
                    className="text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{
                      background: isActive
                        ? 'rgba(255,255,255,0.2)'
                        : isDone
                        ? 'var(--secondary)'
                        : 'var(--card-border)',
                      color: isActive || isDone ? '#fff' : 'var(--muted)',
                      fontSize: '10px',
                    }}
                  >
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span
                    className="font-semibold flex-1"
                    style={{ color: isActive ? '#fff' : 'var(--foreground)' }}
                  >
                    {player}
                  </span>
                  {isActive && (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                    >
                      speaking
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Start voting */}
        <button
          onClick={startVoting}
          className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{ background: 'var(--secondary)', color: '#fff' }}
        >
          Start Voting
          <ArrowRight size={20} />
        </button>
      </div>
    </GameLayout>
  )
}

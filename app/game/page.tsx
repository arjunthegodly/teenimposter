'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { Timer } from '@/components/Timer'
import { GameLayout } from '@/components/GameLayout'
import { SkipForward, ArrowRight } from 'lucide-react'

export default function GamePage() {
  const router = useRouter()
  const { config, round, advanceSpeaker, startVoting } = useGame()

  useEffect(() => {
    if (!config || !round) router.replace('/')
  }, [config, round, router])

  if (!config || !round || round.phase !== 'clue') return null

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
        <div>
          <h1
            className="text-3xl font-extrabold font-heading"
            style={{ color: 'var(--foreground)' }}
          >
            Give your clues
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {isSpeedRound
              ? `⚡ Speed round — ${speedDuration}s per player`
              : 'One clue each, no repeating what others said'}
          </p>
        </div>

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
              Player order
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

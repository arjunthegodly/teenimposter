'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { Timer } from '@/components/Timer'
import { GameLayout } from '@/components/GameLayout'
import { SkipForward } from 'lucide-react'

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
    if (isSpeedRound) {
      advanceSpeaker()
    }
  }

  return (
    <GameLayout>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
            Give your clues!
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {isSpeedRound ? 'Speed round — each player has ' + speedDuration + 's' : 'Take turns giving one clue each'}
          </p>
        </div>

        {/* Overall timer */}
        {hasOverallTimer && !isSpeedRound && (
          <Timer
            seconds={config.timer.duration}
            onExpire={startVoting}
          />
        )}

        {/* Speed round per-player timer */}
        {isSpeedRound && currentSpeaker && (
          <div className="card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Now speaking</p>
              <button
                onClick={advanceSpeaker}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-all active:scale-95"
                style={{ background: 'var(--card-border)', color: 'var(--muted)' }}
              >
                <SkipForward size={12} />
                Skip
              </button>
            </div>
            <p className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
              {currentSpeaker}
            </p>
            <Timer
              key={`${round.speakerIndex}`}
              seconds={speedDuration}
              onExpire={handleTimerExpire}
            />
          </div>
        )}

        {/* Player order */}
        <div className="card p-4 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
            Player order
          </p>
          {config.players.map((player, i) => {
            const isActive = isSpeedRound && i === round.speakerIndex
            return (
              <motion.div
                key={player}
                layout
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: isActive ? 'var(--primary)' : 'transparent',
                }}
              >
                <span
                  className="text-xs w-5 text-center"
                  style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-medium"
                  style={{ color: isActive ? '#fff' : 'var(--foreground)' }}
                >
                  {player}
                </span>
                {isActive && (
                  <span className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    speaking
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Start voting */}
        <button
          onClick={startVoting}
          className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95"
          style={{ background: 'var(--secondary)', color: '#fff' }}
        >
          Start Voting →
        </button>
      </div>
    </GameLayout>
  )
}

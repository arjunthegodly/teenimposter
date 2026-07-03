'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { GameLayout } from '@/components/GameLayout'
import { tallyVotes, getVotedOut } from '@/lib/game-logic'
import { ArrowRight } from 'lucide-react'

const DEFENSE_SECONDS = 10

export default function LastStandPage() {
  const router = useRouter()
  const { config, round } = useGame()
  const [timeLeft, setTimeLeft] = useState(DEFENSE_SECONDS)
  const [phase, setPhase] = useState<'pass' | 'defense' | 'done'>('pass')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!config || !round) router.replace('/')
  }, [config, round, router])

  useEffect(() => {
    if (phase === 'defense') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!)
            setPhase('done')
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [phase])

  if (!config || !round) return null

  const tally = tallyVotes(round.votes)
  const eligible = round.tiedPlayers.length > 0 ? round.tiedPlayers : config.players
  const votedOut = getVotedOut(tally, eligible)

  if (!votedOut) {
    router.replace('/results')
    return null
  }

  const pct = (timeLeft / DEFENSE_SECONDS) * 100
  const isUrgent = timeLeft <= 3

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
            ⚖️
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--muted)' }}>
              Last Stand
            </p>
            <h2 className="text-3xl font-extrabold font-heading" style={{ color: 'var(--secondary)' }}>
              {votedOut}
            </h2>
            <p className="text-base mt-2" style={{ color: 'var(--muted)' }}>
              was voted out
            </p>
          </div>
          <div className="card px-5 py-4 text-center max-w-xs">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Hand the phone to{' '}
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>{votedOut}</span>.
              You have <span className="font-bold" style={{ color: 'var(--primary)' }}>10 seconds</span> to
              convince everyone you&apos;re innocent.
            </p>
          </div>
          <button
            onClick={() => setPhase('defense')}
            className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            I&apos;m Ready — Start Timer
          </button>
        </motion.div>
      </GameLayout>
    )
  }

  if (phase === 'defense') {
    return (
      <GameLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6 text-center py-6"
        >
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--muted)' }}>
              Last Stand
            </p>
            <h2 className="text-3xl font-extrabold font-heading" style={{ color: 'var(--foreground)' }}>
              {votedOut}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              Make your case
            </p>
          </div>

          {/* Timer ring */}
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--card-border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={isUrgent ? 'var(--secondary)' : 'var(--primary)'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-extrabold font-heading"
                style={{ color: isUrgent ? 'var(--secondary)' : 'var(--primary)' }}
              >
                {timeLeft}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>seconds</span>
            </div>
          </div>

          <div className="card px-5 py-4 text-center max-w-xs w-full">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              Speak up! Everyone is listening. Convince them you&apos;re not the imposter.
            </p>
          </div>
        </motion.div>
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 text-center py-8"
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background: 'var(--card-border)' }}
        >
          🎭
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--muted)' }}>
            Time&apos;s up
          </p>
          <h2 className="text-3xl font-extrabold font-heading" style={{ color: 'var(--foreground)' }}>
            {votedOut} had their say
          </h2>
          <p className="text-base mt-2" style={{ color: 'var(--muted)' }}>
            Now find out the truth
          </p>
        </div>
        <button
          onClick={() => router.push('/results')}
          className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{ background: 'var(--secondary)', color: '#fff' }}
        >
          Reveal Imposter
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </GameLayout>
  )
}

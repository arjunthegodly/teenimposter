'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { Confetti } from '@/components/Confetti'
import { GameLayout } from '@/components/GameLayout'
import { tallyVotes, getVotedOut } from '@/lib/game-logic'
import { ArrowRight, RotateCcw, Settings, Home } from 'lucide-react'

export default function ResultsPage() {
  const router = useRouter()
  const { config, round, startRound, resetGame, wordsExhausted } = useGame()

  useEffect(() => {
    if (!config || !round) router.replace('/')
  }, [config, round, router])

  if (!config || !round) return null

  const tally = tallyVotes(round.votes)
  const votedOut = getVotedOut(tally, round.tiedPlayers.length > 0 ? round.tiedPlayers : config.players)
  const votedOutIsImposter = votedOut ? round.imposters.includes(votedOut) : false
  const allImposters = round.imposters.length === config.players.length
  const civilianWord = round.word
  const imposterWord = round.pairedWord
  const sortedTally = [...tally.entries()].sort(([, a], [, b]) => b - a)
  const maxVotes = sortedTally[0]?.[1] ?? 1

  const outcomeLabel = allImposters
    ? '🤯 All Imposters'
    : votedOutIsImposter
    ? '🎉 Civilians Win'
    : '😈 Imposter Wins'

  const imposterLabel = allImposters
    ? 'Every player was an imposter'
    : round.imposters.length === 1
    ? `${round.imposters[0]} was the imposter`
    : `${round.imposters.join(' & ')} were the imposters`

  return (
    <GameLayout>
      <Confetti trigger={true} />

      <div className="flex flex-col gap-5 pb-4">

        {/* Outcome banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="card p-6 text-center flex flex-col gap-3"
        >
          <div className="text-4xl font-extrabold font-heading leading-tight text-gradient">
            {outcomeLabel}
          </div>

          <p
            className="text-lg font-bold font-heading mt-1"
            style={{ color: 'var(--foreground)' }}
          >
            {imposterLabel}
          </p>

          {votedOut && (
            <div
              className="pt-3 text-sm"
              style={{ borderTop: '1px solid var(--card-border)', color: 'var(--muted)' }}
            >
              {votedOut} was voted out
            </div>
          )}
        </motion.div>

        {/* Words revealed */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5 flex flex-col gap-4"
        >
          <div>
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-1.5"
              style={{ color: 'var(--muted)' }}
            >
              {allImposters ? 'The word nobody knew' : 'Civilians had'}
            </p>
            <p className="text-3xl font-extrabold font-heading" style={{ color: 'var(--secondary)' }}>
              {civilianWord}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {round.subcategoryName}
            </p>
          </div>

          {imposterWord && (
            <div
              className="pt-4"
              style={{ borderTop: '1px solid var(--card-border)' }}
            >
              <p
                className="text-xs uppercase tracking-widest font-semibold mb-1.5"
                style={{ color: 'var(--muted)' }}
              >
                Imposters had
              </p>
              <p className="text-3xl font-extrabold font-heading" style={{ color: 'var(--primary)' }}>
                {imposterWord}
              </p>
            </div>
          )}
        </motion.div>

        {/* Vote breakdown */}
        {sortedTally.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card p-5 flex flex-col gap-4"
          >
            <p
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: 'var(--muted)' }}
            >
              Vote breakdown
            </p>
            {sortedTally.map(([player, votes], i) => {
              const isTop = player === votedOut
              return (
                <div key={player} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-sm">
                    <span
                      className="font-semibold"
                      style={{ color: isTop ? 'var(--secondary)' : 'var(--foreground)' }}
                    >
                      {player}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>{votes}</span>
                  </div>
                  <div
                    className="h-4 rounded-full overflow-hidden"
                    style={{ background: 'var(--card-border)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(votes / maxVotes) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: isTop ? 'var(--secondary)' : 'var(--primary)' }}
                    />
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col gap-2.5 pt-1"
        >
          {wordsExhausted ? (
            <button
              onClick={() => { resetGame(); router.push('/setup') }}
              className="w-full py-4 rounded-2xl font-bold text-base font-heading transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
            >
              <RotateCcw size={16} />
              All words used — reshuffle
            </button>
          ) : (
            <button
              onClick={() => startRound()}
              className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              Play Again
              <ArrowRight size={20} />
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => { resetGame(); router.push('/setup') }}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm font-heading transition-all active:scale-95 flex items-center justify-center gap-1.5"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}
            >
              <Settings size={14} />
              Change Settings
            </button>

            <button
              onClick={() => { resetGame(); router.push('/') }}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm font-heading transition-all active:scale-95 flex items-center justify-center gap-1.5"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--muted)' }}
            >
              <Home size={14} />
              Home
            </button>
          </div>
        </motion.div>
      </div>
    </GameLayout>
  )
}

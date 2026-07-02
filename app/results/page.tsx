'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { Confetti } from '@/components/Confetti'
import { GameLayout } from '@/components/GameLayout'
import { tallyVotes, getVotedOut } from '@/lib/game-logic'

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

  return (
    <GameLayout>
      <Confetti trigger={true} />

      <div className="flex flex-col gap-6">
        {/* Result banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="card p-6 text-center"
        >
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
            {allImposters ? '🤯 Everyone was an imposter!' : votedOutIsImposter ? '🎉 Civilians win!' : '😈 Imposter wins!'}
          </p>
          <p className="text-lg mb-1" style={{ color: 'var(--muted)' }}>
            {votedOut ? `${votedOut} was voted out` : 'No one was voted out'}
          </p>
          <div className="text-2xl font-bold font-heading mt-3" style={{ color: 'var(--primary)' }}>
            {allImposters
              ? 'Every player was an imposter'
              : round.imposters.length === 1
                ? `${round.imposters[0]} was the imposter`
                : `${round.imposters.join(' & ')} were the imposters`}
          </div>
        </motion.div>

        {/* Words revealed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 flex flex-col gap-3"
        >
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
              {allImposters ? 'The word nobody knew' : 'Civilians had'}
            </p>
            <p className="text-2xl font-bold font-heading" style={{ color: 'var(--secondary)' }}>
              {civilianWord}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {round.subcategoryName}
            </p>
          </div>
          {imposterWord && (
            <div className="pt-3" style={{ borderTop: '1px solid var(--card-border)' }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>
                Imposters had
              </p>
              <p className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
                {imposterWord}
              </p>
            </div>
          )}
        </motion.div>

        {/* Vote breakdown */}
        {sortedTally.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-5 flex flex-col gap-3"
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              Vote breakdown
            </p>
            {sortedTally.map(([player, votes]) => (
              <div key={player} className="flex items-center gap-3">
                <span className="text-sm font-medium w-20 truncate" style={{ color: 'var(--foreground)' }}>
                  {player}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(votes / config.players.length) * 100}%`,
                      background: 'var(--primary)',
                    }}
                  />
                </div>
                <span className="text-sm w-6 text-right" style={{ color: 'var(--muted)' }}>
                  {votes}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 pt-2"
        >
          {wordsExhausted ? (
            <button
              onClick={() => { resetGame(); router.push('/setup') }}
              className="w-full py-4 rounded-2xl font-bold text-lg font-heading transition-all active:scale-95"
              style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
            >
              All words used — reshuffle
            </button>
          ) : (
            <button
              onClick={() => startRound()}
              className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              Play Again
            </button>
          )}
          <button
            onClick={() => { resetGame(); router.push('/setup') }}
            className="w-full py-4 rounded-2xl font-bold text-lg font-heading transition-all active:scale-95"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
          >
            Change Settings
          </button>
          <button
            onClick={() => { resetGame(); router.push('/') }}
            className="text-sm text-center transition-opacity hover:opacity-70 py-2"
            style={{ color: 'var(--muted)' }}
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </GameLayout>
  )
}

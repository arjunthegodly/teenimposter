'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { PassScreen } from '@/components/PassScreen'
import { VoteGrid } from '@/components/VoteGrid'
import { GameLayout } from '@/components/GameLayout'
import { tallyVotes, findTiedPlayers, getVotedOut } from '@/lib/game-logic'

export default function VotePage() {
  const router = useRouter()
  const { config, round, submitVote, proceedToResults } = useGame()
  const [localVoteIndex, setLocalVoteIndex] = useState(0)
  const [showingPass, setShowingPass] = useState(true)
  const [showTally, setShowTally] = useState(false)
  const [localVotes, setLocalVotes] = useState<Record<string, string>>({})
  const [localTied, setLocalTied] = useState<string[]>([])
  const [isLocalRevote, setIsLocalRevote] = useState(false)

  useEffect(() => {
    if (!config || !round) router.replace('/')
  }, [config, round, router])

  if (!config || !round) return null

  // Eligible voters: in a revote, only the tied players vote
  const voters = isLocalRevote ? localTied : config.players
  const currentVoter = voters[localVoteIndex]
  const allVoted = localVoteIndex >= voters.length

  const handleReady = () => setShowingPass(false)

  const handleVote = (votedFor: string) => {
    const newVotes = { ...localVotes, [currentVoter]: votedFor }
    setLocalVotes(newVotes)
    submitVote(currentVoter, votedFor)

    const nextIndex = localVoteIndex + 1
    if (nextIndex >= voters.length) {
      // All voted — tally
      const eligiblePlayers = isLocalRevote ? localTied : config.players
      const tally = tallyVotes(newVotes)
      const tied = findTiedPlayers(tally, eligiblePlayers)

      if (tied.length > 1) {
        // Tie — start revote
        setLocalTied(tied)
        setIsLocalRevote(true)
        setLocalVoteIndex(0)
        setLocalVotes({})
        setShowingPass(true)
      } else {
        setShowTally(true)
      }
    } else {
      setLocalVoteIndex(nextIndex)
      setShowingPass(true)
    }
  }

  const handleReveal = () => {
    proceedToResults(localVotes)
  }

  const tally = tallyVotes(localVotes)
  const sortedTally = [...tally.entries()].sort(([, a], [, b]) => b - a)
  const votedOut = getVotedOut(tally, isLocalRevote ? localTied : config.players)

  if (showTally) {
    return (
      <GameLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
              Votes are in!
            </h2>
          </div>

          <div className="card p-5 flex flex-col gap-4">
            {sortedTally.map(([player, votes]) => {
              const pct = (votes / voters.length) * 100
              return (
                <div key={player} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--foreground)' }}>{player}</span>
                    <span style={{ color: 'var(--muted)' }}>
                      {votes} vote{votes !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: player === votedOut ? 'var(--secondary)' : 'var(--primary)' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {votedOut && (
            <div className="card p-4 text-center">
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Voted out</p>
              <p className="text-2xl font-bold font-heading mt-1" style={{ color: 'var(--secondary)' }}>
                {votedOut}
              </p>
            </div>
          )}

          <button
            onClick={handleReveal}
            className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            Reveal Imposter →
          </button>
        </motion.div>
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <div className="flex flex-col gap-6">
        {/* Progress dots */}
        <div className="flex gap-1">
          {voters.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{
                background: i < localVoteIndex ? 'var(--secondary)' : 'var(--card-border)',
              }}
            />
          ))}
        </div>

        {isLocalRevote && (
          <div className="card p-3 text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>
              🔁 Tie — revote between {localTied.join(' & ')}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showingPass ? (
            <PassScreen
              key={`pass-${localVoteIndex}`}
              name={currentVoter}
              onReady={handleReady}
              label="Cast my vote"
            />
          ) : (
            <motion.div
              key={`vote-${localVoteIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VoteGrid
                players={isLocalRevote ? localTied : config.players}
                voter={currentVoter}
                onVote={handleVote}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  )
}

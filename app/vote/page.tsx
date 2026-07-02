'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/components/Providers'
import { PassScreen } from '@/components/PassScreen'
import { VoteGrid } from '@/components/VoteGrid'
import { GameLayout } from '@/components/GameLayout'
import { tallyVotes, findTiedPlayers, getVotedOut } from '@/lib/game-logic'
import { ArrowRight } from 'lucide-react'

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
      const eligiblePlayers = isLocalRevote ? localTied : config.players
      const tally = tallyVotes(newVotes)
      const tied = findTiedPlayers(tally, eligiblePlayers)

      if (tied.length > 1) {
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

  const handleReveal = () => proceedToResults(localVotes)

  const tally = tallyVotes(localVotes)
  const sortedTally = [...tally.entries()].sort(([, a], [, b]) => b - a)
  const votedOut = getVotedOut(tally, isLocalRevote ? localTied : config.players)
  const maxVotes = sortedTally[0]?.[1] ?? 1

  if (showTally) {
    return (
      <GameLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h2 className="text-3xl font-extrabold font-heading" style={{ color: 'var(--foreground)' }}>
              Votes are in
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {votedOut ? `${votedOut} is out` : 'It\'s a tie — but not revoting'}
            </p>
          </div>

          {/* Vote bars */}
          <div className="card p-5 flex flex-col gap-4">
            {sortedTally.map(([player, votes], i) => {
              const pct = (votes / maxVotes) * 100
              const isTop = player === votedOut
              return (
                <motion.div
                  key={player}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span
                      className="font-semibold"
                      style={{ color: isTop ? 'var(--secondary)' : 'var(--foreground)' }}
                    >
                      {player}
                    </span>
                    <span style={{ color: 'var(--muted)' }}>
                      {votes} vote{votes !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div
                    className="h-4 rounded-full overflow-hidden"
                    style={{ background: 'var(--card-border)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.06 + 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: isTop ? 'var(--secondary)' : 'var(--primary)',
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {votedOut && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="card p-4 text-center"
              style={{ borderColor: 'var(--secondary)' }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--muted)' }}>
                Voted out
              </p>
              <p className="text-3xl font-extrabold font-heading mt-1" style={{ color: 'var(--secondary)' }}>
                {votedOut}
              </p>
            </motion.div>
          )}

          <button
            onClick={handleReveal}
            className="w-full py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            Reveal Imposter
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </GameLayout>
    )
  }

  return (
    <GameLayout>
      <div className="flex flex-col gap-5">
        {/* Progress */}
        <div className="flex gap-1.5">
          {voters.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i < localVoteIndex
                  ? 'var(--secondary)'
                  : i === localVoteIndex
                  ? 'var(--primary)'
                  : 'var(--card-border)',
              }}
            />
          ))}
        </div>

        {!allVoted && (
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--muted)' }}>
            Vote {localVoteIndex + 1} of {voters.length}
          </p>
        )}

        {isLocalRevote && (
          <div
            className="card px-4 py-3 text-center"
            style={{ borderColor: 'var(--secondary)' }}
          >
            <p className="text-sm font-semibold font-heading" style={{ color: 'var(--secondary)' }}>
              🔁 Tie — revoting: {localTied.join(' vs ')}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showingPass ? (
            <PassScreen
              key={`pass-${localVoteIndex}-${isLocalRevote}`}
              name={currentVoter}
              onReady={handleReady}
              label="Cast my vote"
            />
          ) : (
            <motion.div
              key={`vote-${localVoteIndex}-${isLocalRevote}`}
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

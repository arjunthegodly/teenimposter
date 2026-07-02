'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GameLayout } from '@/components/GameLayout'

const steps = [
  {
    emoji: '👥',
    title: 'Gather 3+ players',
    body: 'Sit in a circle with one phone. One person sets up the game.',
  },
  {
    emoji: '🃏',
    title: 'Pass & reveal',
    body: "The phone goes around. Each player secretly taps to see their word — civilians all get the same word, imposters get something else (or nothing).",
  },
  {
    emoji: '💬',
    title: 'Give clues',
    body: 'Go around the circle. Each player gives ONE clue related to the word. Civilians should be specific enough to prove they know the word, but not so obvious the imposter can copy them.',
  },
  {
    emoji: '🗳️',
    title: 'Vote',
    body: 'Everyone discusses, then votes privately. The person with the most votes is out.',
  },
  {
    emoji: '🎭',
    title: 'Reveal',
    body: "Find out if you caught the right person! If the imposter was voted out, civilians win. If not, the imposter wins.",
  },
]

const modes = [
  {
    name: 'Paired Word',
    icon: '🔄',
    desc: 'The imposter gets a similar-but-wrong word (e.g. civilians have "Minecraft", imposter has "Roblox"). Even harder to catch!',
  },
  {
    name: 'Speed Round',
    icon: '⚡',
    desc: 'Each player has a limited time to give their clue. No overthinking allowed.',
  },
  {
    name: 'Multiple Imposters',
    icon: '👥',
    desc: 'Set a range and let fate decide how many imposters are hiding in your group.',
  },
]

export default function HowToPlayPage() {
  return (
    <GameLayout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--muted)' }}>
            ← Back
          </Link>
        </div>

        <div>
          <h1 className="text-4xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
            How to Play
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            TeenImposter — the social deduction game
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-4 flex gap-4"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'var(--card-border)' }}
              >
                {step.emoji}
              </div>
              <div>
                <p className="font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                  {step.title}
                </p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Game modes */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-3" style={{ color: 'var(--secondary)' }}>
            Game Modes
          </h2>
          <div className="flex flex-col gap-3">
            {modes.map((mode, i) => (
              <motion.div
                key={mode.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="card p-4 flex gap-3"
              >
                <span className="text-2xl">{mode.icon}</span>
                <div>
                  <p className="font-bold text-sm font-heading" style={{ color: 'var(--primary)' }}>
                    {mode.name}
                  </p>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {mode.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="card p-5">
          <h3 className="font-bold font-heading mb-3" style={{ color: 'var(--accent)' }}>
            💡 Pro Tips
          </h3>
          <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--muted)' }}>
            <li>• Give clues that are related but not too obvious — you want to prove you know the word without letting the imposter steal your clue</li>
            <li>• Watch reactions when others give clues — the imposter might hesitate or give a clue that&apos;s slightly off</li>
            <li>• Imposters: listen to early clues carefully to build a picture of the word before your turn</li>
            <li>• Don&apos;t always vote for the most suspicious person — sometimes that&apos;s exactly what the imposter wants</li>
          </ul>
        </div>

        <Link
          href="/setup"
          className="w-full py-4 rounded-2xl font-bold text-lg font-heading text-center glow-primary transition-all active:scale-95"
          style={{ background: 'var(--primary)', color: '#fff', display: 'block' }}
        >
          Play Now →
        </Link>
      </div>
    </GameLayout>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GameLayout } from '@/components/GameLayout'

const wordModeSteps = [
  {
    emoji: '👥',
    title: 'Gather 3+ players',
    body: 'Sit in a circle with one phone. One person sets up the game — add player names and pick categories.',
  },
  {
    emoji: '🃏',
    title: 'Pass & reveal',
    body: 'The phone goes around. Each player secretly taps to see their word — civilians all get the same word, the imposter gets something different (or nothing).',
  },
  {
    emoji: '💬',
    title: 'Give clues',
    body: 'Go around the circle. Each player gives ONE clue related to the word. Be specific enough to prove you know it — but not so obvious the imposter can copy you.',
  },
  {
    emoji: '🗳️',
    title: 'Vote',
    body: 'Everyone discusses, then votes privately. The person with the most votes is eliminated.',
  },
  {
    emoji: '🎭',
    title: 'Reveal',
    body: 'Find out if you caught the right person! Civilians win if the imposter was voted out. Imposter wins if they survived.',
  },
]

const questionModeSteps = [
  {
    emoji: '❓',
    title: 'A question for everyone',
    body: "All civilians get the same question to answer out loud — like \"What's your go-to fast food order?\" The imposter secretly gets a slightly different question about the same topic.",
  },
  {
    emoji: '🕵️',
    title: 'The blind imposter',
    body: "Here's the twist: the imposter has NO idea they're the imposter. Their card looks identical to everyone else's. They genuinely think they got the same question.",
  },
  {
    emoji: '🎤',
    title: 'Everyone answers',
    body: "Take turns sharing your answer out loud. Civilians try to sound normal. The imposter answers honestly — but since their question was different, their answer might sound subtly off.",
  },
  {
    emoji: '🔍',
    title: 'Spot who sounds off',
    body: "Listen carefully. Someone's answer will be slightly adjacent to everyone else's. Vote for who you think got a different question.",
  },
]

const modes = [
  {
    name: '🔄 Paired Word',
    desc: "In Word Mode, the imposter gets a similar-but-wrong word (e.g. civilians have \"Minecraft\", imposter has \"Roblox\"). Even harder to catch!",
  },
  {
    name: '⚡ Speed Round',
    desc: 'Each player has a limited time to give their answer or clue. No overthinking allowed.',
  },
  {
    name: '👥 Multiple Imposters',
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
            TeenImposter — two ways to play
          </p>
        </div>

        {/* Word Mode */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
              💬 Word Mode
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--secondary)', color: '#fff' }}
            >
              Classic
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {wordModeSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
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
        </div>

        {/* Question Mode */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
              🕵️ Question Mode
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              New
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {questionModeSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
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
        </div>

        {/* Game modes / options */}
        <div>
          <h2 className="text-xl font-bold font-heading mb-3" style={{ color: 'var(--secondary)' }}>
            Extra Options
          </h2>
          <div className="flex flex-col gap-3">
            {modes.map((mode, i) => (
              <motion.div
                key={mode.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                className="card p-4"
              >
                <p className="font-bold text-sm font-heading" style={{ color: 'var(--primary)' }}>
                  {mode.name}
                </p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {mode.desc}
                </p>
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
            <li>• In Word Mode: give clues that are related but not too obvious — you want to prove you know the word without letting the imposter steal your clue</li>
            <li>• In Question Mode: listen for who sounds like they answered a slightly different question — not wrong, just off by one degree</li>
            <li>• Watch reactions when others give clues — the imposter might hesitate or overcorrect</li>
            <li>• Don&apos;t always vote for the most suspicious person — sometimes that&apos;s exactly what the imposter wants</li>
            <li>• If you&apos;re the imposter in Question Mode: answer honestly — acting natural is your best defense</li>
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

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GameLayout } from '@/components/GameLayout'
import { ArrowRight } from 'lucide-react'

const wordSteps = [
  {
    n: '01',
    emoji: '👥',
    title: 'Enter player names',
    body: 'Add everyone playing. You need at least 3 people. One phone for the whole group.',
  },
  {
    n: '02',
    emoji: '🃏',
    title: 'Each player secretly sees their word',
    body: 'The phone gets passed around. Each player taps to flip their card. Civilians all get the same word — imposters get a hint (or nothing) and see "IMPOSTER".',
  },
  {
    n: '03',
    emoji: '💬',
    title: 'Give one clue each',
    body: 'Go around the circle. Each player gives ONE word or short clue related to the secret word. Prove you know it — but don\'t make it too easy for the imposter.',
  },
  {
    n: '04',
    emoji: '🗳️',
    title: 'Vote privately',
    body: 'Everyone suspects someone. The phone passes around and each player secretly votes for who they think is the imposter.',
  },
  {
    n: '05',
    emoji: '🎭',
    title: 'Reveal the truth',
    body: 'Find out if you caught the imposter! Civilians win if the imposter gets voted out. If not — the imposter wins.',
  },
]

const questionSteps = [
  {
    n: '01',
    emoji: '👥',
    title: 'Enter player names',
    body: 'Same as always — 3+ players, one phone, pass and play.',
  },
  {
    n: '02',
    emoji: '❓',
    title: 'Each player gets a question',
    body: 'The phone passes around. Everyone flips their card and reads their question. The imposter gets a slightly different question about the same topic — and has NO IDEA they\'re the imposter.',
  },
  {
    n: '03',
    emoji: '🎤',
    title: 'Everyone shares their answer',
    body: 'Go around and each player answers their question out loud. The imposter answers their question honestly — but their answer sounds subtly off to everyone else.',
  },
  {
    n: '04',
    emoji: '🔍',
    title: 'Discuss and vote',
    body: 'Who sounded like they answered something different? Someone\'s answer was suspiciously off-topic. Vote for who you think got a different question.',
  },
  {
    n: '05',
    emoji: '🎭',
    title: 'Reveal',
    body: 'See who the imposter was and what question they had! The twist: they didn\'t know they were the imposter the whole time.',
  },
]

const features = [
  {
    icon: '🔄',
    name: 'Paired Word',
    desc: 'Imposter gets a similar-but-different word (e.g. civilians have "Minecraft", imposter has "Roblox"). Harder to bluff, harder to catch.',
  },
  {
    icon: '🕵️',
    name: 'Question Mode',
    desc: 'A totally different format. Everyone answers a question — but the imposter got asked something slightly different. They don\'t even know they\'re the imposter.',
  },
  {
    icon: '⚡',
    name: 'Speed Round',
    desc: 'Timer per player. You\'ve got 15 seconds to give your clue (or answer). No overthinking, no stalling.',
  },
  {
    icon: '😈',
    name: 'Multiple Imposters',
    desc: 'Set a range. Maybe it\'s 1 imposter, maybe it\'s 3. Nobody knows how many are hiding until the reveal.',
  },
  {
    icon: '🤯',
    name: 'All Imposters',
    desc: 'Set min and max both to the player count. Everyone is secretly an imposter — chaos mode activated.',
  },
  {
    icon: '🏷️',
    name: '10 Themes',
    desc: 'Switch themes mid-game. Dark Neon, Rose Gold, Cyber Pulse, Dark Academia, and more — each with unique fonts and vibes.',
  },
]

const tips = [
  { mode: 'Word', tip: 'Civilian? Be specific enough to prove you know the word, but vague enough the imposter can\'t copy you.' },
  { mode: 'Word', tip: 'Imposter? Listen to the first few clues and build a mental picture of what the word might be before your turn.' },
  { mode: 'Question', tip: 'Listen for answers that are technically valid but feel slightly off-topic. That\'s the imposter.' },
  { mode: 'Question', tip: 'Imposter? Answer your question honestly and hope it sounds close enough. You literally can\'t know exactly what to fake.' },
  { mode: 'Both', tip: 'Don\'t always vote for the most nervous person — experienced imposters might try to act normal.' },
  { mode: 'Both', tip: 'If there\'s a tie in voting, you go to a revote — only the tied players are options.' },
]

export default function HowToPlayPage() {
  return (
    <GameLayout>
      <div className="flex flex-col gap-8 pb-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm transition-opacity" style={{ color: 'var(--muted)' }}>
            ← Back
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold font-heading text-gradient leading-tight">
            How to Play
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Two modes. One imposter. Everyone gets fooled.
          </p>
        </motion.div>

        {/* Word Mode Steps */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-bold font-heading"
              style={{ background: 'var(--secondary)', color: '#fff' }}
            >
              Word Mode
            </div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Classic format</p>
          </div>
          <div className="flex flex-col gap-3">
            {wordSteps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card p-4 flex gap-4"
              >
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span
                    className="text-xs font-bold font-heading tabular-nums"
                    style={{ color: 'var(--primary)' }}
                  >
                    {step.n}
                  </span>
                  <span className="text-xl">{step.emoji}</span>
                </div>
                <div>
                  <p className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                    {step.title}
                  </p>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Question Mode Steps */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-bold font-heading"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              Question Mode
            </div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Blind imposter twist</p>
          </div>
          <div className="flex flex-col gap-3">
            {questionSteps.map((step, i) => (
              <motion.div
                key={step.n + 'q'}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="card p-4 flex gap-4"
              >
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span
                    className="text-xs font-bold font-heading tabular-nums"
                    style={{ color: 'var(--primary)' }}
                  >
                    {step.n}
                  </span>
                  <span className="text-xl">{step.emoji}</span>
                </div>
                <div>
                  <p className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                    {step.title}
                  </p>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section>
          <h2
            className="text-xl font-extrabold font-heading mb-4"
            style={{ color: 'var(--secondary)' }}
          >
            Features
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="card p-4 flex flex-col gap-2"
              >
                <span className="text-2xl">{f.icon}</span>
                <p className="font-bold text-sm font-heading" style={{ color: 'var(--primary)' }}>
                  {f.name}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="card p-5">
          <h3 className="font-bold font-heading mb-4" style={{ color: 'var(--accent)' }}>
            💡 Pro Tips
          </h3>
          <div className="flex flex-col gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: tip.mode === 'Word'
                      ? 'var(--secondary)'
                      : tip.mode === 'Question'
                      ? 'var(--primary)'
                      : 'var(--card-border)',
                    color: tip.mode === 'Both' ? 'var(--muted)' : '#fff',
                    fontSize: '9px',
                  }}
                >
                  {tip.mode}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/setup"
          className="w-full py-4 rounded-2xl font-bold text-lg font-heading text-center glow-primary transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          Play Now
          <ArrowRight size={20} />
        </Link>
      </div>
    </GameLayout>
  )
}

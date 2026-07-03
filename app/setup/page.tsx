'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, Minus, MessageSquare, Type } from 'lucide-react'
import { useGame } from '@/components/Providers'
import { ChipInput } from '@/components/ChipInput'
import { GameLayout } from '@/components/GameLayout'
import { categoryGroups, defaultSelectedSubcategories } from '@/data/categories/index'
import { GameConfig, GameMode, ImposterHint } from '@/lib/types'

const STEP_LABELS = ['Players', 'Mode', 'Categories', 'Modes', 'Timer']

const HINT_OPTIONS: { value: ImposterHint; label: string; desc: string }[] = [
  { value: 'category', label: 'Category', desc: 'Imposter sees the category name' },
  { value: 'pairedWord', label: 'Paired Word', desc: 'Imposter gets a similar-but-wrong word' },
  { value: 'hint', label: 'Text Hint', desc: 'Imposter gets a short text clue about the word' },
  { value: 'nothing', label: 'Nothing', desc: 'Imposter gets no information at all' },
]

export default function SetupPage() {
  const router = useRouter()
  const { setConfig, startRound, wordsExhausted, resetUsedWords } = useGame()

  const [step, setStep] = useState(0)
  const [players, setPlayers] = useState<string[]>([])
  const [playerInput, setPlayerInput] = useState('')
  const [gameMode, setGameMode] = useState<GameMode>('word')
  const [selectedSubs, setSelectedSubs] = useState<string[]>(defaultSelectedSubcategories)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [customWords, setCustomWords] = useState<Record<string, string[]>>({})
  const [expandedCustom, setExpandedCustom] = useState<string | null>(null)
  const [imposterMin, setImposterMin] = useState(1)
  const [imposterMax, setImposterMax] = useState(1)
  const [imposterHint, setImposterHint] = useState<ImposterHint>('category')
  const [speedEnabled, setSpeedEnabled] = useState(false)
  const [speedDuration, setSpeedDuration] = useState(15)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timerDuration, setTimerDuration] = useState(60)
  const [lastStand, setLastStand] = useState(false)

  const addPlayer = () => {
    const trimmed = playerInput.trim()
    if (!trimmed || players.includes(trimmed)) return
    setPlayers(p => [...p, trimmed])
    setPlayerInput('')
  }

  const removePlayer = (name: string) => setPlayers(p => p.filter(x => x !== name))

  const toggleSub = (id: string) => {
    setSelectedSubs(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleGroupAll = (groupId: string) => {
    const group = categoryGroups.find(g => g.id === groupId)
    if (!group) return
    const ids = group.subcategories.map(s => s.id)
    const allSelected = ids.every(id => selectedSubs.includes(id))
    if (allSelected) {
      setSelectedSubs(prev => prev.filter(id => !ids.includes(id)))
    } else {
      setSelectedSubs(prev => [...new Set([...prev, ...ids])])
    }
  }

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    )
  }

  const canProceed = [
    players.length >= 3,   // 0: Players
    true,                   // 1: Mode
    selectedSubs.length >= 1, // 2: Categories
    true,                   // 3: Modes
    true,                   // 4: Timer
  ][step]

  const clampMin = (v: number) => Math.max(1, Math.min(v, imposterMax))
  const clampMax = (v: number) => Math.max(imposterMin, Math.min(v, players.length || 99))

  const handleStart = () => {
    if (wordsExhausted) resetUsedWords()

    const cfg: GameConfig = {
      players,
      gameMode,
      selectedSubcategories: selectedSubs,
      customWords,
      imposterRange: [imposterMin, imposterMax],
      imposterHint: (gameMode === 'question' || gameMode === 'chameleon') ? 'nothing' : imposterHint,
      speedRound: { enabled: speedEnabled, duration: speedDuration },
      timer: { enabled: timerEnabled, duration: timerDuration },
      lastStand,
    }
    setConfig(cfg)
    startRound(cfg)
  }

  return (
    <GameLayout>
      {/* Step indicator */}
      <div className="flex gap-1.5 items-center mb-6 overflow-x-auto pb-1">
        <Link href="/" className="mr-1 flex-shrink-0" style={{ color: 'var(--muted)' }}>
          <ChevronLeft size={20} />
        </Link>
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => i < step && setStep(i)}
              className="flex items-center gap-1"
            >
              <div
                className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold transition-colors"
                style={{
                  background: i === step ? 'var(--primary)' : i < step ? 'var(--secondary)' : 'var(--card-border)',
                  color: i <= step ? '#fff' : 'var(--muted)',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className="text-xs hidden sm:inline"
                style={{ color: i === step ? 'var(--foreground)' : 'var(--muted)' }}
              >
                {label}
              </span>
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className="w-3 h-px flex-shrink-0" style={{ background: 'var(--card-border)' }} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Step 0: Players ── */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                Who&apos;s playing?
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                Add at least 3 players
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={playerInput}
                onChange={e => setPlayerInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPlayer() } }}
                placeholder="Player name..."
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--foreground)',
                }}
                autoFocus
              />
              <button
                onClick={addPlayer}
                disabled={!playerInput.trim()}
                className="px-5 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ background: 'var(--primary)', color: '#fff' }}
              >
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {players.map((p, i) => (
                <div
                  key={p}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-5 text-center" style={{ color: 'var(--muted)' }}>{i + 1}</span>
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>{p}</span>
                  </div>
                  <button
                    onClick={() => removePlayer(p)}
                    className="text-xs px-2 py-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--muted)' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {players.length > 0 && players.length < 3 && (
              <p className="text-xs text-center" style={{ color: 'var(--secondary)' }}>
                Need {3 - players.length} more player{3 - players.length !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>
        )}

        {/* ── Step 1: Game Mode ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                How do you want to play?
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                Choose your game mode
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Word Mode */}
              <button
                onClick={() => setGameMode('word')}
                className="card p-5 text-left transition-all active:scale-[0.99]"
                style={{
                  borderColor: gameMode === 'word' ? 'var(--primary)' : 'var(--card-border)',
                  borderWidth: '2px',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: gameMode === 'word' ? 'var(--primary)' : 'var(--card-border)' }}
                  >
                    <Type size={20} style={{ color: gameMode === 'word' ? '#fff' : 'var(--muted)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold font-heading text-base" style={{ color: 'var(--foreground)' }}>
                        Word Mode
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'var(--secondary)', color: '#fff' }}
                      >
                        Classic
                      </span>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                      Each player gets a secret word. Give one-word clues. The imposter doesn&apos;t know the word — they have to blend in.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['One-word clues', 'Fast rounds', 'Strategic'].map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--card-border)', color: 'var(--muted)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ borderColor: gameMode === 'word' ? 'var(--primary)' : 'var(--card-border)' }}
                  >
                    {gameMode === 'word' && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)' }} />
                    )}
                  </div>
                </div>
              </button>

              {/* Question Mode */}
              <button
                onClick={() => setGameMode('question')}
                className="card p-5 text-left transition-all active:scale-[0.99]"
                style={{
                  borderColor: gameMode === 'question' ? 'var(--primary)' : 'var(--card-border)',
                  borderWidth: '2px',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: gameMode === 'question' ? 'var(--primary)' : 'var(--card-border)' }}
                  >
                    <MessageSquare size={20} style={{ color: gameMode === 'question' ? '#fff' : 'var(--muted)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold font-heading text-base" style={{ color: 'var(--foreground)' }}>
                        Question Mode
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'var(--primary)', color: '#fff' }}
                      >
                        New
                      </span>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                      Everyone gets a question to answer out loud. The imposter secretly gets a <em>different</em> question — and has no idea they&apos;re the imposter.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Blind imposter', 'Story-based', 'Social'].map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--card-border)', color: 'var(--muted)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ borderColor: gameMode === 'question' ? 'var(--primary)' : 'var(--card-border)' }}
                  >
                    {gameMode === 'question' && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)' }} />
                    )}
                  </div>
                </div>
              </button>

              {/* Chameleon Mode */}
              <button
                onClick={() => setGameMode('chameleon')}
                className="card p-5 text-left transition-all active:scale-[0.99]"
                style={{
                  borderColor: gameMode === 'chameleon' ? 'var(--secondary)' : 'var(--card-border)',
                  borderWidth: '2px',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: gameMode === 'chameleon' ? 'var(--secondary)' : 'var(--card-border)' }}
                  >
                    🦎
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold font-heading text-base" style={{ color: 'var(--foreground)' }}>
                        Chameleon
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'var(--secondary)', color: '#fff' }}
                      >
                        New
                      </span>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                      Everyone sees a 4×4 word grid. Civilians know the secret word. The Chameleon doesn&apos;t — and must bluff. If caught, they get one last chance to guess it.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Grid-based', 'Bluffing', 'Last-chance guess'].map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--card-border)', color: 'var(--muted)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ borderColor: gameMode === 'chameleon' ? 'var(--secondary)' : 'var(--card-border)' }}
                  >
                    {gameMode === 'chameleon' && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--secondary)' }} />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {gameMode === 'question' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card px-4 py-3 flex gap-3 items-start"
                style={{ borderColor: 'var(--secondary)' }}
              >
                <span className="text-lg mt-0.5">💡</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  The imposter gets a slightly different question about the same topic. They answer it honestly — but their answer sounds subtly off to everyone else.
                </p>
              </motion.div>
            )}
            {gameMode === 'chameleon' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="card px-4 py-3 flex gap-3 items-start"
                style={{ borderColor: 'var(--secondary)' }}
              >
                <span className="text-lg mt-0.5">🦎</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                  If the Chameleon gets voted out, they get one chance to escape: guess the secret word from the grid. Guess correctly and they win — even after being caught!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Step 2: Categories ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            <div>
              <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                Pick categories
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                {selectedSubs.length} subcategories selected
              </p>
            </div>

            {categoryGroups.map(group => {
              const groupIds = group.subcategories.map(s => s.id)
              const allSelected = groupIds.every(id => selectedSubs.includes(id))
              const someSelected = groupIds.some(id => selectedSubs.includes(id))
              const isExpanded = expandedGroups.includes(group.id)

              return (
                <div key={group.id} className="card overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() => toggleGroupAll(group.id)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0 transition-colors"
                        style={{
                          background: allSelected ? 'var(--primary)' : someSelected ? 'var(--primary)' : 'var(--card-border)',
                          opacity: someSelected && !allSelected ? 0.5 : 1,
                        }}
                      >
                        {(allSelected || someSelected) && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                        {group.name}
                      </span>
                    </button>
                    <button
                      onClick={() => toggleGroupExpanded(group.id)}
                      style={{ color: 'var(--muted)' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 flex flex-col gap-2" style={{ borderTop: '1px solid var(--card-border)' }}>
                      {group.subcategories.map(sub => {
                        const selected = selectedSubs.includes(sub.id)
                        const hasCustom = (customWords[sub.id] ?? []).length > 0
                        const isCustomOpen = expandedCustom === sub.id

                        return (
                          <div key={sub.id} className="flex flex-col gap-2 pt-3">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => toggleSub(sub.id)}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                                  style={{ background: selected ? 'var(--secondary)' : 'var(--card-border)' }}
                                >
                                  {selected && <span className="text-white" style={{ fontSize: '10px' }}>✓</span>}
                                </div>
                                <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                                  {sub.name}
                                </span>
                                {hasCustom && (
                                  <span className="text-xs px-1.5 rounded-full" style={{ background: 'var(--primary)', color: '#fff' }}>
                                    +{customWords[sub.id].length}
                                  </span>
                                )}
                              </button>
                              {gameMode === 'word' && (
                                <button
                                  onClick={() => setExpandedCustom(isCustomOpen ? null : sub.id)}
                                  className="text-xs px-2 py-1 rounded-lg transition-all"
                                  style={{
                                    background: 'var(--card-border)',
                                    color: 'var(--muted)',
                                  }}
                                >
                                  + words
                                </button>
                              )}
                            </div>
                            {isCustomOpen && gameMode === 'word' && (
                              <div className="pl-6">
                                <ChipInput
                                  values={customWords[sub.id] ?? []}
                                  onChange={vals => setCustomWords(prev => ({ ...prev, [sub.id]: vals }))}
                                  placeholder={`Add custom ${sub.name} word...`}
                                />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>
        )}

        {/* ── Step 3: Modes ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                Game modes
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                Configure how you play
              </p>
            </div>

            {/* Imposter range */}
            <div className="card p-5 flex flex-col gap-4">
              <p className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                Number of imposters
              </p>
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Min</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setImposterMin(clampMin(imposterMin - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                      style={{ background: 'var(--card-border)' }}
                    >
                      <Minus size={14} style={{ color: 'var(--foreground)' }} />
                    </button>
                    <span className="text-2xl font-bold font-heading w-8 text-center" style={{ color: 'var(--primary)' }}>
                      {imposterMin}
                    </span>
                    <button
                      onClick={() => setImposterMin(clampMin(imposterMin + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                      style={{ background: 'var(--card-border)' }}
                    >
                      <Plus size={14} style={{ color: 'var(--foreground)' }} />
                    </button>
                  </div>
                </div>
                <div className="w-px" style={{ background: 'var(--card-border)' }} />
                <div className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>Max</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setImposterMax(clampMax(imposterMax - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                      style={{ background: 'var(--card-border)' }}
                    >
                      <Minus size={14} style={{ color: 'var(--foreground)' }} />
                    </button>
                    <span className="text-2xl font-bold font-heading w-8 text-center" style={{ color: 'var(--secondary)' }}>
                      {imposterMax}
                    </span>
                    <button
                      onClick={() => setImposterMax(clampMax(imposterMax + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                      style={{ background: 'var(--card-border)' }}
                    >
                      <Plus size={14} style={{ color: 'var(--foreground)' }} />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                {imposterMin === imposterMax
                ? imposterMin === players.length && players.length > 0
                  ? '🤯 Everyone is an imposter!'
                  : `Exactly ${imposterMin} imposter${imposterMin !== 1 ? 's' : ''} every round`
                : `${imposterMin}–${imposterMax} imposters — chosen randomly each round${imposterMax === players.length && players.length > 0 ? ' (max = everyone!)' : ''}`}
              </p>
            </div>

            {/* Imposter hint — word mode only */}
            {gameMode === 'word' && (
              <div className="card p-5 flex flex-col gap-3">
                <p className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                  What does the imposter see?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {HINT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setImposterHint(opt.value)}
                      className="p-3 rounded-xl text-left transition-all active:scale-95"
                      style={{
                        background: imposterHint === opt.value ? 'var(--primary)' : 'var(--card-border)',
                        border: `1px solid ${imposterHint === opt.value ? 'var(--primary)' : 'transparent'}`,
                      }}
                    >
                      <p className="text-sm font-bold" style={{ color: imposterHint === opt.value ? '#fff' : 'var(--foreground)' }}>
                        {opt.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: imposterHint === opt.value ? 'rgba(255,255,255,0.75)' : 'var(--muted)' }}>
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question mode info */}
            {gameMode === 'question' && (
              <div className="card p-4 flex gap-3 items-start" style={{ borderColor: 'var(--secondary)' }}>
                <span className="text-lg">🕵️</span>
                <div>
                  <p className="font-bold text-sm font-heading" style={{ color: 'var(--foreground)' }}>
                    Blind imposter
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                    In Question Mode, the imposter doesn&apos;t know they&apos;re the imposter. They get a different question and think everyone answered the same one.
                  </p>
                </div>
              </div>
            )}

            {/* Chameleon mode info */}
            {gameMode === 'chameleon' && (
              <div className="card p-4 flex gap-3 items-start" style={{ borderColor: 'var(--secondary)' }}>
                <span className="text-lg">🦎</span>
                <div>
                  <p className="font-bold text-sm font-heading" style={{ color: 'var(--foreground)' }}>
                    Grid-based bluffing
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                    Everyone sees a 4×4 grid. Civilians know which word is secret — the Chameleon doesn&apos;t. Give clues from the grid without revealing the secret word.
                  </p>
                </div>
              </div>
            )}

            {/* Last Stand */}
            <div className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                    ⚖️ Last Stand
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    Voted-out player gets 10 seconds to defend themselves before the reveal
                  </p>
                </div>
                <button
                  onClick={() => setLastStand(e => !e)}
                  className="w-12 h-6 rounded-full relative transition-colors"
                  style={{ background: lastStand ? 'var(--primary)' : 'var(--card-border)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ left: lastStand ? '26px' : '4px' }}
                  />
                </button>
              </div>
            </div>

            {/* Speed round */}
            <div className="card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                    ⚡ Speed Round
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {gameMode === 'question'
                      ? 'Each player has limited time to share their answer'
                      : 'Each player has limited time to give a clue'}
                  </p>
                </div>
                <button
                  onClick={() => setSpeedEnabled(e => !e)}
                  className="w-12 h-6 rounded-full relative transition-colors"
                  style={{ background: speedEnabled ? 'var(--primary)' : 'var(--card-border)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ left: speedEnabled ? '26px' : '4px' }}
                  />
                </button>
              </div>
              {speedEnabled && (
                <div className="flex items-center gap-4">
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>Seconds per player:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSpeedDuration(d => Math.max(5, d - 5))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--card-border)' }}
                    >
                      <Minus size={14} style={{ color: 'var(--foreground)' }} />
                    </button>
                    <span className="text-lg font-bold font-heading w-10 text-center" style={{ color: 'var(--primary)' }}>
                      {speedDuration}s
                    </span>
                    <button
                      onClick={() => setSpeedDuration(d => Math.min(60, d + 5))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--card-border)' }}
                    >
                      <Plus size={14} style={{ color: 'var(--foreground)' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Timer ── */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5"
          >
            <div>
              <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--foreground)' }}>
                Overall timer
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                Optional countdown for the whole {gameMode === 'question' ? 'answer' : 'clue'} phase
              </p>
            </div>

            <div className="card p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold font-heading text-sm" style={{ color: 'var(--foreground)' }}>
                    Round timer
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {gameMode === 'question'
                      ? 'Answer phase ends automatically when timer runs out'
                      : 'Clue phase ends automatically when timer runs out'}
                  </p>
                </div>
                <button
                  onClick={() => setTimerEnabled(e => !e)}
                  className="w-12 h-6 rounded-full relative transition-colors"
                  style={{ background: timerEnabled ? 'var(--primary)' : 'var(--card-border)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ left: timerEnabled ? '26px' : '4px' }}
                  />
                </button>
              </div>
              {timerEnabled && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setTimerDuration(d => Math.max(15, d - 15))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--card-border)' }}
                  >
                    <Minus size={16} style={{ color: 'var(--foreground)' }} />
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-bold font-heading" style={{ color: 'var(--primary)' }}>
                      {timerDuration}
                    </span>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>seconds</p>
                  </div>
                  <button
                    onClick={() => setTimerDuration(d => Math.min(300, d + 15))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--card-border)' }}
                  >
                    <Plus size={16} style={{ color: 'var(--foreground)' }} />
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="card p-4 flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
                Game summary
              </p>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Players</span>
                <span style={{ color: 'var(--foreground)' }}>{players.join(', ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Mode</span>
                <span style={{ color: gameMode === 'question' ? 'var(--primary)' : 'var(--foreground)' }}>
                  {gameMode === 'question' ? '🕵️ Question Mode' : '💬 Word Mode'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Categories</span>
                <span style={{ color: 'var(--foreground)' }}>{selectedSubs.length} selected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Imposters</span>
                <span style={{ color: 'var(--foreground)' }}>
                  {imposterMin === imposterMax ? imposterMin : `${imposterMin}–${imposterMax}`} (random)
                </span>
              </div>
              {gameMode === 'word' && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted)' }}>Imposter sees</span>
                  <span style={{ color: 'var(--foreground)' }}>
                    {HINT_OPTIONS.find(o => o.value === imposterHint)?.label}
                  </span>
                </div>
              )}
              {speedEnabled && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted)' }}>Speed round</span>
                  <span style={{ color: 'var(--secondary)' }}>⚡ {speedDuration}s per player</span>
                </div>
              )}
              {lastStand && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted)' }}>Last Stand</span>
                  <span style={{ color: 'var(--primary)' }}>⚖️ On</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-4 rounded-2xl font-bold font-heading transition-all active:scale-95"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }}
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            Continue
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex-1 py-4 rounded-2xl font-bold text-lg font-heading glow-primary transition-all active:scale-95"
            style={{ background: 'var(--secondary)', color: '#fff' }}
          >
            Start Game →
          </button>
        )}
      </div>
    </GameLayout>
  )
}

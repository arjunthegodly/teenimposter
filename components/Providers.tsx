'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { GameConfig, GameState, ImposterHint, RoundState, ThemeId } from '@/lib/types'
import { assignImposters, drawWord, drawQuestion, findTiedPlayers, getVotedOut, tallyVotes } from '@/lib/game-logic'
import { SOUND_KEY, THEME_KEY, defaultTheme } from '@/lib/theme-config'
import { allSubcategories } from '@/data/categories/index'
import { allQuestionSubcategories } from '@/data/questions/index'

/* ─────────────────────────────────────────────
   Theme Context
───────────────────────────────────────────── */
interface ThemeContextType {
  theme: ThemeId
  setTheme: (t: ThemeId) => void
  sound: boolean
  toggleSound: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
  sound: false,
  toggleSound: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

/* ─────────────────────────────────────────────
   Game Context
───────────────────────────────────────────── */
interface GameContextType {
  config: GameConfig | null
  round: RoundState | null
  usedWordIds: string[]
  usedQuestionIds: string[]
  wordsExhausted: boolean
  sessionScores: Record<string, number>
  setConfig: (config: GameConfig) => void
  startRound: (overrideConfig?: GameConfig) => void
  advanceReveal: () => void
  advanceSpeaker: () => void
  startVoting: () => void
  submitVote: (voter: string, votedFor: string) => void
  advanceVote: () => void
  processVotes: () => void
  startRevote: (tiedPlayers: string[]) => void
  proceedToResults: (finalVotes: Record<string, string>) => void
  resetUsedWords: () => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType>({} as GameContextType)

export function useGame() {
  return useContext(GameContext)
}

/* ─────────────────────────────────────────────
   Combined Providers
───────────────────────────────────────────── */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  // ── Theme ──
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as ThemeId | null
    if (saved) setThemeState(saved)
    const savedSound = localStorage.getItem(SOUND_KEY)
    if (savedSound === 'true') setSound(true)
  }, [])

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t)
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem(THEME_KEY, t)
  }, [])

  const toggleSound = useCallback(() => {
    setSound(prev => {
      const next = !prev
      localStorage.setItem(SOUND_KEY, String(next))
      return next
    })
  }, [])

  // ── Game state ──
  const [config, setConfigState] = useState<GameConfig | null>(null)
  const [round, setRound] = useState<RoundState | null>(null)
  const [usedWordIds, setUsedWordIds] = useState<string[]>([])
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([])
  const [sessionScores, setSessionScores] = useState<Record<string, number>>({})

  const setConfig = useCallback((cfg: GameConfig) => {
    setConfigState(cfg)
  }, [])

  const startRound = useCallback((overrideConfig?: GameConfig) => {
    const cfg = overrideConfig ?? config
    if (!cfg) return

    const imposters = assignImposters(cfg.players, cfg.imposterRange)

    if (cfg.gameMode === 'question') {
      const drawn = drawQuestion(allQuestionSubcategories, cfg.selectedSubcategories, usedQuestionIds)
      if (!drawn) return

      const newRound: RoundState = {
        word: drawn.entry.question,
        pairedWord: drawn.entry.imposterQuestion,
        hint: undefined,
        subcategoryId: drawn.subcategoryId,
        subcategoryName: drawn.subcategoryName,
        imposters,
        revealIndex: 0,
        speakerIndex: 0,
        votes: {},
        tiedPlayers: [],
        isRevote: false,
        phase: 'reveal',
      }

      setUsedQuestionIds(prev => [...prev, drawn.entry.id])
      setRound(newRound)
      router.push('/reveal')
    } else {
      const drawn = drawWord(allSubcategories, cfg.selectedSubcategories, usedWordIds, cfg.customWords)
      if (!drawn) return

      const newRound: RoundState = {
        word: drawn.entry.word,
        pairedWord: cfg.imposterHint === 'pairedWord' ? drawn.entry.paired : undefined,
        hint: cfg.imposterHint === 'hint' ? drawn.entry.hint : undefined,
        subcategoryId: drawn.subcategoryId,
        subcategoryName: drawn.subcategoryName,
        imposters,
        revealIndex: 0,
        speakerIndex: 0,
        votes: {},
        tiedPlayers: [],
        isRevote: false,
        phase: 'reveal',
      }

      setUsedWordIds(prev => [...prev, drawn.entry.id])
      setRound(newRound)
      router.push('/reveal')
    }
  }, [config, usedWordIds, usedQuestionIds, router])

  const advanceReveal = useCallback(() => {
    if (!round || !config) return
    const nextIndex = round.revealIndex + 1
    if (nextIndex >= config.players.length) {
      setRound(prev => prev ? { ...prev, phase: 'clue', revealIndex: nextIndex } : prev)
      router.push('/game')
    } else {
      setRound(prev => prev ? { ...prev, revealIndex: nextIndex } : prev)
    }
  }, [round, config, router])

  const advanceSpeaker = useCallback(() => {
    if (!round || !config) return
    const nextIndex = round.speakerIndex + 1
    if (nextIndex >= config.players.length) {
      setRound(prev => prev ? { ...prev, speakerIndex: 0 } : prev)
    } else {
      setRound(prev => prev ? { ...prev, speakerIndex: nextIndex } : prev)
    }
  }, [round, config])

  const startVoting = useCallback(() => {
    if (!round) return
    setRound(prev => prev ? { ...prev, phase: 'vote', votes: {}, tiedPlayers: [], isRevote: false } : prev)
    router.push('/vote')
  }, [round, router])

  const submitVote = useCallback((voter: string, votedFor: string) => {
    setRound(prev => {
      if (!prev) return prev
      return { ...prev, votes: { ...prev.votes, [voter]: votedFor } }
    })
  }, [])

  const advanceVote = useCallback(() => {}, [])

  const processVotes = useCallback(() => {
    if (!round || !config) return

    const tally = tallyVotes(round.votes)
    const eligiblePlayers = round.isRevote ? round.tiedPlayers : config.players
    const tied = findTiedPlayers(tally, eligiblePlayers)

    if (tied.length > 1) {
      setRound(prev =>
        prev ? { ...prev, tiedPlayers: tied, isRevote: true, votes: {}, phase: 'vote' } : prev
      )
    } else {
      setRound(prev => prev ? { ...prev, phase: 'tally' } : prev)
    }
  }, [round, config])

  const startRevote = useCallback((tiedPlayers: string[]) => {
    setRound(prev =>
      prev ? { ...prev, tiedPlayers, isRevote: true, votes: {}, phase: 'vote' } : prev
    )
  }, [])

  const proceedToResults = useCallback((finalVotes: Record<string, string>) => {
    if (!round || !config) return

    // Update session scores
    const tally = tallyVotes(finalVotes)
    const eligible = round.tiedPlayers.length > 0 ? round.tiedPlayers : config.players
    const votedOut = getVotedOut(tally, eligible)
    const votedOutIsImposter = votedOut ? round.imposters.includes(votedOut) : false
    const allImposters = round.imposters.length === config.players.length

    setSessionScores(prev => {
      const next = { ...prev }
      if (allImposters) {
        config.players.forEach(p => { next[p] = (next[p] ?? 0) + 1 })
      } else if (votedOutIsImposter) {
        config.players.forEach(p => {
          if (!round.imposters.includes(p)) next[p] = (next[p] ?? 0) + 1
        })
      } else {
        round.imposters.forEach(p => { next[p] = (next[p] ?? 0) + 1 })
      }
      return next
    })

    setRound(prev => prev ? { ...prev, phase: 'results', votes: finalVotes } : prev)

    if (config.lastStand && votedOut) {
      router.push('/last-stand')
    } else {
      router.push('/results')
    }
  }, [round, config, router])

  const resetUsedWords = useCallback(() => {
    setUsedWordIds([])
    setUsedQuestionIds([])
  }, [])

  const resetGame = useCallback(() => {
    setRound(null)
    setUsedWordIds([])
    setUsedQuestionIds([])
    setSessionScores({})
  }, [])

  // Derived: pool exhausted
  const wordsExhausted = useMemo(() => {
    if (!config) return false
    if (config.gameMode === 'question') {
      return drawQuestion(allQuestionSubcategories, config.selectedSubcategories, usedQuestionIds) === null
    }
    return drawWord(allSubcategories, config.selectedSubcategories, usedWordIds, config.customWords) === null
  }, [config, usedQuestionIds, usedWordIds])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, sound, toggleSound }}>
      <GameContext.Provider
        value={{
          config,
          round,
          usedWordIds,
          usedQuestionIds,
          wordsExhausted,
          sessionScores,
          setConfig,
          startRound,
          advanceReveal,
          advanceSpeaker,
          startVoting,
          submitVote,
          advanceVote,
          processVotes,
          startRevote,
          proceedToResults,
          resetUsedWords,
          resetGame,
        }}
      >
        {children}
      </GameContext.Provider>
    </ThemeContext.Provider>
  )
}

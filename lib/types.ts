export type ThemeId = 'dark-neon' | 'gradient-glass' | 'bold-bright' | 'retro-y2k' | 'sunset-vibe' | 'ocean-deep' | 'candy-pop' | 'rose-gold' | 'dark-academia' | 'cyber-pulse'
export type ImposterHint = 'category' | 'pairedWord' | 'hint' | 'nothing'
export type GameMode = 'word' | 'question' | 'chameleon'

export interface WordEntry {
  id: string
  word: string
  paired?: string
  hint?: string
}

export interface QuestionEntry {
  id: string
  question: string
  imposterQuestion: string
}

export interface SubCategoryData {
  id: string
  name: string
  category: string
  words: WordEntry[]
}

export interface QuestionSubCategoryData {
  id: string
  name: string
  category: string
  questions: QuestionEntry[]
}

export interface CategoryGroup {
  id: string
  name: string
  subcategories: SubCategoryData[] | QuestionSubCategoryData[]
}

export interface GameConfig {
  players: string[]
  gameMode: GameMode
  selectedSubcategories: string[]
  customWords: Record<string, string[]>
  imposterRange: [number, number]
  imposterHint: ImposterHint
  speedRound: { enabled: boolean; duration: number }
  timer: { enabled: boolean; duration: number }
  lastStand: boolean
}

export interface RoundState {
  word: string
  pairedWord: string | undefined
  hint: string | undefined
  subcategoryId: string
  subcategoryName: string
  imposters: string[]
  revealIndex: number
  speakerIndex: number
  votes: Record<string, string>
  tiedPlayers: string[]
  isRevote: boolean
  phase: 'reveal' | 'clue' | 'vote' | 'tally' | 'results'
  wordGrid?: string[]
  chameleonGuess?: string
}

export interface GameState {
  config: GameConfig | null
  round: RoundState | null
  usedWordIds: string[]
  usedQuestionIds: string[]
  theme: ThemeId
  sound: boolean
}

export interface ThemeConfig {
  id: ThemeId
  label: string
  swatch: string
}

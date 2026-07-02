export type ThemeId = 'dark-neon' | 'gradient-glass' | 'bold-bright' | 'retro-y2k'
export type ImposterHint = 'category' | 'pairedWord' | 'hint' | 'nothing'

export interface WordEntry {
  id: string
  word: string
  paired?: string
  hint?: string
}

export interface SubCategoryData {
  id: string
  name: string
  category: string
  words: WordEntry[]
}

export interface CategoryGroup {
  id: string
  name: string
  subcategories: SubCategoryData[]
}

export interface GameConfig {
  players: string[]
  selectedSubcategories: string[]
  customWords: Record<string, string[]>
  imposterRange: [number, number]
  imposterHint: ImposterHint
  speedRound: { enabled: boolean; duration: number }
  timer: { enabled: boolean; duration: number }
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
}

export interface GameState {
  config: GameConfig | null
  round: RoundState | null
  usedWordIds: string[]
  theme: ThemeId
  sound: boolean
}

export interface ThemeConfig {
  id: ThemeId
  label: string
  swatch: string
}

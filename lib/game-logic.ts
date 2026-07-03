import { QuestionSubCategoryData, SubCategoryData, WordEntry, QuestionEntry } from './types'

export function assignImposters(players: string[], range: [number, number]): string[] {
  const [min, max] = range
  const clampedMax = Math.min(max, players.length)
  const clampedMin = Math.max(1, Math.min(min, clampedMax))
  const count = Math.floor(clampedMin + Math.random() * (clampedMax - clampedMin + 1))

  const shuffled = [...players].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

interface DrawnWord {
  entry: WordEntry
  subcategoryId: string
  subcategoryName: string
}

export function drawWord(
  subcategories: SubCategoryData[],
  selectedIds: string[],
  usedWordIds: string[],
  customWords: Record<string, string[]>
): DrawnWord | null {
  const pool: DrawnWord[] = []

  for (const sub of subcategories) {
    if (!selectedIds.includes(sub.id)) continue

    for (const word of sub.words) {
      if (!usedWordIds.includes(word.id)) {
        pool.push({ entry: word, subcategoryId: sub.id, subcategoryName: sub.name })
      }
    }

    const custom = customWords[sub.id] ?? []
    for (const cw of custom) {
      const cwId = `custom-${sub.id}-${cw}`
      if (!usedWordIds.includes(cwId)) {
        pool.push({
          entry: { id: cwId, word: cw },
          subcategoryId: sub.id,
          subcategoryName: sub.name,
        })
      }
    }
  }

  if (pool.length === 0) return null

  return pool[Math.floor(Math.random() * pool.length)]
}

interface DrawnQuestion {
  entry: QuestionEntry
  subcategoryId: string
  subcategoryName: string
}

export function drawQuestion(
  subcategories: QuestionSubCategoryData[],
  selectedIds: string[],
  usedQuestionIds: string[]
): DrawnQuestion | null {
  const pool: DrawnQuestion[] = []

  for (const sub of subcategories) {
    if (!selectedIds.includes(sub.id)) continue

    for (const q of sub.questions) {
      if (!usedQuestionIds.includes(q.id)) {
        pool.push({ entry: q, subcategoryId: sub.id, subcategoryName: sub.name })
      }
    }
  }

  if (pool.length === 0) return null

  return pool[Math.floor(Math.random() * pool.length)]
}

interface DrawnChameleon {
  entry: WordEntry
  subcategoryId: string
  subcategoryName: string
  wordGrid: string[]
}

const GRID_SIZE = 16

export function drawChameleonRound(
  subcategories: SubCategoryData[],
  selectedIds: string[],
  usedWordIds: string[]
): DrawnChameleon | null {
  const pool: DrawnWord[] = []
  const allWordStrings: string[] = []

  for (const sub of subcategories) {
    if (!selectedIds.includes(sub.id)) continue
    for (const word of sub.words) {
      allWordStrings.push(word.word)
      if (!usedWordIds.includes(word.id)) {
        pool.push({ entry: word, subcategoryId: sub.id, subcategoryName: sub.name })
      }
    }
  }

  if (pool.length === 0) return null

  const drawn = pool[Math.floor(Math.random() * pool.length)]
  const secretWord = drawn.entry.word

  const decoyPool = allWordStrings.filter(w => w !== secretWord)
  const shuffledDecoys = decoyPool.sort(() => Math.random() - 0.5)
  const decoys = shuffledDecoys.slice(0, GRID_SIZE - 1)

  const grid = [...decoys, secretWord].sort(() => Math.random() - 0.5)

  return {
    entry: drawn.entry,
    subcategoryId: drawn.subcategoryId,
    subcategoryName: drawn.subcategoryName,
    wordGrid: grid,
  }
}

export function tallyVotes(votes: Record<string, string>): Map<string, number> {
  const tally = new Map<string, number>()
  for (const votedFor of Object.values(votes)) {
    tally.set(votedFor, (tally.get(votedFor) ?? 0) + 1)
  }
  return tally
}

export function findTiedPlayers(tally: Map<string, number>, eligiblePlayers?: string[]): string[] {
  if (tally.size === 0) return []
  const eligible = eligiblePlayers ?? [...tally.keys()]
  const filteredTally = new Map([...tally].filter(([k]) => eligible.includes(k)))
  if (filteredTally.size === 0) return []
  const maxVotes = Math.max(...filteredTally.values())
  const leaders = [...filteredTally.entries()].filter(([, v]) => v === maxVotes).map(([k]) => k)
  return leaders.length > 1 ? leaders : []
}

export function getVotedOut(tally: Map<string, number>, eligiblePlayers?: string[]): string | null {
  if (tally.size === 0) return null
  const eligible = eligiblePlayers ?? [...tally.keys()]
  const filteredTally = new Map([...tally].filter(([k]) => eligible.includes(k)))
  if (filteredTally.size === 0) return null
  const maxVotes = Math.max(...filteredTally.values())
  const leaders = [...filteredTally.entries()].filter(([, v]) => v === maxVotes).map(([k]) => k)
  if (leaders.length > 1) return null
  return leaders[0]
}

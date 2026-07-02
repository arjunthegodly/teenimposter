import { ThemeConfig, ThemeId } from './types'

export const themes: ThemeConfig[] = [
  { id: 'dark-neon',       label: 'Dark Neon',       swatch: '#8B5CF6' },
  { id: 'gradient-glass',  label: 'Gradient Glass',  swatch: '#7C3AED' },
  { id: 'bold-bright',     label: 'Bold & Bright',   swatch: '#F97316' },
  { id: 'retro-y2k',       label: 'Retro Y2K',       swatch: '#FF0090' },
  { id: 'sunset-vibe',     label: 'Sunset Vibe',     swatch: '#FF6B9D' },
  { id: 'ocean-deep',      label: 'Ocean Deep',      swatch: '#00D4FF' },
  { id: 'candy-pop',       label: 'Candy Pop',       swatch: '#E91E8C' },
]

export const defaultTheme: ThemeId = 'dark-neon'

export const THEME_KEY = 'teenimposter-theme'
export const SOUND_KEY = 'teenimposter-sound'

'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette } from 'lucide-react'
import { useTheme } from './Providers'
import { themes } from '@/lib/theme-config'
import { ThemeId } from '@/lib/types'

export function ThemePicker() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50" data-no-transition>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full flex items-center justify-center card glow-primary transition-transform active:scale-90"
        aria-label="Change theme"
      >
        <Palette size={18} style={{ color: 'var(--primary)' }} />
      </button>

      {open && (
        <div className="absolute top-12 right-0 card p-3 flex flex-col gap-2 w-44 shadow-xl">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id as ThemeId); setOpen(false) }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all active:scale-95"
              style={{
                background: theme === t.id ? 'var(--primary)' : 'transparent',
                color: theme === t.id ? '#fff' : 'var(--foreground)',
                fontFamily: 'var(--font-body-family)',
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 border-2"
                style={{
                  backgroundColor: t.swatch,
                  borderColor: theme === t.id ? '#fff' : t.swatch,
                }}
              />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

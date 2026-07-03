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

  const current = themes.find(t => t.id === theme)

  return (
    <div ref={ref} className="fixed top-4 right-4 z-50" data-no-transition>
      <button
        onClick={() => setOpen(o => !o)}
        className="h-9 px-3 rounded-full flex items-center gap-2 transition-all active:scale-90"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-border)',
        }}
        aria-label="Change theme"
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: current?.swatch ?? 'var(--primary)' }}
        />
        <Palette size={14} style={{ color: 'var(--muted)' }} />
      </button>

      {open && (
        <div
          className="absolute top-11 right-0 p-2 flex flex-col gap-0.5 w-52 rounded-2xl shadow-2xl overflow-y-auto"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            maxHeight: 'calc(100dvh - 80px)',
          }}
        >
          <p className="text-xs px-3 pt-1 pb-2 font-medium uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Theme
          </p>
          {themes.map(t => {
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id as ThemeId); setOpen(false) }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all active:scale-95 text-left"
                style={{
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--foreground)',
                  fontFamily: 'var(--font-body-family)',
                }}
              >
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0 ring-2"
                  style={{
                    background: t.swatch,
                    boxShadow: isActive ? `0 0 0 2px rgba(255,255,255,0.4)` : 'none',
                  }}
                />
                <span className="flex-1">{t.label}</span>
                {isActive && (
                  <span className="text-xs opacity-70">✓</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

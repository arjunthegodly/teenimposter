'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface ChipInputProps {
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  maxChips?: number
}

export function ChipInput({ values, onChange, placeholder = 'Add word...', maxChips = 50 }: ChipInputProps) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed || values.includes(trimmed) || values.length >= maxChips) return
    onChange([...values, trimmed])
    setInput('')
  }

  const remove = (v: string) => onChange(values.filter(x => x !== v))

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            color: 'var(--foreground)',
          }}
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          className="px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-40"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          Add
        </button>
      </div>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map(v => (
            <span
              key={v}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--card-border)',
                color: 'var(--foreground)',
              }}
            >
              {v}
              <button
                onClick={() => remove(v)}
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                aria-label={`Remove ${v}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

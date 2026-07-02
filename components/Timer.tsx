'use client'

import { useEffect, useRef, useState } from 'react'

interface TimerProps {
  seconds: number
  onExpire: () => void
  running?: boolean
  className?: string
}

export function Timer({ seconds, onExpire, running = true, className = '' }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setRemaining(seconds)
    expiredRef.current = false
  }, [seconds])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          if (!expiredRef.current) {
            expiredRef.current = true
            onExpireRef.current()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const isLow = remaining <= 10
  const pct = (remaining / seconds) * 100

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`text-5xl font-heading tabular-nums font-bold transition-colors ${
          isLow ? 'animate-pulse' : ''
        }`}
        style={{ color: isLow ? '#EF4444' : 'var(--primary)' }}
      >
        {String(Math.floor(remaining / 60)).padStart(2, '0')}:
        {String(remaining % 60).padStart(2, '0')}
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--card)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: isLow ? '#EF4444' : 'var(--primary)',
          }}
        />
      </div>
    </div>
  )
}

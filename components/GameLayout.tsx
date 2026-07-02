'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface GameLayoutProps {
  children: React.ReactNode
}

export function GameLayout({ children }: GameLayoutProps) {
  const path = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="flex flex-col flex-1 w-full max-w-md mx-auto px-5 py-6 pt-16"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}

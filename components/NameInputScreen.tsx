'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface NameInputScreenProps {
  onStart: (playerName: string) => void
}

export default function NameInputScreen({ onStart }: NameInputScreenProps) {
  const [playerName, setPlayerName] = useState('')

  const handleSubmit = () => {
    if (playerName.trim()) {
      onStart(playerName.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-burgundy flex items-center justify-center z-[300] p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 my-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-nokia font-bold text-gold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 md:mb-8 text-center"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          }}
        >
          👤 Enter Your Name
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 sm:mb-8"
        >
          <label className="block font-nokia text-off-white text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
            Please enter your name to participate in the quiz:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            maxLength={20}
            placeholder="Your name"
            autoFocus
            className="w-full font-nokia text-base sm:text-lg md:text-xl px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-off-white placeholder-off-white/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ y: -1, scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!playerName.trim()}
          className="w-full font-nokia font-bold text-gold text-base sm:text-lg md:text-xl py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-[52px]"
          style={{
            background: playerName.trim() ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          }}
        >
          Start Quiz
        </motion.button>
      </motion.div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getQuizAttemptsByPlayer, checkDeviceEligibility } from '@/utils/quizAttemptUtils'

interface NameInputScreenProps {
  onStart: (playerName: string) => void
}

export default function NameInputScreen({ onStart }: NameInputScreenProps) {
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const handleSubmit = async () => {
    if (!playerName.trim() || isChecking) return

    setIsChecking(true)
    setError(null)

    try {
      // Check if device (session) has already completed a quiz
      const { eligible, message } = await checkDeviceEligibility()

      if (!eligible) {
        setError(message || 'You have already played the quiz!')
        setIsChecking(false)
        return
      }

      // No longer blocking on name - multiple people can have same name
      // Logic for retrieving score by name still works as leaderboard shows duplicates fine

      onStart(playerName.trim())
    } catch (err) {
      console.error('Error checking player status:', err)
      // Allow proceeding if check fails? Or block? 
      // Safe default: let them play if check fails (connectivity issues), or block?
      // Given the prize constraint, maybe standard error is better.
      // But let's act robustly. If check fails, we might just let them play or show generic error.
      // For now, show generic error.
      setError('Unable to verify player status. Please try again.')
      setIsChecking(false)
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
            onChange={(e) => {
              setPlayerName(e.target.value)
              setError(null)
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            maxLength={20}
            placeholder="Your name"
            autoFocus
            disabled={isChecking}
            className="w-full font-nokia text-base sm:text-lg md:text-xl px-4 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-off-white placeholder-off-white/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50 disabled:opacity-50"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-red-400 font-nokia text-sm sm:text-base text-center"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ y: -1, scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!playerName.trim() || isChecking}
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
          {isChecking ? 'Checking...' : 'Start Quiz'}
        </motion.button>
      </motion.div>
    </div>
  )
}


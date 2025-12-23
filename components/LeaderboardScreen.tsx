'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTopScores, clearLeaderboard } from '@/utils/leaderboardUtils'
import { LeaderboardEntry } from '@/types/leaderboard'

interface LeaderboardScreenProps {
  onBack: () => void
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true)
      const topScores = await getTopScores(20)
      setScores(topScores)
      setIsLoading(false)
    }
    loadScores()
  }, [])

  const handleClear = async () => {
    const success = await clearLeaderboard()
    if (success) {
      setScores([])
      setShowClearConfirm(false)
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 bg-burgundy flex items-center justify-center z-[600] p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
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
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-nokia font-bold text-gold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 text-center"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          }}
        >
          🏆 Leaderboard
        </motion.h1>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="font-nokia text-off-white text-base sm:text-lg mb-4">
              Loading leaderboard...
            </p>
          </motion.div>
        ) : scores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="font-nokia text-off-white text-base sm:text-lg mb-4">
              No scores yet. Be the first to make it to the leaderboard!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 max-h-[60vh] overflow-y-auto">
            {scores.map((entry, index) => (
              <motion.div
                key={`${entry.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                  index === 0
                    ? 'bg-gold/20 border-2 border-gold'
                    : index < 3
                    ? 'bg-gold/10 border border-gold/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className={`font-nokia font-bold text-lg sm:text-xl md:text-2xl flex-shrink-0 ${
                      index === 0 ? 'text-gold' : index < 3 ? 'text-gold/80' : 'text-off-white'
                    }`}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-nokia font-bold text-off-white text-sm sm:text-base md:text-lg truncate">
                      {entry.name || 'Anonymous'}
                    </div>
                    <div className="font-nokia text-off-white/70 text-xs sm:text-sm">
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-nokia font-bold text-gold text-base sm:text-lg md:text-xl">
                    {entry.score}/{entry.totalQuestions}
                  </div>
                  <div className="font-nokia text-off-white/70 text-xs sm:text-sm">
                    {entry.percentage}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ y: 0, scale: 0.98 }}
            onClick={onBack}
            className="flex-1 font-nokia font-bold text-gold text-base sm:text-lg md:text-xl py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 min-h-[44px] sm:min-h-[52px]"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            Back
          </motion.button>

          {scores.length > 0 && (
            <>
              {!showClearConfirm ? (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  onClick={() => setShowClearConfirm(true)}
                  className="flex-1 font-nokia font-bold text-red-300 text-base sm:text-lg md:text-xl py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 min-h-[44px] sm:min-h-[52px]"
                  style={{
                    background: 'rgba(255, 0, 0, 0.15)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Clear
                </motion.button>
              ) : (
                <div className="flex-1 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    className="flex-1 font-nokia font-bold text-white text-sm sm:text-base py-3 rounded-xl cursor-pointer bg-red-500"
                  >
                    Confirm
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 font-nokia font-bold text-off-white text-sm sm:text-base py-3 rounded-xl cursor-pointer bg-white/10"
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}


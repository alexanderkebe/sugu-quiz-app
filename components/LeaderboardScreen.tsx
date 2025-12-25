'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTopScores, deleteOwnEntry, getSessionId } from '@/utils/leaderboardUtils'
import { LeaderboardEntry } from '@/types/leaderboard'

interface LeaderboardScreenProps {
  onBack: () => void
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const currentSessionId = getSessionId()

  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true)
      const topScores = await getTopScores(20)
      setScores(topScores)
      setIsLoading(false)
    }
    loadScores()
  }, [])

  const handleDelete = async (entryId: number) => {
    if (!entryId || !confirm('Are you sure you want to delete your score?')) {
      return
    }

    setDeletingId(entryId)
    const success = await deleteOwnEntry(entryId)
    if (success) {
      // Reload scores after deletion
      const topScores = await getTopScores(20)
      setScores(topScores)
    } else {
      alert('Failed to delete entry. It may not belong to you.')
    }
    setDeletingId(null)
  }

  const isOwnEntry = (entry: LeaderboardEntry): boolean => {
    return entry.sessionId === currentSessionId && !!entry.id
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
            {(() => {
              // Calculate ranks for all entries
              const ranks: number[] = []
              let currentRank = 1
              
              scores.forEach((entry, index) => {
                if (index === 0) {
                  ranks.push(1)
                } else {
                  const prevEntry = scores[index - 1]
                  // If score and percentage are the same, use same rank
                  if (prevEntry.score === entry.score && prevEntry.percentage === entry.percentage) {
                    ranks.push(ranks[index - 1])
                  } else {
                    // Different score/percentage = new rank
                    currentRank = index + 1
                    ranks.push(currentRank)
                  }
                }
              })

              return scores.map((entry, index) => {
                const rank = ranks[index]
                const isTopThree = rank <= 3
              
                return (
                <motion.div
                key={`${entry.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                  rank === 1
                    ? 'bg-gold/20 border-2 border-gold'
                    : isTopThree
                    ? 'bg-gold/10 border border-gold/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className={`font-nokia font-bold text-lg sm:text-xl md:text-2xl flex-shrink-0 ${
                      rank === 1 ? 'text-gold' : isTopThree ? 'text-gold/80' : 'text-off-white'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
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
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="font-nokia font-bold text-gold text-base sm:text-lg md:text-xl">
                      {entry.score}/{entry.totalQuestions}
                    </div>
                    <div className="font-nokia text-off-white/70 text-xs sm:text-sm">
                      {entry.percentage}%
                    </div>
                  </div>
                  {isOwnEntry(entry) && entry.id && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(entry.id!)}
                      disabled={deletingId === entry.id}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-2"
                      title="Delete your score"
                    >
                      {deletingId === entry.id ? '⏳' : '🗑️'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
              )
            })
            })()}
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
        </div>
      </motion.div>
    </div>
  )
}


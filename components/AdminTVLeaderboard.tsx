'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTopScores } from '@/utils/leaderboardUtils'
import { LeaderboardEntry } from '@/types/leaderboard'

export default function AdminTVLeaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(true)
      const topScores = await getTopScores(10) // Show top 10 without scrolling
      setScores(topScores)
      setIsLoading(false)
    }

    loadScores()

    // Auto-refresh every 10 seconds
    const interval = setInterval(loadScores, 10000)

    return () => clearInterval(interval)
  }, [])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="h-screen bg-gradient-to-br from-burgundy via-[#7a0f1f] to-burgundy p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-4 sm:mb-6 lg:mb-8 flex-shrink-0"
      >
        <motion.h1
          className="font-nokia font-bold text-gold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2"
          style={{
            textShadow: '0 4px 20px rgba(238, 193, 48, 0.5), 0 0 40px rgba(238, 193, 48, 0.3)',
          }}
          animate={{
            textShadow: [
              '0 4px 20px rgba(238, 193, 48, 0.5), 0 0 40px rgba(238, 193, 48, 0.3)',
              '0 4px 30px rgba(238, 193, 48, 0.7), 0 0 60px rgba(238, 193, 48, 0.5)',
              '0 4px 20px rgba(238, 193, 48, 0.5), 0 0 40px rgba(238, 193, 48, 0.3)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          🏆 LEADERBOARD 🏆
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-nokia text-off-white text-sm sm:text-base md:text-lg lg:text-xl"
        >
          Top Performers
        </motion.p>
      </motion.div>

      {/* Leaderboard */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-6xl"
          >
            ⏳
          </motion.div>
          <p className="font-nokia text-off-white text-2xl sm:text-3xl mt-4">Loading...</p>
        </motion.div>
      ) : scores.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="font-nokia text-off-white text-2xl sm:text-3xl lg:text-4xl">
            No scores yet
          </p>
        </motion.div>
      ) : (
        <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4 overflow-hidden">
          <AnimatePresence>
            {(() => {
              // Calculate ranks for all entries
              const ranks: number[] = []
              
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
                    ranks.push(index + 1)
                  }
                }
              })

              return scores.map((entry, index) => {
                const rank = ranks[index]
                const isTopThree = rank <= 3
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'

              return (
                <motion.div
                  key={`${entry.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 100, scale: 0.8 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 flex-shrink-0 ${
                    isTopThree
                      ? 'bg-gradient-to-r from-gold/30 via-gold/20 to-gold/10 border-2 sm:border-3 border-gold'
                      : 'bg-white/10 border border-white/20'
                  }`}
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: isTopThree
                      ? '0 8px 32px rgba(238, 193, 48, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)'
                      : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Rank Badge */}
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <motion.div
                      className={`font-nokia font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex-shrink-0 ${
                        isTopThree ? 'text-gold' : 'text-off-white/60'
                      }`}
                      animate={
                        isTopThree
                          ? {
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {isTopThree ? medal : `#${rank}`}
                    </motion.div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <motion.div
                        className={`font-nokia font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1 ${
                          isTopThree ? 'text-gold' : 'text-off-white'
                        }`}
                        style={{
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {entry.name || 'Anonymous'}
                      </motion.div>
                      <div className="font-nokia text-off-white/70 text-xs sm:text-sm md:text-base lg:text-lg">
                        {formatDate(entry.timestamp)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <motion.div
                        className={`font-nokia font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1 ${
                          isTopThree ? 'text-gold' : 'text-gold/90'
                        }`}
                        style={{
                          textShadow: '0 2px 10px rgba(238, 193, 48, 0.5)',
                        }}
                        animate={
                          isTopThree
                            ? {
                                scale: [1, 1.05, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        {entry.score}/{entry.totalQuestions}
                      </motion.div>
                      <div className="font-nokia text-off-white/80 text-sm sm:text-base md:text-lg lg:text-xl">
                        {entry.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Top 3 */}
                  {isTopThree && (
                    <motion.div
                      className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold to-gold/60 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.7, duration: 1 }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )
            })
            })()}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center mt-2 sm:mt-4 flex-shrink-0"
      >
        <p className="font-nokia text-off-white/60 text-xs sm:text-sm md:text-base">
          Auto-refreshing every 10 seconds
        </p>
      </motion.div>
    </div>
  )
}


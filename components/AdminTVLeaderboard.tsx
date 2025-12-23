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
      const topScores = await getTopScores(10) // Top 10 for TV display
      setScores(topScores)
      setIsLoading(false)
    }

    loadScores()

    // Auto-refresh every 5 seconds
    const interval = setInterval(loadScores, 5000)

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
    <div className="min-h-screen bg-gradient-to-br from-burgundy via-[#7a0f1f] to-burgundy p-8 sm:p-12 lg:p-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 sm:mb-12 lg:mb-16"
      >
        <motion.h1
          className="font-nokia font-bold text-gold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4"
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
          className="font-nokia text-off-white text-lg sm:text-xl md:text-2xl lg:text-3xl"
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
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          <AnimatePresence>
            {scores.map((entry, index) => {
              const isTopThree = index < 3
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'

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
                  className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 ${
                    isTopThree
                      ? 'bg-gradient-to-r from-gold/30 via-gold/20 to-gold/10 border-4 border-gold'
                      : 'bg-white/10 border-2 border-white/20'
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
                  <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                    <motion.div
                      className={`font-nokia font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl flex-shrink-0 ${
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
                      {isTopThree ? medal : `#${index + 1}`}
                    </motion.div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <motion.div
                        className={`font-nokia font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 ${
                          isTopThree ? 'text-gold' : 'text-off-white'
                        }`}
                        style={{
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {entry.name || 'Anonymous'}
                      </motion.div>
                      <div className="font-nokia text-off-white/70 text-base sm:text-lg md:text-xl lg:text-2xl">
                        {formatDate(entry.timestamp)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <motion.div
                        className={`font-nokia font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 ${
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
                      <div className="font-nokia text-off-white/80 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                        {entry.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Top 3 */}
                  {isTopThree && (
                    <motion.div
                      className="mt-4 sm:mt-6 h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden"
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
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center mt-8 sm:mt-12 lg:mt-16"
      >
        <p className="font-nokia text-off-white/60 text-sm sm:text-base md:text-lg">
          Auto-refreshing every 5 seconds
        </p>
      </motion.div>
    </div>
  )
}


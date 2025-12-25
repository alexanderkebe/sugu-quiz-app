'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTopScores } from '@/utils/leaderboardUtils'
import { LeaderboardEntry } from '@/types/leaderboard'

export default function AdminTVLeaderboard() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newEntryIds, setNewEntryIds] = useState<Set<number>>(new Set())
  const previousScoresRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const loadScores = async () => {
      setIsLoading(false) // Don't show loading after first load
      const topScores = await getTopScores(50)
      
      // Detect new entries by comparing IDs
      const currentIds = new Set(topScores.map(entry => entry.id || entry.timestamp))
      const previousIds = previousScoresRef.current
      
      // Find new entries (entries that weren't in previous set)
      const newIds = new Set<number>()
      topScores.forEach(entry => {
        const entryId = entry.id || entry.timestamp
        if (!previousIds.has(entryId)) {
          newIds.add(entryId)
        }
      })
      
      // Update previous scores reference
      previousScoresRef.current = currentIds
      
      // Set new entry IDs for animation
      if (newIds.size > 0) {
        setNewEntryIds(newIds)
        // Clear the highlight after animation completes
        setTimeout(() => {
          setNewEntryIds(new Set())
        }, 3000)
      }
      
      setScores(topScores)
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

  const isNewEntry = (entry: LeaderboardEntry) => {
    const entryId = entry.id || entry.timestamp
    return newEntryIds.has(entryId)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-burgundy via-[#7a0f1f] to-burgundy p-4 sm:p-6 lg:p-8 flex flex-col">
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
        <div 
          className="flex-1 max-w-6xl mx-auto w-full overflow-y-auto overflow-x-hidden pr-2 pb-4 leaderboard-scroll" 
          style={{ 
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(238, 193, 48, 0.5) transparent',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            minHeight: 0, // Important for flex children to allow scrolling
          }}
        >
          <div className="space-y-2 sm:space-y-3 lg:space-y-4 py-2">
            <AnimatePresence mode="popLayout">
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
                  const isNew = isNewEntry(entry)
                  const entryId = entry.id || entry.timestamp

                  return (
                    <motion.div
                      key={entryId}
                      layout
                      initial={isNew ? { opacity: 0, scale: 0.5, y: -50, rotateX: -90 } : { opacity: 0, x: -100, scale: 0.8 }}
                      animate={isNew ? { 
                        opacity: 1, 
                        scale: [0.5, 1.1, 1], 
                        y: 0, 
                        rotateX: 0,
                        boxShadow: [
                          '0 0 0px rgba(238, 193, 48, 0)',
                          '0 0 40px rgba(238, 193, 48, 0.8)',
                          '0 8px 32px rgba(238, 193, 48, 0.4)',
                        ]
                      } : { opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 100, scale: 0.8 }}
                      transition={isNew ? {
                        duration: 0.8,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      } : {
                        duration: 0.5,
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 100,
                      }}
                      whileHover={{ 
                        scale: 1.03, 
                        x: 5,
                        zIndex: 10,
                        transition: { duration: 0.2 }
                      }}
                      className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 ${
                        isTopThree
                          ? 'bg-gradient-to-r from-gold/30 via-gold/20 to-gold/10 border-2 sm:border-[3px] border-gold'
                          : isNew
                          ? 'bg-gradient-to-r from-gold/40 via-gold/30 to-gold/20 border-2 sm:border-[3px] border-gold'
                          : 'bg-white/10 border border-white/20'
                      }`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: isTopThree
                          ? '0 8px 32px rgba(238, 193, 48, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2)'
                          : isNew
                          ? '0 12px 48px rgba(238, 193, 48, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
                          : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        transformStyle: 'preserve-3d',
                        marginBottom: isNew ? '8px' : '0',
                      }}
                    >
                      {/* New Entry Badge */}
                      {isNew && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0, rotate: 180 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="absolute -top-2 -right-2 bg-gold text-burgundy font-nokia font-bold text-xs sm:text-sm px-2 py-1 rounded-full z-20"
                          style={{
                            boxShadow: '0 4px 12px rgba(238, 193, 48, 0.8)',
                          }}
                        >
                          ✨ NEW
                        </motion.div>
                      )}

                      {/* Rank Badge */}
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <motion.div
                          className={`font-nokia font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl flex-shrink-0 ${
                            isTopThree ? 'text-gold' : isNew ? 'text-gold' : 'text-off-white/60'
                          }`}
                          animate={
                            isTopThree || isNew
                              ? {
                                  scale: [1, 1.15, 1],
                                  rotate: [0, 10, -10, 0],
                                }
                              : {}
                          }
                          transition={{
                            duration: 2,
                            repeat: isNew ? 0 : Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          {isTopThree ? medal : `#${rank}`}
                        </motion.div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <motion.div
                            className={`font-nokia font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1 ${
                              isTopThree || isNew ? 'text-gold' : 'text-off-white'
                            }`}
                            style={{
                              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                            }}
                            animate={isNew ? {
                              scale: [1, 1.05, 1],
                            } : {}}
                            transition={isNew ? {
                              duration: 0.6,
                              repeat: 2,
                            } : {}}
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
                              isTopThree || isNew ? 'text-gold' : 'text-gold/90'
                            }`}
                            style={{
                              textShadow: '0 2px 10px rgba(238, 193, 48, 0.5)',
                            }}
                            animate={
                              isTopThree || isNew
                                ? {
                                    scale: [1, 1.1, 1],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 2,
                              repeat: isNew ? 0 : Infinity,
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

                      {/* Progress Bar for Top 3 or New Entries */}
                      {(isTopThree || isNew) && (
                        <motion.div
                          className="mt-2 sm:mt-3 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: (isNew ? 0.4 : index * 0.1) + 0.5, duration: 1 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-gold to-gold/60 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.percentage}%` }}
                            transition={{ delay: (isNew ? 0.4 : index * 0.1) + 0.7, duration: 1 }}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })
              })()}
            </AnimatePresence>
          </div>
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

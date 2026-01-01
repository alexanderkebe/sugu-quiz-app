'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  getAllQuizAttempts,
  getQuizAttemptsByPlayer,
  deleteQuizAttempt,
  cleanupExpiredAttempts,
  QuizAttemptWithResponses,
} from '@/utils/quizAttemptUtils'

export default function QuizAttemptsAdminPage() {
  const [attempts, setAttempts] = useState<QuizAttemptWithResponses[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttemptWithResponses | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    // Enable scrolling on admin pages
    document.body.classList.add('admin-page')
    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [])

  useEffect(() => {
    loadAttempts()
  }, [])

  const loadAttempts = async () => {
    setIsLoading(true)
    const allAttempts = await getAllQuizAttempts()
    setAttempts(allAttempts)
    setIsLoading(false)
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadAttempts()
      return
    }

    setIsLoading(true)
    const playerAttempts = await getQuizAttemptsByPlayer(searchTerm.trim())
    setAttempts(playerAttempts)
    setIsLoading(false)
  }

  const handleDelete = async (attemptId: number) => {
    if (!confirm('Are you sure you want to delete this quiz attempt?')) {
      return
    }

    setDeletingId(attemptId)
    const success = await deleteQuizAttempt(attemptId)
    if (success) {
      await loadAttempts()
      if (selectedAttempt?.id === attemptId) {
        setSelectedAttempt(null)
      }
    } else {
      alert('Failed to delete attempt')
    }
    setDeletingId(null)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getExpiryInfo = (expiresAt: Date | undefined) => {
    if (!expiresAt) return null
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry.getTime() - now.getTime()
    
    if (diffMs <= 0) return { text: 'Expired', color: 'bg-red-500/30 text-red-300' }
    
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 10) return { text: `${diffMins}m left`, color: 'bg-red-500/30 text-red-300' }
    if (diffMins < 30) return { text: `${diffMins}m left`, color: 'bg-orange-500/30 text-orange-300' }
    return { text: `${diffMins}m left`, color: 'bg-green-500/30 text-green-300' }
  }

  const filteredAttempts = attempts.filter((attempt) => {
    if (!searchTerm.trim()) return true
    return attempt.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy via-[#7a0f1f] to-burgundy p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link
              href="/admin"
              className="font-nokia text-gold hover:text-gold/80 text-lg sm:text-xl"
            >
              ← Dashboard
            </Link>
            <h1 className="font-nokia font-bold text-gold text-3xl sm:text-4xl md:text-5xl text-center flex-1">
              📊 Quiz Attempts Admin
            </h1>
            <div className="w-24"></div>
          </div>
          <p className="font-nokia text-off-white text-center text-base sm:text-lg">
            View detailed quiz attempts and user responses
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-3"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '1rem',
          }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by player name..."
            className="w-full font-nokia text-base sm:text-lg px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-off-white placeholder-off-white/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50 min-h-[44px]"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className="flex-1 font-nokia font-bold text-gold text-base sm:text-lg px-4 py-3 rounded-xl cursor-pointer min-h-[44px]"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              🔍 Search
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadAttempts}
              className="flex-1 font-nokia font-bold text-off-white text-base sm:text-lg px-4 py-3 rounded-xl cursor-pointer min-h-[44px]"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              🔄 Refresh
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Attempts List */}
          <div className={`lg:col-span-1 ${selectedAttempt && 'lg:block hidden'}`}>
            {isLoading ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block text-6xl"
                >
                  ⏳
                </motion.div>
                <p className="font-nokia text-off-white text-xl sm:text-2xl mt-4">Loading...</p>
              </div>
            ) : filteredAttempts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-nokia text-off-white text-xl sm:text-2xl">No attempts found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] sm:max-h-[80vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(238, 193, 48, 0.5) transparent', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
                <AnimatePresence>
                  {filteredAttempts.map((attempt) => (
                    <motion.div
                      key={attempt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => setSelectedAttempt(attempt)}
                      className={`p-4 rounded-xl cursor-pointer transition-all min-h-[80px] ${
                        selectedAttempt?.id === attempt.id
                          ? 'ring-2 ring-gold bg-gold/20'
                          : 'bg-white/10 active:bg-white/15'
                      }`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-nokia font-bold text-gold text-base sm:text-lg mb-1 truncate">
                            {attempt.playerName}
                          </div>
                          <div className="font-nokia text-off-white/70 text-xs sm:text-sm">
                            {formatDate(attempt.createdAt)}
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            attempt.id && handleDelete(attempt.id)
                          }}
                          disabled={deletingId === attempt.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        >
                          {deletingId === attempt.id ? '⏳' : '🗑️'}
                        </motion.button>
                      </div>
                      <div className="flex gap-4 text-sm flex-wrap">
                        <div>
                          <span className="font-nokia text-off-white/70">Score: </span>
                          <span className="font-nokia font-bold text-gold">
                            {attempt.score}/{attempt.totalQuestions}
                          </span>
                        </div>
                        <div>
                          <span className="font-nokia text-off-white/70">%: </span>
                          <span className="font-nokia font-bold text-gold">{attempt.percentage}%</span>
                        </div>
                        {(() => {
                          const expiryInfo = getExpiryInfo(attempt.expiresAt)
                          return expiryInfo ? (
                            <div className={`font-nokia text-xs px-2 py-1 rounded-full ${expiryInfo.color}`}>
                              ⏱️ {expiryInfo.text}
                            </div>
                          ) : null
                        })()}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Detailed View */}
          <div className={`lg:col-span-2 ${selectedAttempt ? 'block' : 'hidden lg:block'}`}>
            {selectedAttempt ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-6 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="font-nokia font-bold text-gold text-lg sm:text-xl md:text-2xl flex-1">
                      {selectedAttempt.playerName}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedAttempt(null)}
                      className="lg:hidden px-3 py-2 rounded-xl bg-white/10 text-off-white hover:bg-white/20 font-nokia min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      ✕
                    </motion.button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 text-sm sm:text-base">
                    <div>
                      <span className="font-nokia text-off-white/70">Score: </span>
                      <span className="font-nokia font-bold text-gold">
                        {selectedAttempt.score}/{selectedAttempt.totalQuestions}
                      </span>
                    </div>
                    <div>
                      <span className="font-nokia text-off-white/70">Percentage: </span>
                      <span className="font-nokia font-bold text-gold">{selectedAttempt.percentage}%</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      <span className="font-nokia text-off-white/70">Date: </span>
                      <span className="font-nokia text-off-white">{formatDate(selectedAttempt.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(238, 193, 48, 0.5) transparent', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
                  {selectedAttempt.responses.map((response, index) => (
                    <motion.div
                      key={response.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 sm:p-4 rounded-xl ${
                        response.isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3 flex-wrap gap-2">
                        <div className="font-nokia font-bold text-gold text-sm sm:text-base md:text-lg">
                          Question {index + 1}
                        </div>
                        <div
                          className={`font-nokia font-bold text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 rounded-full ${
                            response.isCorrect
                              ? 'bg-green-500/30 text-green-300'
                              : 'bg-red-500/30 text-red-300'
                          }`}
                        >
                          {response.isCorrect ? '✓ Correct' : '✗ Wrong'}
                        </div>
                      </div>

                      <div className="font-nokia text-off-white text-xs sm:text-sm md:text-base mb-2 sm:mb-3 leading-relaxed">
                        {response.questionText}
                      </div>

                      <div className="space-y-2">
                        {response.questionOptions.map((option, optIndex) => {
                          const isUserAnswer = response.userAnswer === optIndex
                          const isCorrectAnswer = response.correctAnswer === optIndex
                          const isTimeout = response.userAnswer === -1

                          return (
                            <div
                              key={optIndex}
                              className={`p-2 sm:p-3 rounded-lg font-nokia text-xs sm:text-sm md:text-base ${
                                isCorrectAnswer
                                  ? 'bg-gold/20 border-2 border-gold text-gold font-bold'
                                  : isUserAnswer && !isCorrectAnswer
                                  ? 'bg-red-500/20 border-2 border-red-500 text-red-300'
                                  : 'bg-white/5 border border-white/10 text-off-white/70'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-bold">{String.fromCharCode(65 + optIndex)}.</span>
                                <span className="flex-1 break-words">{option}</span>
                                <div className="flex gap-2 flex-wrap">
                                  {isCorrectAnswer && <span className="text-gold text-xs sm:text-sm">✓ Correct</span>}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="text-red-300 text-xs sm:text-sm">✗ User's Answer</span>
                                  )}
                                  {isTimeout && optIndex === 0 && (
                                    <span className="text-orange-300 text-xs sm:text-sm">⏱️ Timeout</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {response.userAnswer === null && (
                        <div className="mt-2 text-orange-300 font-nokia text-xs sm:text-sm">
                          ⚠️ Question not answered
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <p className="font-nokia text-off-white/50 text-lg sm:text-xl">
                  Select an attempt to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


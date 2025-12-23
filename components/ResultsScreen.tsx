'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Question } from '@/types/quiz'
import { addToLeaderboard } from '@/utils/leaderboardUtils'

interface ResultsScreenProps {
  answers: number[]
  questions: Question[]
  onPlayAgain: () => void
  onShowLeaderboard: () => void
}

export default function ResultsScreen({
  answers,
  questions,
  onPlayAgain,
  onShowLeaderboard,
}: ResultsScreenProps) {
  const [playerName, setPlayerName] = useState('')
  const [nameSubmitted, setNameSubmitted] = useState(false)
  const [showNameInput, setShowNameInput] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const score = useMemo(() => {
    return answers.reduce((acc, answer, index) => {
      // -1 indicates timeout (wrong), check if answer matches correct answer
      if (answer === -1) return acc
      return acc + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }, [answers, questions])

  const totalQuestions = questions.length
  const percentage = Math.round((score / totalQuestions) * 100)

  const handleNameSubmit = async () => {
    if (playerName.trim() && !isSubmitting) {
      setIsSubmitting(true)
      const success = await addToLeaderboard({
        name: playerName.trim(),
        score,
        totalQuestions,
        percentage,
      })
      setIsSubmitting(false)
      if (success) {
        setNameSubmitted(true)
        setShowNameInput(false)
      } else {
        // Show error message if save failed
        // Check if Supabase is properly configured (supports both old and new key formats)
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
        const errorMsg = !isValidKey
          ? 'Supabase not configured. Please add your API key to .env.local file. See GET_API_KEY.md for instructions.'
          : 'Failed to save score. Check browser console (F12) for details. Make sure the database table exists and you ran the SQL script.'
        alert(errorMsg)
        console.error('Score save failed. Check the console above for detailed error information.')
      }
    }
  }

  const getMessage = () => {
    if (percentage >= 85) {
      return {
        title: 'Excellent! 🎉',
        message: 'You have a deep understanding of the teachings!',
      }
    } else if (percentage >= 70) {
      return {
        title: 'Great Job! 👏',
        message: 'You did well! Keep learning and growing.',
      }
    } else if (percentage >= 50) {
      return {
        title: 'Good Effort! 💪',
        message: 'You are on the right path. Continue studying!',
      }
    } else {
      return {
        title: 'Keep Learning! 📚',
        message: 'Every journey begins with a single step. Keep going!',
      }
    }
  }

  const message = getMessage()

  return (
    <div className="fixed inset-0 bg-burgundy flex items-center justify-center z-[500] p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 text-center my-auto"
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
          className="font-nokia font-bold text-gold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          }}
        >
          {message.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="font-nokia font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gold mb-2">
            {score} / {totalQuestions}
          </div>
          <div className="font-nokia text-off-white text-base sm:text-lg md:text-xl lg:text-2xl">
            {percentage}% Correct
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="font-nokia text-off-white text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 leading-relaxed"
        >
          {message.message}
        </motion.p>

        {/* Name Input */}
        <AnimatePresence>
          {showNameInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="mb-4 sm:mb-6"
            >
              <label className="block font-nokia text-off-white text-sm sm:text-base mb-2">
                Enter your name for the leaderboard:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                  maxLength={20}
                  placeholder="Your name"
                  className="flex-1 font-nokia text-base sm:text-lg px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-off-white placeholder-off-white/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNameSubmit}
                  disabled={!playerName.trim() || isSubmitting}
                  className="font-nokia font-bold text-gold text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-xl cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  style={{
                    background: playerName.trim() ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </motion.button>
              </div>
              {nameSubmitted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-nokia text-gold text-sm sm:text-base mt-2"
                >
                  ✓ Score saved!
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: nameSubmitted ? 0.9 : 0.8 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ y: -1, scale: 0.98 }}
            onClick={onPlayAgain}
            className="flex-1 font-nokia font-bold text-gold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 min-h-[44px] sm:min-h-[52px]"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            Play Again
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: nameSubmitted ? 1.0 : 0.9 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ y: -1, scale: 0.98 }}
            onClick={onShowLeaderboard}
            className="flex-1 font-nokia font-bold text-gold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 min-h-[44px] sm:min-h-[52px]"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            🏆 Leaderboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}


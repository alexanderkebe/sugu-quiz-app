'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Question } from '@/types/quiz'
import { addToLeaderboard } from '@/utils/leaderboardUtils'
import { saveQuizAttempt } from '@/utils/quizAttemptUtils'
import { soundManager } from '@/utils/soundEffects'

interface ResultsScreenProps {
  answers: number[]
  questions: Question[]
  playerName: string
  attemptNumber: number
  onPlayAgain: () => void
  onShowLeaderboard: () => void
}

export default function ResultsScreen({
  answers,
  questions,
  playerName,
  attemptNumber,
  onPlayAgain,
  onShowLeaderboard,
}: ResultsScreenProps) {
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
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

  // Play result sound based on performance
  useEffect(() => {
    // Play sound when results screen appears
    if (percentage >= 85) {
      soundManager.playExcellentResult()
    } else if (percentage >= 70) {
      soundManager.playGoodResult()
    } else if (percentage >= 50) {
      soundManager.playOkayResult()
    } else {
      soundManager.playPoorResult()
    }
  }, [percentage])

  // Ref to prevent double-saving in React Strict Mode
  const hasSavedRef = useRef(false)

  // Automatically save score and quiz attempt when results screen loads
  useEffect(() => {
    const saveScore = async () => {
      // Use ref to prevent double execution in React Strict Mode
      if (hasSavedRef.current) return
      if (!playerName.trim()) return

      hasSavedRef.current = true
      setIsSubmitting(true)

      try {
        let success = false;
        // ONLY save to leaderboard if it's the first attempt
        if (attemptNumber === 1) {
          success = await addToLeaderboard({
            name: playerName.trim(),
            score,
            totalQuestions,
            percentage,
          })
        } else {
          console.log(`Attempt #${attemptNumber}: Skipping leaderboard update. Only 1st attempt counts!`);
          success = true; // Mark as "success" so we don't show an error, but we didn't update leaderboard
        }

        // ALWAYS save quiz attempt with all responses (regardless of leaderboard success)
        // This is important so admins can see EXACTLY what was answered and on which attempt
        await saveQuizAttempt(playerName.trim(), questions, answers, score, percentage)

        setIsSubmitting(false)
        if (success) {
          setScoreSubmitted(true)
        } else {
          // Show error message if save failed
          const anonKey = (process as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
          const errorMsg = !isValidKey
            ? 'Supabase not configured. Please add your API key to .env.local file.'
            : 'Failed to save score. Check bridge.'
          console.error(errorMsg)
        }
      } catch (error) {
        console.error('Error saving score:', error)
        setIsSubmitting(false)
      }
    }

    saveScore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once when component mounts

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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold font-nokia text-sm sm:text-base mb-4"
        >
          🔄 Attempt #{attemptNumber}
        </motion.div>

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

        {/* Score Save Status */}
        {isSubmitting && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-nokia text-gold text-sm sm:text-base mb-4"
          >
            Saving your attempt...
          </motion.p>
        )}
        {scoreSubmitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-nokia text-gold text-sm sm:text-base mb-4"
          >
            {attemptNumber === 1
              ? '✓ Score saved to leaderboard!'
              : '✓ Attempt recorded! (Only 1st attempt counts for leaderboard)'}
          </motion.p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ y: -1, scale: 0.98 }}
            onClick={onPlayAgain}
            className="flex-1 font-nokia font-bold text-burgundy text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 min-h-[44px] sm:min-h-[52px]"
            style={{
              background: 'linear-gradient(to bottom, #FFD700, #DAA520)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
            }}
          >
            🔄 Play Again
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
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


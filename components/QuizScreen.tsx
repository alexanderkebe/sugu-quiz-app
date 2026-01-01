'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Question } from '@/types/quiz'
import { soundManager } from '@/utils/soundEffects'

interface QuizScreenProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswerSelect: (answerIndex: number) => void
  currentScore: number
  attemptNumber: number
}

export default function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  currentScore,
  attemptNumber,
}: QuizScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isTimeout, setIsTimeout] = useState(false)
  const [isHintActive, setIsHintActive] = useState(false)
  const [eliminatedAnswers, setEliminatedAnswers] = useState<number[]>([])
  const [showGlow, setShowGlow] = useState(false)
  // Calculate total hints for the game: Attempt 1 = 0, Attempt 2 = 2, Attempt 3 = 4, Attempt 4+ = 5
  const totalGameHints = Math.min(5, Math.max(0, (attemptNumber - 1) * 2))
  const [hintsRemaining, setHintsRemaining] = useState(totalGameHints)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset states when question changes
  useEffect(() => {
    setEliminatedAnswers([])
    setIsHintActive(false)
    setShowGlow(false)
    setTimeLeft(60)
    setIsTimeout(false)
    setSelectedAnswer(null)
    setIsLocked(false)
    setIsHintActive(false)

    // Play sound when new question appears
    soundManager.playNewQuestion()

    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev: any) => {
        const newTime = prev <= 1 ? 0 : prev - 1

        // Play clock tick every second
        if (newTime > 0) {
          soundManager.playClockTick()
        }

        // Play warning sound at key intervals: 10, 5, 3, 2, 1 (in addition to tick)
        if (newTime > 0 && newTime <= 10 && [10, 5, 3, 2, 1].includes(newTime)) {
          soundManager.playWarning()
        }

        return newTime
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [questionNumber])

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && !isLocked) {
      setIsTimeout(true)
      setIsLocked(true)
      // Play timeout sound
      soundManager.playTimeout()
      // Mark as wrong answer (null or -1 to indicate timeout)
      // We'll show the correct answer but mark user as having gotten it wrong
      setTimeout(() => {
        onAnswerSelect(-1) // -1 indicates timeout
      }, 2000) // Show timeout message for 2 seconds
    }
  }, [timeLeft, isLocked, onAnswerSelect])

  const handleAnswerClick = (index: number) => {
    if (isLocked) return

    // Play click sound
    soundManager.playClick()

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setSelectedAnswer(index)
    setIsLocked(true)

    // Play correct/wrong sound after a short delay to show result
    setTimeout(() => {
      if (index === question.correctAnswer) {
        soundManager.playCorrect()
      } else {
        soundManager.playWrong()
      }
    }, 100)

    onAnswerSelect(index)
  }

  const handleHintClick = () => {
    if (isLocked || hintsRemaining <= 0 || isHintActive) return

    soundManager.playClick()
    setHintsRemaining(prev => prev - 1)
    setIsHintActive(true)

    // Probability roll: 80% Eliminate, 20% Glow
    const roll = Math.random()
    if (roll < 0.8) {
      // Eliminate wrong answers
      const wrongAnswerIndices = question.options
        .map((_, i) => i)
        .filter(i => i !== question.correctAnswer && !eliminatedAnswers.includes(i))

      // Scale based on attempts: 4+ attempts = eliminate 2, otherwise 1
      const numToEliminate = attemptNumber > 4 ? 2 : 1
      const shuffled = [...wrongAnswerIndices].sort(() => Math.random() - 0.5)
      const toEliminate = shuffled.slice(0, numToEliminate)

      setEliminatedAnswers(prev => [...prev, ...toEliminate])
    } else {
      // Glow correct answer once (2 seconds)
      setShowGlow(true)
      setTimeout(() => {
        setShowGlow(false)
      }, 2000)
    }
  }

  const progress = (questionNumber / totalQuestions) * 100

  return (
    <div className="fixed inset-0 bg-burgundy flex flex-col z-[400]">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-black/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gold"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-4 pt-6 sm:p-6 sm:pt-10 md:p-8 md:pt-12 overflow-y-auto">
        {/* Header Section */}
        <div className="w-full max-w-3xl mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Attempt Counter & Question Progress */}
            <div className="flex flex-col items-center sm:items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-nokia font-bold text-gold/80 text-xs sm:text-sm uppercase tracking-wider mb-1"
              >
                📍 Attempt #{attemptNumber}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-nokia text-gold text-sm sm:text-base md:text-lg"
              >
                Question {questionNumber} of {totalQuestions}
              </motion.div>
            </div>

            {/* Middle: Score & Timer */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-nokia font-bold text-sm sm:text-base md:text-lg px-3 py-1.5 rounded-lg text-gold whitespace-nowrap"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                🎯 {currentScore}/{questionNumber - 1 || 0}
              </motion.div>

              <motion.div
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={`font-nokia font-bold text-lg sm:text-xl md:text-2xl px-3 py-1.5 rounded-lg w-20 text-center ${timeLeft <= 10 ? 'text-red-400' : 'text-gold'}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                ⏱️ {timeLeft}
              </motion.div>
            </div>

            {/* Right: Hint Button */}
            {attemptNumber > 1 && (
              <motion.button
                whileHover={!isLocked && hintsRemaining > 0 ? { scale: 1.05 } : {}}
                whileTap={!isLocked && hintsRemaining > 0 ? { scale: 0.95 } : {}}
                onClick={handleHintClick}
                disabled={isLocked || hintsRemaining <= 0 || isHintActive}
                className={`px-4 py-2 rounded-xl font-nokia font-bold flex items-center gap-2 transition-all ${isHintActive ? 'bg-gold text-burgundy' : 'bg-white/10 text-gold hover:bg-white/20'}`}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  opacity: hintsRemaining <= 0 ? 0.5 : 1
                }}
              >
                <span>💡 Hint</span>
                <span className="bg-black/20 px-2 py-0.5 rounded-lg text-xs">{hintsRemaining}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Timeout Message */}
        <AnimatePresence>
          {isTimeout && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-nokia font-bold text-base sm:text-lg md:text-xl text-red-400"
              style={{
                background: 'rgba(255, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
              }}
            >
              ⏰ Timeout!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mb-4 sm:mb-6 md:mb-8"
        >
          <div
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            <h2 className="font-nokia font-bold text-gold text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
              {question.text}
            </h2>
          </div>
        </motion.div>

        {/* Answer Options */}
        <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
          <AnimatePresence>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correctAnswer
              const isEliminated = eliminatedAnswers.includes(index)
              const showResult = isLocked && (isTimeout || isSelected)
              const showCorrectAnswer = isLocked // Always show correct answer when locked
              const isHintHighlight = isHintActive && isCorrect && showGlow

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isHintHighlight ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 4px 16px rgba(238, 193, 48, 0.2)',
                      '0 4px 32px rgba(238, 193, 48, 0.5)',
                      '0 4px 16px rgba(238, 193, 48, 0.2)'
                    ]
                  } : {
                    opacity: isEliminated ? 0 : 1,
                    x: 0,
                    scale: isEliminated ? 0.95 : 1
                  }}
                  transition={isHintHighlight ? {
                    duration: 1.0,
                    repeat: 2, // Glow briefly
                    ease: "easeInOut"
                  } : { duration: 0.4, delay: index * 0.1 }}
                  whileHover={!isLocked && !isEliminated ? { scale: 1.02, x: 5 } : {}}
                  whileTap={!isLocked && !isEliminated ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerClick(index)}
                  disabled={isLocked || isEliminated}
                  className={`w-full text-left font-nokia transition-all duration-500 min-h-[44px] sm:min-h-[52px] ${isLocked || isEliminated ? 'cursor-not-allowed' : 'cursor-pointer'
                    } ${isEliminated ? 'pointer-events-none' : ''}`}
                  style={{
                    background:
                      showCorrectAnswer && isCorrect
                        ? 'rgba(238, 193, 48, 0.3)'
                        : isHintHighlight
                          ? 'rgba(238, 193, 48, 0.5)'
                          : showResult && isSelected && !isCorrect
                            ? 'rgba(255, 0, 0, 0.2)'
                            : isSelected
                              ? 'rgba(255, 255, 255, 0.2)'
                              : 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `2px solid ${showCorrectAnswer && isCorrect || isHintHighlight
                      ? 'rgba(238, 193, 48, 0.8)'
                      : showResult && isSelected && !isCorrect
                        ? 'rgba(255, 0, 0, 0.6)'
                        : 'rgba(255, 255, 255, 0.2)'
                      }`,
                    borderRadius: '16px',
                    color: '#F5F5F0',
                    visibility: isEliminated ? 'hidden' as any : 'visible' as any,
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6">
                    <span className={`text-base sm:text-lg md:text-xl font-bold flex-shrink-0 ${isHintHighlight ? 'text-white' : 'text-gold'}`}>
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="flex-1 text-sm sm:text-base md:text-lg leading-relaxed">{option}</span>
                    {(showCorrectAnswer && isCorrect || isHintHighlight) && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-xl sm:text-2xl text-gold flex-shrink-0"
                      >
                        {isHintHighlight && !isLocked ? '✨' : '✓'}
                      </motion.span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-xl sm:text-2xl text-red-400 flex-shrink-0"
                      >
                        ✗
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

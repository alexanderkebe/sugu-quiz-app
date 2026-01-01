'use client'

import { useState, useEffect } from 'react'
import SplashScreen from '@/components/SplashScreen'
import RulesScreen from '@/components/RulesScreen'
import NameInputScreen from '@/components/NameInputScreen'
import QuizScreen from '@/components/QuizScreen'
import ResultsScreen from '@/components/ResultsScreen'
import LeaderboardScreen from '@/components/LeaderboardScreen'
import { getQuestionsFromDatabase } from '@/utils/questionUtils'
import { getRandomQuizQuestions } from '@/utils/quizUtils'
import { Question } from '@/types/quiz'
import { quizData } from '@/data/quizData' // Fallback if database fails

export type GameState = 'splash' | 'rules' | 'nameInput' | 'quiz' | 'results' | 'leaderboard'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('splash')
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [playerName, setPlayerName] = useState('')
  const [attemptNumber, setAttemptNumber] = useState(1)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])

  // Load questions from database on mount
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await getQuestionsFromDatabase()
      if (questions.length > 0) {
        setAllQuestions(questions)
      } else {
        // Fallback to local data if database is empty or fails
        console.warn('No questions in database, using fallback data')
        setAllQuestions(quizData)
      }
    }
    loadQuestions()
  }, [])

  const handleSplashComplete = () => {
    setGameState('rules')
  }

  const handleRulesComplete = () => {
    setGameState('nameInput')
  }

  const handleNameSubmit = async (name: string, count: number) => {
    setPlayerName(name)
    setAttemptNumber(count + 1) // Next attempt number

    // Fetch fresh questions from database every time a quiz starts
    const freshQuestions = await getQuestionsFromDatabase()
    const isFromDatabase = freshQuestions.length > 0
    const questionsToUse = isFromDatabase ? freshQuestions : quizData

    // Log the source of questions
    /*  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
     console.log(`📚 Questions loaded from: ${isFromDatabase ? '✅ DATABASE' : '⚠️ LOCAL FALLBACK (quizData.ts)'}`)
     console.log(`📊 Total questions available: ${questionsToUse.length}`)
      */
    // Select 7 random questions
    const randomQuestions = getRandomQuizQuestions(questionsToUse)

    // Log the selected random questions
    /*    console.log(`🎲 7 Random questions selected:`)
       randomQuestions.forEach((q, i) => {
         console.log(`   ${i + 1}. ${q.text.substring(0, 60)}...`)
       })
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        */
    setSelectedQuestions(randomQuestions)
    setGameState('quiz')
    setCurrentQuestion(0)
    setAnswers([])
    setCurrentScore(0)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    // -1 indicates timeout (wrong answer)
    const answerToStore = answerIndex === -1 ? -1 : answerIndex
    const newAnswers = [...answers, answerToStore]
    setAnswers(newAnswers)

    // Update score if answer is correct (use functional update to avoid stale state)
    if (answerIndex !== -1 && answerIndex === selectedQuestions[currentQuestion].correctAnswer) {
      setCurrentScore((prevScore) => prevScore + 1)
    }

    if (currentQuestion < selectedQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1)
      }, 2000) // Give time to see the result
    } else {
      setTimeout(() => {
        setGameState('results')
      }, 2000)
    }
  }

  const handlePlayAgain = () => {
    console.log('🔄 Play Again clicked - resetting game state')
    setGameState('nameInput') // Return to name input or straight to quiz? 
    // Usually name input is better to verify identity/attempt.
    setAnswers([])
    setCurrentQuestion(0)
    setCurrentScore(0)
    setSelectedQuestions([])
  }

  return (
    <main className="w-full h-screen overflow-hidden">
      {gameState === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {gameState === 'rules' && <RulesScreen onStart={handleRulesComplete} />}
      {gameState === 'nameInput' && <NameInputScreen onStart={handleNameSubmit} />}
      {gameState === 'quiz' && selectedQuestions.length > 0 && (
        <QuizScreen
          question={selectedQuestions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={selectedQuestions.length}
          onAnswerSelect={handleAnswerSelect}
          currentScore={currentScore}
          attemptNumber={attemptNumber}
        />
      )}
      {gameState === 'results' && (
        <ResultsScreen
          answers={answers}
          questions={selectedQuestions}
          playerName={playerName}
          attemptNumber={attemptNumber}
          onPlayAgain={handlePlayAgain}
          onShowLeaderboard={() => setGameState('leaderboard')}
        />
      )}
      {gameState === 'leaderboard' && (
        <LeaderboardScreen onBack={() => setGameState('results')} />
      )}
    </main>
  )
}

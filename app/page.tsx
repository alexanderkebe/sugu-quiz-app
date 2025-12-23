'use client'

import { useState, useEffect } from 'react'
import SplashScreen from '@/components/SplashScreen'
import RulesScreen from '@/components/RulesScreen'
import QuizScreen from '@/components/QuizScreen'
import ResultsScreen from '@/components/ResultsScreen'
import LeaderboardScreen from '@/components/LeaderboardScreen'
import { quizData } from '@/data/quizData'
import { getRandomQuizQuestions } from '@/utils/quizUtils'
import { Question } from '@/types/quiz'

export type GameState = 'splash' | 'rules' | 'quiz' | 'results' | 'leaderboard'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('splash')
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentScore, setCurrentScore] = useState(0)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])

  const handleSplashComplete = () => {
    setGameState('rules')
  }

  const handleStartQuiz = () => {
    // Select 7 random questions and shuffle them
    const randomQuestions = getRandomQuizQuestions(quizData)
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

    // Update score if answer is correct
    if (answerIndex !== -1 && answerIndex === selectedQuestions[currentQuestion].correctAnswer) {
      setCurrentScore(currentScore + 1)
    }

    if (currentQuestion < selectedQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 2000) // Give time to see the result
    } else {
      setTimeout(() => {
        setGameState('results')
      }, 2000)
    }
  }

  const handlePlayAgain = () => {
    setGameState('splash')
    setAnswers([])
    setCurrentQuestion(0)
    setCurrentScore(0)
    setSelectedQuestions([])
  }

  return (
    <main className="w-full h-screen overflow-hidden">
      {gameState === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {gameState === 'rules' && <RulesScreen onStart={handleStartQuiz} />}
      {gameState === 'quiz' && selectedQuestions.length > 0 && (
        <QuizScreen
          question={selectedQuestions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={selectedQuestions.length}
          onAnswerSelect={handleAnswerSelect}
          currentScore={currentScore}
        />
      )}
      {gameState === 'results' && (
        <ResultsScreen
          answers={answers}
          questions={selectedQuestions}
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


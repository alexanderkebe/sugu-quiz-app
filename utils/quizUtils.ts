import { Question } from '@/types/quiz'

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Randomly selects 7 questions from the available questions and shuffles them
 */
export function getRandomQuizQuestions(allQuestions: Question[]): Question[] {
  // Shuffle all questions first
  const shuffled = shuffleArray(allQuestions)
  
  // Select first 7 questions
  return shuffled.slice(0, 7)
}


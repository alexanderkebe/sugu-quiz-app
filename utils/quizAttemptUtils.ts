import { Question } from '@/types/quiz'
import { supabase } from '@/lib/supabase'
import { getSessionId } from './leaderboardUtils'

export interface QuizAttempt {
  id?: number
  playerName: string
  sessionId?: string
  score: number
  totalQuestions: number
  percentage: number
  createdAt?: Date
}

export interface QuizAttemptResponse {
  id?: number
  attemptId: number
  questionId?: number
  questionText: string
  userAnswer: number | null // -1 for timeout, null if not answered
  correctAnswer: number
  isCorrect: boolean
  questionOptions: string[]
  createdAt?: Date
}

export interface QuizAttemptWithResponses extends QuizAttempt {
  responses: QuizAttemptResponse[]
}

/**
 * Save a quiz attempt with all responses
 */
export async function saveQuizAttempt(
  playerName: string,
  questions: Question[],
  answers: number[],
  score: number,
  percentage: number
): Promise<number | null> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Cannot save quiz attempt.')
      return null
    }

    const sessionId = getSessionId()

    // Insert quiz attempt
    const { data: attemptData, error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        player_name: playerName,
        session_id: sessionId || null,
        score,
        total_questions: questions.length,
        percentage,
      })
      .select('id')
      .single()

    if (attemptError || !attemptData) {
      console.error('Error saving quiz attempt:', attemptError)
      return null
    }

    const attemptId = attemptData.id

    // Prepare responses
    const responses = questions.map((question, index) => {
      const userAnswer = answers[index] ?? null
      const isCorrect = userAnswer !== null && userAnswer !== -1 && userAnswer === question.correctAnswer

      return {
        attempt_id: attemptId,
        question_text: question.text,
        user_answer: userAnswer,
        correct_answer: question.correctAnswer,
        is_correct: isCorrect,
        question_options: question.options,
      }
    })

    // Insert all responses
    const { error: responsesError } = await supabase
      .from('quiz_attempt_responses')
      .insert(responses)

    if (responsesError) {
      console.error('Error saving quiz responses:', responsesError)
      // Attempt is saved, but responses failed - still return attempt ID
    }

    return attemptId
  } catch (error) {
    console.error('Error saving quiz attempt:', error)
    return null
  }
}

/**
 * Get all quiz attempts with responses
 */
export async function getAllQuizAttempts(): Promise<QuizAttemptWithResponses[]> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured.')
      return []
    }

    // Fetch attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .order('created_at', { ascending: false })

    if (attemptsError || !attempts) {
      console.error('Error fetching quiz attempts:', attemptsError)
      return []
    }

    // Fetch all responses
    const attemptIds = attempts.map((a) => a.id)
    const { data: responses, error: responsesError } = await supabase
      .from('quiz_attempt_responses')
      .select('*')
      .in('attempt_id', attemptIds)
      .order('id', { ascending: true })

    if (responsesError) {
      console.error('Error fetching quiz responses:', responsesError)
    }

    // Group responses by attempt_id
    const responsesByAttempt = new Map<number, QuizAttemptResponse[]>()
    if (responses) {
      responses.forEach((response) => {
        const attemptId = response.attempt_id
        if (!responsesByAttempt.has(attemptId)) {
          responsesByAttempt.set(attemptId, [])
        }
        responsesByAttempt.get(attemptId)!.push({
          id: response.id,
          attemptId: response.attempt_id,
          questionId: response.question_id || undefined,
          questionText: response.question_text,
          userAnswer: response.user_answer,
          correctAnswer: response.correct_answer,
          isCorrect: response.is_correct,
          questionOptions: response.question_options || [],
          createdAt: response.created_at ? new Date(response.created_at) : undefined,
        })
      })
    }

    // Combine attempts with responses
    return attempts.map((attempt) => ({
      id: attempt.id,
      playerName: attempt.player_name,
      sessionId: attempt.session_id || undefined,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      percentage: attempt.percentage,
      createdAt: attempt.created_at ? new Date(attempt.created_at) : undefined,
      responses: responsesByAttempt.get(attempt.id) || [],
    }))
  } catch (error) {
    console.error('Error fetching quiz attempts:', error)
    return []
  }
}

/**
 * Get quiz attempts for a specific player
 */
export async function getQuizAttemptsByPlayer(playerName: string): Promise<QuizAttemptWithResponses[]> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured.')
      return []
    }

    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('player_name', playerName)
      .order('created_at', { ascending: false })

    if (attemptsError || !attempts) {
      console.error('Error fetching quiz attempts:', attemptsError)
      return []
    }

    const attemptIds = attempts.map((a) => a.id)
    const { data: responses, error: responsesError } = await supabase
      .from('quiz_attempt_responses')
      .select('*')
      .in('attempt_id', attemptIds)
      .order('id', { ascending: true })

    if (responsesError) {
      console.error('Error fetching quiz responses:', responsesError)
    }

    const responsesByAttempt = new Map<number, QuizAttemptResponse[]>()
    if (responses) {
      responses.forEach((response) => {
        const attemptId = response.attempt_id
        if (!responsesByAttempt.has(attemptId)) {
          responsesByAttempt.set(attemptId, [])
        }
        responsesByAttempt.get(attemptId)!.push({
          id: response.id,
          attemptId: response.attempt_id,
          questionId: response.question_id || undefined,
          questionText: response.question_text,
          userAnswer: response.user_answer,
          correctAnswer: response.correct_answer,
          isCorrect: response.is_correct,
          questionOptions: response.question_options || [],
          createdAt: response.created_at ? new Date(response.created_at) : undefined,
        })
      })
    }

    return attempts.map((attempt) => ({
      id: attempt.id,
      playerName: attempt.player_name,
      sessionId: attempt.session_id || undefined,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      percentage: attempt.percentage,
      createdAt: attempt.created_at ? new Date(attempt.created_at) : undefined,
      responses: responsesByAttempt.get(attempt.id) || [],
    }))
  } catch (error) {
    console.error('Error fetching quiz attempts:', error)
    return []
  }
}

/**
 * Delete a quiz attempt (and cascade delete responses)
 */
export async function deleteQuizAttempt(attemptId: number): Promise<boolean> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured.')
      return false
    }

    const { error } = await supabase.from('quiz_attempts').delete().eq('id', attemptId)

    if (error) {
      console.error('Error deleting quiz attempt:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting quiz attempt:', error)
    return false
  }
}


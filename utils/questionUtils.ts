import { Question } from '@/types/quiz'
import { supabase } from '@/lib/supabase'

export interface QuestionWithId extends Question {
  id?: number
}

/**
 * Fetch all active questions from the database
 */
export async function getQuestionsFromDatabase(): Promise<Question[]> {
  try {
    // Check if Supabase is properly configured
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Falling back to empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching questions:', error)
      return []
    }

    if (!data || data.length === 0) {
      console.warn('No questions found in database. Please run the migration script.')
      return []
    }

    // Transform database format to Question format
    return data.map((entry) => ({
      text: entry.text,
      options: entry.options || [],
      correctAnswer: entry.correct_answer,
    }))
  } catch (error) {
    console.error('Error reading questions from database:', error)
    return []
  }
}

/**
 * Fetch all active questions with IDs (for admin panel)
 */
export async function getQuestionsWithIds(): Promise<QuestionWithId[]> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured.')
      return []
    }

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching questions:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    return data.map((entry) => ({
      id: entry.id,
      text: entry.text,
      options: entry.options || [],
      correctAnswer: entry.correct_answer,
    }))
  } catch (error) {
    console.error('Error reading questions from database:', error)
    return []
  }
}

/**
 * Add a new question to the database
 */
export async function addQuestion(question: Question): Promise<number | null> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      const errorMsg = '❌ Supabase not configured. Cannot add question. Please check NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      console.warn(errorMsg)
      throw new Error(errorMsg)
    }

    // Validate question data
    if (!question.text || question.text.trim().length === 0) {
      throw new Error('Question text is required')
    }
    if (!question.options || question.options.length < 2) {
      throw new Error('Question must have at least 2 options')
    }
    if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
      throw new Error(`Correct answer index ${question.correctAnswer} is out of range (0-${question.options.length - 1})`)
    }

    console.log(`📝 Adding question: "${question.text.substring(0, 50)}..." with ${question.options.length} options, correct answer: ${question.correctAnswer}`)

    const { data, error } = await supabase
      .from('questions')
      .insert({
        text: question.text.trim(),
        options: question.options,
        correct_answer: question.correctAnswer,
        is_active: true,
      })
      .select('id')
      .single()

    if (error) {
      console.error('❌ Error adding question to database:', error)
      console.error('   Error code:', error.code)
      console.error('   Error message:', error.message)
      console.error('   Error details:', error.details)
      console.error('   Error hint:', error.hint)
      throw new Error(`Database error: ${error.message} (Code: ${error.code})`)
    }

    if (!data || !data.id) {
      console.error('❌ No data returned after insert')
      throw new Error('No data returned after insert')
    }

    return data.id
  } catch (error) {
    console.error('❌ Exception adding question:', error)
    throw error // Re-throw to let caller handle it
  }
}

/**
 * Update an existing question
 */
export async function updateQuestion(id: number, question: Question): Promise<boolean> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Cannot update question.')
      return false
    }

    const { error } = await supabase
      .from('questions')
      .update({
        text: question.text,
        options: question.options,
        correct_answer: question.correctAnswer,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating question:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating question:', error)
    return false
  }
}

/**
 * Delete a question (soft delete by setting is_active to false)
 */
export async function deleteQuestion(id: number): Promise<boolean> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Cannot delete question.')
      return false
    }

    const { error } = await supabase
      .from('questions')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      console.error('Error deleting question:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting question:', error)
    return false
  }
}

/**
 * Get a question by ID
 */
export async function getQuestionById(id: number): Promise<Question | null> {
  try {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured.')
      return null
    }

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.error('Error fetching question:', error)
      return null
    }

    return {
      text: data.text,
      options: data.options || [],
      correctAnswer: data.correct_answer,
    }
  } catch (error) {
    console.error('Error fetching question:', error)
    return null
  }
}


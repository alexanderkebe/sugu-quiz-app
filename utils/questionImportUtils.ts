import { Question } from '@/types/quiz'
import { addQuestion } from './questionUtils'
import { quizData } from '@/data/quizData'

/**
 * Import all questions from quizData.ts to the database
 * This function checks for duplicates and only adds questions that don't already exist
 */
export async function importQuestionsFromQuizData(): Promise<{
  success: number
  failed: number
  skipped: number
  errors: string[]
}> {
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [] as string[],
  }

  try {
    // Get existing questions to check for duplicates
    const { getQuestionsWithIds } = await import('./questionUtils')
    const existingQuestions = await getQuestionsWithIds()

    // Create a set of existing question texts for quick lookup
    const existingTexts = new Set(existingQuestions.map((q) => q.text.trim().toLowerCase()))

    // Import each question from quizData
    for (let i = 0; i < quizData.length; i++) {
      const question = quizData[i]

      try {
        // Check if question already exists
        const questionTextLower = question.text.trim().toLowerCase()
        if (existingTexts.has(questionTextLower)) {
          console.log(`⏭️  Skipping question ${i + 1}: Already exists in database`)
          results.skipped++
          continue
        }

        // Add question to database
        try {
          const id = await addQuestion(question)
          if (id) {
            console.log(`✅ Imported question ${i + 1}/${quizData.length}: ${question.text.substring(0, 50)}...`)
            results.success++
            // Add to existing set to avoid duplicates in the same import
            existingTexts.add(questionTextLower)
          } else {
            console.error(`❌ Failed to import question ${i + 1}: No ID returned`)
            results.failed++
            results.errors.push(`Question ${i + 1}: No ID returned from database`)
          }
        } catch (dbError) {
          console.error(`❌ Database error importing question ${i + 1}:`, dbError)
          results.failed++
          const errorMsg = dbError instanceof Error ? dbError.message : String(dbError)
          results.errors.push(`Question ${i + 1}: ${errorMsg}`)
        }
      } catch (error) {
        console.error(`❌ Error importing question ${i + 1}:`, error)
        results.failed++
        results.errors.push(`Question ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return results
  } catch (error) {
    console.error('Error importing questions:', error)
    results.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return results
  }
}

/**
 * Check how many questions from quizData.ts are already in the database
 */
export async function checkQuestionImportStatus(): Promise<{
  totalInFile: number
  totalInDatabase: number
  missing: number
  percentage: number
}> {
  try {
    const { getQuestionsWithIds } = await import('./questionUtils')
    const existingQuestions = await getQuestionsWithIds()

    const existingTexts = new Set(existingQuestions.map((q) => q.text.trim().toLowerCase()))
    const fileTexts = quizData.map((q) => q.text.trim().toLowerCase())

    let missing = 0
    fileTexts.forEach((text) => {
      if (!existingTexts.has(text)) {
        missing++
      }
    })

    return {
      totalInFile: quizData.length,
      totalInDatabase: existingQuestions.length,
      missing,
      percentage: Math.round(((quizData.length - missing) / quizData.length) * 100),
    }
  } catch (error) {
    console.error('Error checking import status:', error)
    return {
      totalInFile: quizData.length,
      totalInDatabase: 0,
      missing: quizData.length,
      percentage: 0,
    }
  }
}


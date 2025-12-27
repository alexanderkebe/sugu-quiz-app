import { NextResponse } from 'next/server'
import { importQuestionsFromQuizData, checkQuestionImportStatus } from '@/utils/questionImportUtils'

export async function GET() {
  try {
    // Check current status
    const status = await checkQuestionImportStatus()
    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error('Error checking import status:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    console.log('📥 Starting question import...')
    
    // Import all questions
    const results = await importQuestionsFromQuizData()
    
    console.log('📊 Import results:', results)
    
    // Get updated status
    const status = await checkQuestionImportStatus()

    return NextResponse.json({
      success: true,
      results,
      status,
    })
  } catch (error) {
    console.error('❌ Error importing questions:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    )
  }
}


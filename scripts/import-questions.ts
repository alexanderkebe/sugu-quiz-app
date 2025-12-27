/**
 * Script to import all questions from quizData.ts to the database
 * Run this with: npx tsx scripts/import-questions.ts
 */

import { importQuestionsFromQuizData, checkQuestionImportStatus } from '../utils/questionImportUtils'

async function main() {
  console.log('📥 Starting question import from quizData.ts...\n')

  // Check current status
  const status = await checkQuestionImportStatus()
  console.log('📊 Current Status:')
  console.log(`   - Questions in file: ${status.totalInFile}`)
  console.log(`   - Questions in database: ${status.totalInDatabase}`)
  console.log(`   - Missing: ${status.missing}`)
  console.log(`   - Imported: ${status.percentage}%\n`)

  if (status.missing === 0) {
    console.log('✅ All questions are already in the database!')
    return
  }

  console.log('🔄 Importing questions...\n')
  const results = await importQuestionsFromQuizData()

  console.log('\n📊 Import Results:')
  console.log(`   ✅ Successfully imported: ${results.success}`)
  console.log(`   ⏭️  Skipped (duplicates): ${results.skipped}`)
  console.log(`   ❌ Failed: ${results.failed}`)

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach((error) => console.log(`   - ${error}`))
  }

  // Check final status
  const finalStatus = await checkQuestionImportStatus()
  console.log('\n📊 Final Status:')
  console.log(`   - Questions in database: ${finalStatus.totalInDatabase}`)
  console.log(`   - Imported: ${finalStatus.percentage}%`)

  if (results.success > 0) {
    console.log('\n✅ Import completed successfully!')
  } else if (results.failed > 0) {
    console.log('\n⚠️  Import completed with errors. Please check the errors above.')
  } else {
    console.log('\n✅ All questions were already in the database.')
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})


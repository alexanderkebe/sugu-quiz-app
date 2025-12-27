'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  getQuestionsWithIds,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  QuestionWithId,
} from '@/utils/questionUtils'
import { Question } from '@/types/quiz'
import { importQuestionsFromQuizData, checkQuestionImportStatus } from '@/utils/questionImportUtils'

export default function QuestionsAdminPage() {
  const [questions, setQuestions] = useState<QuestionWithId[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Question>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    totalInFile: number
    totalInDatabase: number
    missing: number
    percentage: number
  } | null>(null)

  useEffect(() => {
    // Enable scrolling on admin pages
    document.body.classList.add('admin-page')
    return () => {
      document.body.classList.remove('admin-page')
    }
  }, [])

  useEffect(() => {
    loadQuestions()
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const status = await checkQuestionImportStatus()
    setImportStatus(status)
  }

  const loadQuestions = async () => {
    setIsLoading(true)
    const allQuestions = await getQuestionsWithIds()
    setQuestions(allQuestions)
    setIsLoading(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    })
  }

  const handleEdit = (question: QuestionWithId) => {
    setEditingId(question.id || null)
    setIsAdding(false)
    setFormData({
      text: question.text,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    })
  }

  const handleSave = async () => {
    if (!formData.text.trim()) {
      alert('Please enter question text')
      return
    }

    if (formData.options.filter((opt) => opt.trim()).length < 2) {
      alert('Please enter at least 2 options')
      return
    }

    if (formData.correctAnswer < 0 || formData.correctAnswer >= formData.options.length) {
      alert('Please select a valid correct answer')
      return
    }

    // Filter out empty options
    const filteredOptions = formData.options.filter((opt) => opt.trim())

    const questionToSave: Question = {
      text: formData.text.trim(),
      options: filteredOptions,
      correctAnswer: formData.correctAnswer,
    }

    if (editingId) {
      const success = await updateQuestion(editingId, questionToSave)
      if (success) {
        await loadQuestions()
        handleCancel()
      } else {
        alert('Failed to update question')
      }
    } else {
      const id = await addQuestion(questionToSave)
      if (id) {
        await loadQuestions()
        handleCancel()
      } else {
        alert('Failed to add question')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return
    }

    setDeletingId(id)
    const success = await deleteQuestion(id)
    if (success) {
      await loadQuestions()
    } else {
      alert('Failed to delete question')
    }
    setDeletingId(null)
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ''],
    })
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) {
      alert('Question must have at least 2 options')
      return
    }
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer:
        formData.correctAnswer >= index
          ? Math.max(0, formData.correctAnswer - 1)
          : formData.correctAnswer,
    })
  }

  const handleImport = async () => {
    if (!confirm('Import all questions from quizData.ts? This will skip questions that already exist.')) {
      return
    }

    setIsImporting(true)
    try {
      // Use API route for better error handling
      const response = await fetch('/api/import-questions', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        const results = data.results
        alert(
          `Import complete!\n✅ Successfully imported: ${results.success}\n⏭️  Skipped (duplicates): ${results.skipped}\n❌ Failed: ${results.failed}`
        )
        await loadQuestions()
        await checkStatus()
      } else {
        alert(`Import failed: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy via-[#7a0f1f] to-burgundy p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link
              href="/admin"
              className="font-nokia text-gold hover:text-gold/80 text-lg sm:text-xl"
            >
              ← Dashboard
            </Link>
            <h1 className="font-nokia font-bold text-gold text-3xl sm:text-4xl md:text-5xl text-center flex-1">
              📝 Questions Admin
            </h1>
            <div className="w-24"></div>
          </div>
          <p className="font-nokia text-off-white text-center text-base sm:text-lg">
            Add, edit, and delete quiz questions
          </p>
          {!isLoading && (
            <div className="text-center mt-2">
              <span className="font-nokia text-gold text-sm sm:text-base">
                Total Questions in Database: <strong>{questions.length}</strong>
              </span>
            </div>
          )}
        </motion.div>

        {/* Add/Edit Form */}
        {(isAdding || editingId !== null) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 sm:p-6 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2 className="font-nokia font-bold text-gold text-xl sm:text-2xl mb-4">
              {editingId ? 'Edit Question' : 'Add New Question'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-nokia text-off-white text-sm sm:text-base mb-2">
                  Question Text:
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={3}
                  className="w-full font-nokia text-base sm:text-lg px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-off-white placeholder-off-white/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                  placeholder="Enter question text..."
                />
              </div>

              <div>
                <label className="block font-nokia text-off-white text-sm sm:text-base mb-2">
                  Options:
                </label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options]
                        newOptions[index] = e.target.value
                        setFormData({ ...formData, options: newOptions })
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 font-nokia text-base sm:text-lg px-4 py-3 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-off-white placeholder-off-white/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50 min-h-[44px]"
                      style={{
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    />
                    <div className="flex gap-2 sm:flex-col">
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 font-nokia min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, correctAnswer: index })}
                        className={`px-4 py-3 rounded-xl font-nokia min-h-[44px] text-sm sm:text-base ${
                          formData.correctAnswer === index
                            ? 'bg-gold/30 text-gold border-2 border-gold'
                            : 'bg-white/10 text-off-white border border-white/20'
                        }`}
                      >
                        {formData.correctAnswer === index ? '✓ Correct' : 'Set ✓'}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 text-off-white hover:bg-white/20 font-nokia border border-white/20 min-h-[44px]"
                >
                  + Add Option
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex-1 font-nokia font-bold text-gold text-base sm:text-lg px-6 py-3 sm:py-3 rounded-xl cursor-pointer min-h-[44px]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="flex-1 font-nokia font-bold text-off-white text-base sm:text-lg px-6 py-3 sm:py-3 rounded-xl cursor-pointer min-h-[44px]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Button and Import */}
        {!isAdding && editingId === null && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="flex-1 sm:flex-none font-nokia font-bold text-gold text-base sm:text-lg px-6 py-3 rounded-xl cursor-pointer min-h-[44px]"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              + Add New Question
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleImport}
              disabled={isImporting}
              className="flex-1 sm:flex-none font-nokia font-bold text-blue-300 text-base sm:text-lg px-6 py-3 rounded-xl cursor-pointer min-h-[44px] disabled:opacity-50"
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              {isImporting ? '⏳ Importing...' : '📥 Import from quizData.ts'}
            </motion.button>
            {importStatus && (
              <div className="text-center sm:text-left font-nokia text-off-white/70 text-xs sm:text-sm px-4 py-2 rounded-xl bg-white/5">
                {importStatus.percentage}% imported ({importStatus.totalInDatabase}/{importStatus.totalInFile})
              </div>
            )}
          </div>
        )}

        {/* Questions List */}
        {isLoading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-6xl"
            >
              ⏳
            </motion.div>
            <p className="font-nokia text-off-white text-xl sm:text-2xl mt-4">Loading...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-nokia text-off-white text-xl sm:text-2xl">No questions found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-2" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
            <AnimatePresence>
              {questions.map((question, index) => (
                <motion.div
                  key={question.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 sm:p-6 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="font-nokia font-bold text-gold text-base sm:text-lg mb-2">
                        Q{index + 1}: {question.text}
                      </div>
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`font-nokia text-sm sm:text-base ${
                              optIndex === question.correctAnswer
                                ? 'text-gold font-bold'
                                : 'text-off-white/80'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.correctAnswer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 mt-3 sm:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => question.id && handleEdit(question)}
                        className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-nokia min-h-[44px] text-sm sm:text-base"
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => question.id && handleDelete(question.id)}
                        disabled={deletingId === question.id}
                        className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50 font-nokia min-h-[44px] text-sm sm:text-base"
                      >
                        {deletingId === question.id ? '⏳' : '🗑️ Delete'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}


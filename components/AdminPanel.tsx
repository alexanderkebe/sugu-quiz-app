'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLeaderboard, deleteEntry } from '@/utils/leaderboardUtils'
import { LeaderboardEntry } from '@/types/leaderboard'

export default function AdminPanel() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score')

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setIsLoading(true)
    const allEntries = await getLeaderboard()
    setEntries(allEntries)
    setIsLoading(false)
  }

  const handleDelete = async (entryId: number, entryName: string) => {
    if (!entryId || !confirm(`Are you sure you want to delete ${entryName}'s entry?`)) {
      return
    }

    setDeletingId(entryId)
    const success = await deleteEntry(entryId)
    if (success) {
      // Reload entries after deletion
      await loadEntries()
    } else {
      alert('Failed to delete entry. Check console for details.')
    }
    setDeletingId(null)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Filter and sort entries
  const filteredAndSorted = entries
    .filter((entry) => {
      const search = searchTerm.toLowerCase()
      return (
        entry.name.toLowerCase().includes(search) ||
        entry.phoneNumber?.toLowerCase().includes(search) ||
        entry.score.toString().includes(search)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          if (b.score !== a.score) return b.score - a.score
          return b.percentage - a.percentage
        case 'date':
          return b.timestamp - a.timestamp
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy via-[#7a0f1f] to-burgundy p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="font-nokia font-bold text-gold text-3xl sm:text-4xl md:text-5xl mb-4 text-center">
            🛡️ Admin Panel
          </h1>
          <p className="font-nokia text-off-white text-center text-base sm:text-lg">
            Manage leaderboard entries
          </p>
        </motion.div>

        {/* Search and Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '1.5rem',
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, or score..."
              className="flex-1 font-nokia text-base sm:text-lg px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-off-white placeholder-off-white/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50"
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'name')}
              className="font-nokia text-base sm:text-lg px-4 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 text-off-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50"
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadEntries}
              className="font-nokia font-bold text-gold text-base sm:text-lg px-6 py-2 sm:py-3 rounded-xl cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              🔄 Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div
            className="text-center p-4 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="font-nokia font-bold text-gold text-2xl sm:text-3xl">
              {entries.length}
            </div>
            <div className="font-nokia text-off-white text-sm sm:text-base">Total Entries</div>
          </div>
          <div
            className="text-center p-4 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="font-nokia font-bold text-gold text-2xl sm:text-3xl">
              {entries.filter((e) => e.phoneNumber).length}
            </div>
            <div className="font-nokia text-off-white text-sm sm:text-base">With Phone</div>
          </div>
          <div
            className="text-center p-4 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="font-nokia font-bold text-gold text-2xl sm:text-3xl">
              {filteredAndSorted.length}
            </div>
            <div className="font-nokia text-off-white text-sm sm:text-base">Filtered Results</div>
          </div>
        </motion.div>

        {/* Entries List */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-6xl"
            >
              ⏳
            </motion.div>
            <p className="font-nokia text-off-white text-xl sm:text-2xl mt-4">Loading...</p>
          </motion.div>
        ) : filteredAndSorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="font-nokia text-off-white text-xl sm:text-2xl">
              {searchTerm ? 'No entries found matching your search' : 'No entries yet'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence>
              {filteredAndSorted.map((entry, index) => (
                <motion.div
                  key={entry.id || `${entry.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="p-4 sm:p-6 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-nokia font-bold text-gold text-lg sm:text-xl md:text-2xl">
                          #{index + 1}
                        </div>
                        <div className="font-nokia font-bold text-off-white text-base sm:text-lg md:text-xl">
                          {entry.name || 'Anonymous'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-sm sm:text-base">
                        <div>
                          <span className="font-nokia text-off-white/70">Score: </span>
                          <span className="font-nokia font-bold text-gold">
                            {entry.score}/{entry.totalQuestions}
                          </span>
                        </div>
                        <div>
                          <span className="font-nokia text-off-white/70">Percentage: </span>
                          <span className="font-nokia font-bold text-gold">{entry.percentage}%</span>
                        </div>
                        <div>
                          <span className="font-nokia text-off-white/70">Phone: </span>
                          <span className="font-nokia text-off-white">
                            {entry.phoneNumber || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-nokia text-off-white/70">Date: </span>
                          <span className="font-nokia text-off-white">{formatDate(entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => entry.id && handleDelete(entry.id, entry.name)}
                      disabled={deletingId === entry.id || !entry.id}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed p-3 sm:p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex-shrink-0"
                      title="Delete entry"
                    >
                      {deletingId === entry.id ? '⏳' : '🗑️'}
                    </motion.button>
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


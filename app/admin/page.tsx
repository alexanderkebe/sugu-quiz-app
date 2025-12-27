'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getLeaderboard } from '@/utils/leaderboardUtils'
import { getQuestionsWithIds } from '@/utils/questionUtils'
import { getAllQuizAttempts } from '@/utils/quizAttemptUtils'
import { LeaderboardEntry } from '@/types/leaderboard'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalQuestions: 0,
    totalAttempts: 0,
    topScore: 0,
    averageScore: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const [entries, questions, attempts] = await Promise.all([
        getLeaderboard(),
        getQuestionsWithIds(),
        getAllQuizAttempts(),
      ])

      const topScore = entries.length > 0 ? Math.max(...entries.map((e) => e.percentage)) : 0
      const averageScore =
        entries.length > 0
          ? Math.round(entries.reduce((sum, e) => sum + e.percentage, 0) / entries.length)
          : 0

      setStats({
        totalEntries: entries.length,
        totalQuestions: questions.length,
        totalAttempts: attempts.length,
        topScore,
        averageScore,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const dashboardCards = [
    {
      title: '📊 Leaderboard',
      description: 'View and manage all leaderboard entries',
      href: '/admin/panel',
      icon: '🏆',
      stat: stats.totalEntries,
      statLabel: 'Total Entries',
      color: 'from-gold/30 to-gold/10',
    },
    {
      title: '📝 Questions',
      description: 'Add, edit, and delete quiz questions',
      href: '/admin/questions',
      icon: '❓',
      stat: stats.totalQuestions,
      statLabel: 'Active Questions',
      color: 'from-blue-500/30 to-blue-500/10',
    },
    {
      title: '📈 Quiz Attempts',
      description: 'View detailed quiz attempts and responses',
      href: '/admin/attempts',
      icon: '📋',
      stat: stats.totalAttempts,
      statLabel: 'Total Attempts',
      color: 'from-green-500/30 to-green-500/10',
    },
    {
      title: '📺 TV Leaderboard',
      description: 'Full-screen leaderboard for TV display',
      href: '/admin/tv',
      icon: '📺',
      stat: stats.topScore,
      statLabel: 'Top Score %',
      color: 'from-purple-500/30 to-purple-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy via-[#7a0f1f] to-burgundy p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <h1 className="font-nokia font-bold text-gold text-4xl sm:text-5xl md:text-6xl mb-4 text-center">
            🛡️ Admin Dashboard
          </h1>
          <p className="font-nokia text-off-white text-center text-base sm:text-lg md:text-xl">
            Manage your quiz application
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <div
            className="p-4 sm:p-6 rounded-xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="font-nokia font-bold text-gold text-3xl sm:text-4xl mb-2">
              {isLoading ? '...' : stats.totalEntries}
            </div>
            <div className="font-nokia text-off-white text-sm sm:text-base">Leaderboard Entries</div>
          </div>
          <div
            className="p-4 sm:p-6 rounded-xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="font-nokia font-bold text-gold text-3xl sm:text-4xl mb-2">
              {isLoading ? '...' : stats.totalQuestions}
            </div>
            <div className="font-nokia text-off-white text-sm sm:text-base">Active Questions</div>
          </div>
          <div
            className="p-4 sm:p-6 rounded-xl text-center sm:col-span-2 lg:col-span-1"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="font-nokia font-bold text-gold text-3xl sm:text-4xl mb-2">
              {isLoading ? '...' : `${stats.averageScore}%`}
            </div>
            <div className="font-nokia text-off-white text-sm sm:text-base">Average Score</div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link href={card.href}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`h-full p-6 sm:p-8 rounded-xl cursor-pointer bg-gradient-to-br ${card.color} border border-white/20`}
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-4xl sm:text-5xl mb-3">{card.icon}</div>
                      <h2 className="font-nokia font-bold text-gold text-xl sm:text-2xl md:text-3xl mb-2">
                        {card.title}
                      </h2>
                      <p className="font-nokia text-off-white/80 text-sm sm:text-base mb-4">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <div className="font-nokia font-bold text-gold text-2xl sm:text-3xl">
                        {isLoading ? '...' : card.stat}
                      </div>
                      <div className="font-nokia text-off-white/70 text-xs sm:text-sm">{card.statLabel}</div>
                    </div>
                    <div className="font-nokia text-gold text-lg sm:text-xl">→</div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-4 sm:p-6 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3 className="font-nokia font-bold text-gold text-xl sm:text-2xl mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadStats}
              className="font-nokia font-bold text-gold text-base sm:text-lg px-6 py-3 rounded-xl cursor-pointer min-h-[44px]"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              🔄 Refresh Stats
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


'use client'

import { motion } from 'framer-motion'

interface RulesScreenProps {
  onStart: () => void // Now navigates to name input screen
}

const rules = [
  { icon: '🕊️', text: 'ጨዋታው 7 ጥያቄዎችን ይዟል' },
  { icon: '📝', text: 'እያንዳንዱ ጥያቄ ብዙ ምርጫዎች አሉት' },
  { icon: '⏱️', text: 'ለእያንዳንዱ ጥያቄ አንድ መልስ ብቻ ይመርጣሉ' },
  { icon: '⏱️', text: 'ለእያንዳንዱ ጥያቄ አንድ ደቂቃ አሎት' },
  { icon: '🔒', text: 'ከመረጡ በኋላ መመለስ አይቻልም' },
  { icon: '🎯', text: 'ውጤቱ በመጨረሻ ብቻ ይታያል' },
]

export default function RulesScreen({ onStart }: RulesScreenProps) {
  return (
    <div className="fixed inset-0 bg-burgundy flex items-center justify-center z-[300] p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 my-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-nokia font-bold text-gold text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 md:mb-8 text-center"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          }}
        >
          📜 የጨዋታ ህጎች (Game Rules)
        </motion.h2>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {rules.map((rule, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-2 sm:gap-3"
            >
              <span className="text-xl sm:text-2xl md:text-3xl mt-0.5 sm:mt-1 flex-shrink-0">{rule.icon}</span>
              <p className="font-nokia text-off-white text-sm sm:text-base md:text-lg flex-1 leading-relaxed">
                {rule.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ y: -1, scale: 0.98 }}
          onClick={onStart}
          className="w-full font-nokia font-bold text-gold text-base sm:text-lg md:text-xl py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 min-h-[44px] sm:min-h-[52px]"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          }}
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  )
}

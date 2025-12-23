'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showLoader, setShowLoader] = useState(true)
  const [showEJaT, setShowEJaT] = useState(false)
  const [showSubae, setShowSubae] = useState(false)
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => {
      setAssetsLoaded(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!assetsLoaded) return

    // Hide loader, show EJaT
    setShowLoader(false)
    setTimeout(() => {
      setShowEJaT(true)
    }, 300)

    // Show Subae after EJaT
    setTimeout(() => {
      setShowEJaT(false)
      setTimeout(() => {
        setShowSubae(true)
      }, 400)
    }, 3000)
  }, [assetsLoaded])

  return (
    <>
      {/* Loader */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gold flex items-center justify-center z-[1000]"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EJaT Splash */}
      <AnimatePresence>
        {showEJaT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-gold flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-[80%] max-w-[280px]"
            >
              <Image
                src="/ejat-logo.png"
                alt="EJaT Logo"
                width={280}
                height={280}
                className="w-full h-auto"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subae Gubae Splash */}
      <AnimatePresence>
        {showSubae && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-burgundy flex items-center justify-center z-[200]"
          >
            <SubaeSplash onContinue={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Loader() {
  return (
    <div className="relative w-[120px] h-[120px] flex items-center justify-center">
      {/* Central pulsing circle */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-10 h-10 bg-burgundy rounded-full shadow-lg"
        style={{ boxShadow: '0 0 20px rgba(100, 12, 28, 0.4)' }}
      />
      
      {/* Rotating rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[60px] h-[60px] border-[3px] border-transparent border-t-burgundy border-r-burgundy rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute w-20 h-20 border-[3px] border-transparent border-b-burgundy border-l-burgundy rounded-full"
      />

      {/* Orbiting elements */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
          className="absolute w-4 h-4 bg-burgundy rounded-full shadow-lg"
          style={{
            top: i === 0 ? '0%' : i === 1 || i === 5 ? '20%' : i === 2 || i === 4 ? '80%' : '100%',
            left: i === 0 || i === 4 ? '50%' : i === 1 || i === 2 ? '90%' : '10%',
            transform: i === 0 || i === 4 ? 'translateX(-50%)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function SubaeSplash({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 w-full max-w-[90vw]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-[75%] max-w-[280px] sm:max-w-[320px] mb-6 sm:mb-8"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        >
          <Image
            src="/subae-logo.png"
            alt="Subae Gubae Logo"
            width={320}
            height={320}
            className="w-full h-auto drop-shadow-lg"
            priority
          />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-nokia font-bold text-gold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2"
        style={{
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          letterSpacing: '0.02em',
        }}
      >
        <motion.span
          animate={{
            textShadow: [
              '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 10px rgba(238, 193, 48, 0.3)',
              '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(238, 193, 48, 0.5), 0 0 30px rgba(238, 193, 48, 0.3)',
              '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 10px rgba(238, 193, 48, 0.3)',
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
        >
          እንዳልማር የሚከለክለኝ ምንድርነው?
        </motion.span>
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ y: -1, scale: 0.98 }}
        onClick={onContinue}
        className="font-nokia font-bold text-gold text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 min-h-[44px] sm:min-h-[52px]"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          letterSpacing: '0.03em',
        }}
      >
        Continue to Quiz
      </motion.button>
    </div>
  )
}


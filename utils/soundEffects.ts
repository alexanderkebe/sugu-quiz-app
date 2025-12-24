/**
 * Sound effects utility using Web Audio API
 * Generates sounds programmatically without requiring audio files
 */

class SoundManager {
  private audioContext: AudioContext | null = null
  private soundsEnabled: boolean = true

  constructor() {
    // Initialize audio context on first user interaction (browser requirement)
    if (typeof window !== 'undefined') {
      // Check if sounds are enabled (user preference)
      const soundsPreference = localStorage.getItem('sugu_quiz_sounds')
      this.soundsEnabled = soundsPreference !== 'false'
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null

    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (e) {
        console.warn('Web Audio API not supported')
        return null
      }
    }

    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    return this.audioContext
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ) {
    if (!this.soundsEnabled) return

    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (e) {
      // Silently fail if audio can't be played
    }
  }

  // Play a click sound when answer is selected
  playClick() {
    this.playTone(800, 0.1, 'sine', 0.2)
  }

  // Play success sound for correct answer
  playCorrect() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a pleasant ascending chord
      const frequencies = [523.25, 659.25, 783.99] // C, E, G major chord
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.3, 'sine', 0.25)
        }, index * 50)
      })
    } catch (e) {
      // Fallback to simple tone
      this.playTone(800, 0.2, 'sine', 0.3)
    }
  }

  // Play error sound for wrong answer
  playWrong() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a descending buzzer-like sound
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(400, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.3)
    } catch (e) {
      // Fallback
      this.playTone(200, 0.3, 'sawtooth', 0.2)
    }
  }

  // Play tick sound for timer countdown (subtle)
  playTick() {
    this.playTone(600, 0.05, 'sine', 0.15)
  }

  // Play clock tick sound (more pronounced)
  playClockTick() {
    this.playTone(800, 0.08, 'sine', 0.2)
  }

  // Play sound when new question appears
  playNewQuestion() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play an ascending, pleasant sound
      const frequencies = [440, 554.37, 659.25] // A, C#, E
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.15, 'sine', 0.2)
        }, index * 80)
      })
    } catch (e) {
      // Fallback
      this.playTone(600, 0.2, 'sine', 0.25)
    }
  }

  // Play success sound for good results (85%+)
  playExcellentResult() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a triumphant fanfare
      const notes = [523.25, 659.25, 783.99, 987.77] // C, E, G, B
      notes.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.4, 'sine', 0.3)
        }, index * 100)
      })
    } catch (e) {
      this.playTone(800, 0.5, 'sine', 0.3)
    }
  }

  // Play good result sound (70-84%)
  playGoodResult() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a pleasant chord
      const frequencies = [523.25, 659.25, 783.99] // C, E, G
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.3, 'sine', 0.25)
        }, index * 80)
      })
    } catch (e) {
      this.playTone(700, 0.4, 'sine', 0.25)
    }
  }

  // Play okay result sound (50-69%)
  playOkayResult() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a neutral sound
      this.playTone(500, 0.3, 'sine', 0.2)
    } catch (e) {
      this.playTone(500, 0.3, 'sine', 0.2)
    }
  }

  // Play poor result sound (<50%)
  playPoorResult() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a descending, somber sound
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(400, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch (e) {
      this.playTone(300, 0.5, 'sine', 0.2)
    }
  }

  // Play warning sound when time is running low
  playWarning() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a quick beep
      this.playTone(600, 0.1, 'sine', 0.25)
    } catch (e) {
      // Fallback
      this.playTone(600, 0.1, 'sine', 0.25)
    }
  }

  // Play timeout sound
  playTimeout() {
    const ctx = this.getAudioContext()
    if (!ctx || !this.soundsEnabled) return

    try {
      // Play a longer, more urgent sound
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(300, ctx.currentTime)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch (e) {
      // Fallback
      this.playTone(300, 0.5, 'square', 0.3)
    }
  }

  // Toggle sounds on/off
  setEnabled(enabled: boolean) {
    this.soundsEnabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('sugu_quiz_sounds', enabled ? 'true' : 'false')
    }
  }

  isEnabled(): boolean {
    return this.soundsEnabled
  }
}

// Export singleton instance
export const soundManager = new SoundManager()


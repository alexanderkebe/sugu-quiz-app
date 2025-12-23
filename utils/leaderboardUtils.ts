import { LeaderboardEntry } from '@/types/leaderboard'
import { supabase } from '@/lib/supabase'

const MAX_ENTRIES = 50 // Store top 50 scores

/**
 * Get all leaderboard entries from Supabase
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    // Check if Supabase is properly configured
    // Supports both old JWT format (eyJ...) and new format (sb_publishable_...)
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Leaderboard disabled.')
      console.warn('💡 Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file')
      return []
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .order('percentage', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(MAX_ENTRIES)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return (data || []).map((entry) => ({
      name: entry.name,
      score: entry.score,
      totalQuestions: entry.total_questions,
      percentage: entry.percentage,
      timestamp: new Date(entry.created_at).getTime(),
    }))
  } catch (error) {
    console.error('Error reading leaderboard:', error)
    return []
  }
}

/**
 * Add a new score to the leaderboard
 */
export async function addToLeaderboard(
  entry: Omit<LeaderboardEntry, 'timestamp'>
): Promise<boolean> {
  try {
    // Check if Supabase is properly configured
    // In Next.js, NEXT_PUBLIC_ vars are available in browser
    // Supports both old JWT format (eyJ...) and new format (sb_publishable_...)
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Cannot save score.')
      console.warn('💡 Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file')
      console.warn('💡 Get your key from: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api')
      return false
    }

    const { data, error } = await supabase.from('leaderboard').insert({
      name: entry.name,
      score: entry.score,
      total_questions: entry.totalQuestions,
      percentage: entry.percentage,
    }).select()

    if (error) {
      console.error('❌ Supabase Error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      
      // Provide helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('💡 The leaderboard table does not exist. Please run the SQL script from supabase-setup.sql in your Supabase dashboard.')
      } else if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy')) {
        console.error('💡 Row Level Security policy issue. Please check that the policies were created correctly.')
      } else if (error.message?.includes('JWT') || error.message?.includes('invalid')) {
        console.error('💡 Invalid API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      }
      
      return false
    }

    if (!data) {
      console.error('No data returned from insert')
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving to leaderboard:', error)
    return false
  }
}

/**
 * Get top N scores
 */
export async function getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    // Check if Supabase is properly configured
    // Supports both old JWT format (eyJ...) and new format (sb_publishable_...)
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Leaderboard disabled.')
      return []
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .order('percentage', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching top scores:', error)
      return []
    }

    return (data || []).map((entry) => ({
      name: entry.name,
      score: entry.score,
      totalQuestions: entry.total_questions,
      percentage: entry.percentage,
      timestamp: new Date(entry.created_at).getTime(),
    }))
  } catch (error) {
    console.error('Error fetching top scores:', error)
    return []
  }
}

/**
 * Clear all leaderboard data (admin function - optional)
 */
export async function clearLeaderboard(): Promise<boolean> {
  try {
    const { error } = await supabase.from('leaderboard').delete().neq('id', 0) // Delete all

    if (error) {
      console.error('Error clearing leaderboard:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error clearing leaderboard:', error)
    return false
  }
}

import { LeaderboardEntry } from '@/types/leaderboard'
import { supabase } from '@/lib/supabase'

const MAX_ENTRIES = 50 // Store top 50 scores
const SESSION_ID_KEY = 'sugu_quiz_session_id'

/**
 * Get or create a unique session ID for the current user
 * This is stored in localStorage to track which entries belong to this user
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: generate a temporary ID
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY)
  
  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(SESSION_ID_KEY, sessionId)
  }
  
  return sessionId
}

/**
 * Get the current user's session ID
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_ID_KEY)
}

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
      id: entry.id,
      name: entry.name,
      phoneNumber: entry.phone_number || undefined,
      score: entry.score,
      totalQuestions: entry.total_questions,
      percentage: entry.percentage,
      timestamp: new Date(entry.created_at).getTime(),
      sessionId: entry.session_id || undefined,
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

    // Get or create session ID for this user
    const sessionId = getOrCreateSessionId()

    const { data, error } = await supabase.from('leaderboard').insert({
      name: entry.name,
      phone_number: entry.phoneNumber || null,
      score: entry.score,
      total_questions: entry.totalQuestions,
      percentage: entry.percentage,
      session_id: sessionId,
    }).select()

    if (error) {
      console.error('❌ Supabase Error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      
      // Log the full error object for debugging
      console.error('Full error object:', JSON.stringify(error, null, 2))
      
      // Provide helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('💡 The leaderboard table does not exist. Please run the SQL script from supabase-setup.sql in your Supabase dashboard.')
      } else if (error.message?.includes('session_id') || error.message?.includes('column') || error.code === '42703' || error.details?.includes('session_id')) {
        console.error('💡 The session_id column is missing. Please run the migration script: supabase-migration-session-id.sql')
        console.error('💡 Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new')
        console.error('💡 Copy and paste the contents of supabase-migration-session-id.sql')
      } else if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy')) {
        console.error('💡 Row Level Security policy issue. Please check that the policies were created correctly.')
      } else if (error.message?.includes('JWT') || error.message?.includes('invalid')) {
        console.error('💡 Invalid API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
      } else if (error.code === 'PGRST301' || error.message?.includes('JSON object requested, multiple (or no) rows returned')) {
        console.error('💡 Database query issue. The table structure might be incorrect.')
      } else {
        console.error('💡 Unknown error. Check the error details above.')
        console.error('💡 Common fixes:')
        console.error('   1. Run supabase-migration-session-id.sql if session_id column is missing')
        console.error('   2. Run supabase-setup.sql if the table doesn\'t exist')
        console.error('   3. Check your Supabase table structure matches the expected schema')
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
      id: entry.id,
      name: entry.name,
      phoneNumber: entry.phone_number || undefined,
      score: entry.score,
      totalQuestions: entry.total_questions,
      percentage: entry.percentage,
      timestamp: new Date(entry.created_at).getTime(),
      sessionId: entry.session_id || undefined,
    }))
  } catch (error) {
    console.error('Error fetching top scores:', error)
    return []
  }
}

/**
 * Delete a specific leaderboard entry (only if it belongs to the current user)
 */
export async function deleteOwnEntry(entryId: number): Promise<boolean> {
  try {
    const sessionId = getSessionId()
    if (!sessionId) {
      console.warn('No session ID found. Cannot delete entry.')
      return false
    }

    // Check if Supabase is properly configured
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Cannot delete entry.')
      return false
    }

    // First, verify the entry belongs to this user
    const { data: entry, error: fetchError } = await supabase
      .from('leaderboard')
      .select('session_id')
      .eq('id', entryId)
      .single()

    if (fetchError || !entry) {
      console.error('Error fetching entry:', fetchError)
      return false
    }

    // Verify session_id matches
    if (entry.session_id !== sessionId) {
      console.warn('Cannot delete: Entry does not belong to current user')
      return false
    }

    // Delete the entry
    const { error } = await supabase
      .from('leaderboard')
      .delete()
      .eq('id', entryId)
      .eq('session_id', sessionId) // Double-check with session_id

    if (error) {
      console.error('Error deleting entry:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting entry:', error)
    return false
  }
}

/**
 * Delete any leaderboard entry (admin function - no session_id check)
 */
export async function deleteEntry(entryId: number): Promise<boolean> {
  try {
    // Check if Supabase is properly configured
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const isValidKey = anonKey && (anonKey.length > 20 || anonKey.startsWith('sb_publishable_'))
    if (!isValidKey) {
      console.warn('❌ Supabase not configured. Cannot delete entry.')
      return false
    }

    // Delete the entry (admin can delete any entry)
    const { error } = await supabase
      .from('leaderboard')
      .delete()
      .eq('id', entryId)

    if (error) {
      console.error('Error deleting entry:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting entry:', error)
    return false
  }
}

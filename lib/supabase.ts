import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pukgraslmfvcacmtlftx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if we have valid credentials (supports both old JWT format and new sb_publishable format)
const hasValidCredentials = supabaseUrl && supabaseAnonKey && (supabaseAnonKey.length > 20 || supabaseAnonKey.startsWith('sb_publishable_'))

if (typeof window !== 'undefined' && !hasValidCredentials) {
  console.warn('⚠️ Supabase anon key not found or invalid. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file. Leaderboard will not work.')
}

// Create client only if we have valid credentials
// Use a minimal valid key format if missing to prevent errors
let supabase: SupabaseClient

if (hasValidCredentials) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
} else {
  // Create a client with a dummy key - it will fail on actual operations but won't crash
  // The leaderboard functions will check for valid key before using it
  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

export { supabase }


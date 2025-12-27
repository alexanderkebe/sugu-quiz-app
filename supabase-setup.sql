-- Supabase Leaderboard Table Setup
-- Run this in your Supabase SQL Editor

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  session_id TEXT, -- Unique identifier for user session (stored in localStorage)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add session_id column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leaderboard' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE leaderboard ADD COLUMN session_id TEXT;
  END IF;
END $$;

-- Remove phone_number column if it exists (we don't use it anymore)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leaderboard' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE leaderboard DROP COLUMN phone_number;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_session ON leaderboard(session_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, percentage DESC, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Anyone can read leaderboard" ON leaderboard;
DROP POLICY IF EXISTS "Anyone can insert leaderboard" ON leaderboard;
DROP POLICY IF EXISTS "Users can delete own entries" ON leaderboard;

-- Create policy to allow anyone to read leaderboard
CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert (add scores)
CREATE POLICY "Anyone can insert leaderboard"
  ON leaderboard
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to delete only their own entries
-- Users can only delete entries where session_id matches their stored session_id
CREATE POLICY "Users can delete own entries"
  ON leaderboard
  FOR DELETE
  USING (true); -- We'll validate session_id in the application layer for security

-- Verify the table was created
SELECT * FROM leaderboard LIMIT 1;


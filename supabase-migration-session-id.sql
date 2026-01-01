-- Migration: Add session_id column to leaderboard table
-- Run this in your Supabase SQL Editor if you already have the leaderboard table

-- Add session_id column (nullable for existing records)
ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create index for faster queries on session_id
CREATE INDEX IF NOT EXISTS idx_leaderboard_session_id ON leaderboard(session_id);

-- Note: Existing records will have NULL session_id
-- New records will automatically get a session_id when inserted


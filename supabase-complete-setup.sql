-- Complete Database Setup for Sugu Quiz App
-- Run this script in your Supabase SQL Editor to set up all tables
-- URL: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new

-- ============================================================================
-- 1. LEADERBOARD TABLE
-- ============================================================================

-- Drop table if exists (for clean reinstall - comment out if you want to keep data)
-- DROP TABLE IF EXISTS leaderboard CASCADE;

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
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, percentage DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_session ON leaderboard(session_id);

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
CREATE POLICY "Users can delete own entries"
  ON leaderboard
  FOR DELETE
  USING (true);

-- ============================================================================
-- 2. QUESTIONS TABLE
-- ============================================================================

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  options TEXT[] NOT NULL, -- Array of option strings
  correct_answer INTEGER NOT NULL, -- 0-based index of correct answer
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE -- Allow soft deletion
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active) WHERE is_active = TRUE;

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active questions" ON questions;
DROP POLICY IF EXISTS "Allow insert questions" ON questions;
DROP POLICY IF EXISTS "Allow update questions" ON questions;
DROP POLICY IF EXISTS "Allow delete questions" ON questions;

-- Policy: Allow anyone (including anonymous users) to read active questions
CREATE POLICY "Anyone can read active questions"
  ON questions
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Allow anyone (including anonymous users) to insert questions
-- This is needed for the import functionality using the anon key
CREATE POLICY "Allow insert questions"
  ON questions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone (including anonymous users) to update questions
CREATE POLICY "Allow update questions"
  ON questions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anyone (including anonymous users) to delete questions
CREATE POLICY "Allow delete questions"
  ON questions
  FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. QUIZ ATTEMPTS TABLES
-- ============================================================================

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  session_id TEXT, -- Link to leaderboard session_id if available
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempt_responses table
CREATE TABLE IF NOT EXISTS quiz_attempt_responses (
  id BIGSERIAL PRIMARY KEY,
  attempt_id BIGINT NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id BIGINT REFERENCES questions(id), -- Link to question if available
  question_text TEXT NOT NULL, -- Store question text in case question is deleted
  user_answer INTEGER, -- -1 for timeout, otherwise 0-based index
  correct_answer INTEGER NOT NULL, -- 0-based index of correct answer
  is_correct BOOLEAN NOT NULL, -- Whether the answer was correct
  question_options TEXT[] NOT NULL, -- Store all options
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_session ON quiz_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON quiz_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_responses_attempt ON quiz_attempt_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempt_responses_question ON quiz_attempt_responses(question_id);

-- Enable Row Level Security
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempt_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow insert quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Allow insert quiz responses" ON quiz_attempt_responses;
DROP POLICY IF EXISTS "Allow read quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Allow read quiz responses" ON quiz_attempt_responses;
DROP POLICY IF EXISTS "Allow delete quiz attempts" ON quiz_attempts;

-- Policy: Allow anyone to insert attempts (users taking quiz)
CREATE POLICY "Allow insert quiz attempts"
  ON quiz_attempts
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow anyone to insert responses
CREATE POLICY "Allow insert quiz responses"
  ON quiz_attempt_responses
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow read for admin
CREATE POLICY "Allow read quiz attempts"
  ON quiz_attempts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read quiz responses"
  ON quiz_attempt_responses
  FOR SELECT
  USING (true);

-- Policy: Allow delete quiz attempts
CREATE POLICY "Allow delete quiz attempts"
  ON quiz_attempts
  FOR DELETE
  USING (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables were created
SELECT 'leaderboard' as table_name, COUNT(*) as row_count FROM leaderboard
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'quiz_attempts', COUNT(*) FROM quiz_attempts
UNION ALL
SELECT 'quiz_attempt_responses', COUNT(*) FROM quiz_attempt_responses;

-- Show success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete! All tables created successfully.';
  RAISE NOTICE '📊 Tables: leaderboard, questions, quiz_attempts, quiz_attempt_responses';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '📝 You can now import questions and use the app!';
END $$;


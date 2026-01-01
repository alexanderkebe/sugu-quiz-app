-- Create questions table for quiz application
-- This table stores all quiz questions, options, and correct answers

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

-- Drop existing policies if they exist (for re-running this script)
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

-- Trigger to automatically update updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


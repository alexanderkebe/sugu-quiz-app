-- Create quiz_attempts table for tracking user quiz responses
-- This table stores each user's quiz attempt with their answers

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  session_id TEXT, -- Link to leaderboard session_id if available
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempt_responses table to store individual question responses
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

-- Policy: Allow read for admin (you may want to restrict this further)
CREATE POLICY "Allow read quiz attempts"
  ON quiz_attempts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow read quiz responses"
  ON quiz_attempt_responses
  FOR SELECT
  USING (true);


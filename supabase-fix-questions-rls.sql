-- Fix Row Level Security (RLS) policies for questions table
-- Run this in your Supabase SQL Editor to fix the "violates row level security" error
-- URL: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new

-- Drop all existing policies on questions table
DROP POLICY IF EXISTS "Anyone can read active questions" ON questions;
DROP POLICY IF EXISTS "Allow insert questions" ON questions;
DROP POLICY IF EXISTS "Allow update questions" ON questions;
DROP POLICY IF EXISTS "Allow delete questions" ON questions;
DROP POLICY IF EXISTS "Allow authenticated users to insert questions" ON questions;
DROP POLICY IF EXISTS "Allow authenticated users to update questions" ON questions;
DROP POLICY IF EXISTS "Allow authenticated users to delete questions" ON questions;

-- Policy: Allow anyone (including anonymous users) to read active questions
CREATE POLICY "Anyone can read active questions"
  ON questions
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Allow anyone (including anonymous users) to insert questions
-- This is needed for the import functionality
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

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'questions'
ORDER BY policyname;

-- Show success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies for questions table have been fixed!';
  RAISE NOTICE '📝 You should now be able to import questions without RLS errors.';
END $$;


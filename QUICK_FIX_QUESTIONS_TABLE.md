# Quick Fix: Create Questions Table

## Error: "couldn't find table public.questions"

This means the `questions` table doesn't exist in your Supabase database. Follow these steps:

## Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new
2. Or navigate: Dashboard → SQL Editor → New Query

## Step 2: Copy the SQL Script

1. Open the file `supabase-setup-questions.sql` in this project
2. Copy **ALL** the SQL code (from line 1 to the end)

## Step 3: Paste and Run

1. Paste the SQL code into the Supabase SQL Editor
2. Click the **"Run"** button (or press `Ctrl+Enter`)
3. Wait for it to complete
4. You should see: **"Success. No rows returned"** or similar success message

## Step 4: Verify Table Created

1. Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor
2. You should see a table named `questions` in the list
3. Click on it to verify it has these columns:
   - `id` (bigint)
   - `text` (text)
   - `options` (text[])
   - `correct_answer` (integer)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
   - `is_active` (boolean)

## Step 5: Try Import Again

1. Go back to your app: `/admin/questions`
2. Click the **"📥 Import from quizData.ts"** button
3. The import should now work!

## Quick Copy-Paste SQL

If you can't find the file, here's the SQL to run:

```sql
-- Create questions table for quiz application
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active) WHERE is_active = TRUE;

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read active questions
CREATE POLICY "Anyone can read active questions"
  ON questions
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Allow insert questions
CREATE POLICY "Allow insert questions"
  ON questions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow update questions
CREATE POLICY "Allow update questions"
  ON questions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow delete questions
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
```

## Still Having Issues?

1. Check the SQL Editor for any error messages
2. Make sure you're running the script in the correct Supabase project
3. Verify your Supabase anon key is correct in `.env.local`
4. Check browser console (F12) for any other errors


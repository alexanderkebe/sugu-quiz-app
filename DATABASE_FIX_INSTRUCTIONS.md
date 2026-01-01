# Database Fix Instructions

## Quick Fix: Run Complete Setup Script

If you're experiencing database errors, run this **one script** to fix everything:

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new
2. Or: Dashboard → SQL Editor → New Query

### Step 2: Run Complete Setup Script
1. Open the file `supabase-complete-setup.sql` in this project
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** (or press `Ctrl+Enter`)
5. Wait for completion - you should see success messages

### What This Script Does:
✅ Creates all required tables:
   - `leaderboard` - Stores quiz scores
   - `questions` - Stores quiz questions
   - `quiz_attempts` - Tracks user quiz attempts
   - `quiz_attempt_responses` - Stores individual question responses

✅ Fixes common issues:
   - Removes `phone_number` column (no longer used)
   - Adds `session_id` column if missing
   - Creates all indexes for performance
   - Sets up Row Level Security (RLS) policies
   - Creates triggers for automatic timestamp updates

✅ Safe to run multiple times:
   - Uses `IF NOT EXISTS` and `DROP IF EXISTS`
   - Won't delete existing data
   - Can be re-run safely

## Alternative: Run Individual Scripts

If you prefer to run scripts separately:

### 1. Leaderboard Table
- File: `supabase-setup.sql`
- Fixes: Removes phone_number, adds session_id

### 2. Questions Table
- File: `supabase-setup-questions.sql`
- Creates: Questions table with all policies

### 3. Quiz Attempts Tables
- File: `supabase-setup-quiz-attempts.sql`
- Creates: Quiz attempts and responses tables

## Common Database Errors Fixed

### Error: "couldn't find table public.questions"
**Fix:** Run `supabase-setup-questions.sql` or `supabase-complete-setup.sql`

### Error: "column session_id does not exist"
**Fix:** Run `supabase-migration-session-id.sql` or `supabase-complete-setup.sql`

### Error: "column phone_number does not exist" (or exists but shouldn't)
**Fix:** Run `supabase-complete-setup.sql` - it will remove phone_number safely

### Error: "permission denied" or RLS policy errors
**Fix:** Run `supabase-complete-setup.sql` - it recreates all policies correctly

## Verification

After running the script, verify tables exist:
1. Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor
2. You should see these tables:
   - `leaderboard`
   - `questions`
   - `quiz_attempts`
   - `quiz_attempt_responses`

## Need Help?

If errors persist:
1. Check the SQL Editor output for specific error messages
2. Verify your Supabase project URL and API key are correct
3. Make sure you're running the script in the correct Supabase project
4. Check browser console (F12) for detailed error messages


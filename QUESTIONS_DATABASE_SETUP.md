# Questions Database Setup Guide

This guide explains how to migrate quiz questions from the local file to Supabase database.

## Step 1: Create the Questions Table

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase-setup-questions.sql`
5. Click **Run** to execute the script
6. Verify the table was created by checking the **Table Editor** - you should see a `questions` table

## Step 2: Populate Questions

1. In the **SQL Editor**, create a new query
2. Copy and paste the contents of `supabase-migration-populate-questions.sql`
3. Click **Run** to insert all 39 questions
4. Verify by checking the `questions` table - you should see 39 rows

## Step 3: Create Quiz Attempts Table

1. In the **SQL Editor**, create a new query
2. Copy and paste the contents of `supabase-setup-quiz-attempts.sql`
3. Click **Run** to create the quiz attempts tracking tables
4. This will create:
   - `quiz_attempts` table - stores each quiz attempt
   - `quiz_attempt_responses` table - stores individual question responses

## Step 4: Verify Setup

1. The app will automatically fetch questions from the database
2. If the database is empty or fails, it will fall back to `quizData.ts`
3. Visit `/admin/questions` to manage questions
4. Visit `/admin/attempts` to view quiz attempts and user responses

## Admin Panels

### Questions Management
- **URL**: `/admin/questions`
- **Features**:
  - View all questions
  - Add new questions
  - Edit existing questions
  - Delete questions (soft delete)

### Quiz Attempts Tracking
- **URL**: `/admin/attempts`
- **Features**:
  - View all quiz attempts
  - Search by player name
  - See detailed responses for each attempt
  - View which questions were answered correctly/incorrectly
  - See user's selected answers vs correct answers
  - Delete attempts

## Database Schema

The `questions` table has the following structure:

- `id` (BIGSERIAL): Primary key
- `text` (TEXT): Question text
- `options` (TEXT[]): Array of answer options
- `correct_answer` (INTEGER): 0-based index of correct answer
- `is_active` (BOOLEAN): Soft delete flag
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

## Notes

- Questions are soft-deleted (is_active = false) rather than permanently removed
- The app fetches only active questions (is_active = true)
- Row Level Security (RLS) is enabled - anyone can read, but you may want to restrict writes based on your auth setup


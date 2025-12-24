-- Migration: Add phone_number column to leaderboard table
-- Run this in your Supabase SQL Editor if you already have the leaderboard table

-- Add phone_number column (nullable for existing records)
ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Note: Existing records will have NULL phone_number
-- New records will automatically get a phone_number when inserted


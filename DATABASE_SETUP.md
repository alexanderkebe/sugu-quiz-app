# Database Setup Guide - Step by Step

## Your Supabase Project
- **Project URL**: `https://pukgraslmfvcacmtlftx.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx

---

## Step 1: Create the Database Table (5 minutes)

1. **Open SQL Editor**
   - Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new

2. **Copy the SQL Script**
   - Open the file `supabase-setup.sql` in this project
   - Copy **ALL** the SQL code (from line 1 to the end)

3. **Paste and Run**
   - Paste the SQL code into the Supabase SQL Editor
   - Click the **"Run"** button (or press `Ctrl+Enter`)
   - Wait for it to complete
   - You should see: **"Success. No rows returned"**

4. **Verify Table Created**
   - Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor
   - You should see a table named `leaderboard` in the list

---

## Step 2: Get Your API Keys (2 minutes)

1. **Open API Settings**
   - Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api

2. **Copy Your Credentials**
   - **Project URL**: `https://pukgraslmfvcacmtlftx.supabase.co` (already provided)
   - **anon public key**: 
     - Find the section "Project API keys"
     - Look for **"anon"** or **"public"** key
     - Click the **eye icon** to reveal it (if hidden)
     - Click **"Copy"** button next to it
     - It's a long string starting with `eyJ...`

---

## Step 3: Create Environment File (1 minute)

1. **Create `.env.local` file**
   - In your project root folder (`C:\Users\alexa\Desktop\Sugu-Quiz-app`)
   - Create a new file named exactly: `.env.local`
   - **Important**: The file must start with a dot (.)

2. **Add Your Credentials**
   - Open `.env.local` in a text editor
   - Paste these lines (replace `YOUR_ANON_KEY_HERE` with the key from Step 2):

```
NEXT_PUBLIC_SUPABASE_URL=https://pukgraslmfvcacmtlftx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

3. **Save the file**
   - Make sure the file is saved as `.env.local` (not `.env.local.txt`)

---

## Step 4: Restart Development Server (1 minute)

1. **Stop the current server** (if running)
   - Press `Ctrl+C` in the terminal

2. **Start the server again**
   ```bash
   npm run dev
   ```

3. **Check for errors**
   - Look at the terminal output
   - If you see warnings about Supabase credentials, check your `.env.local` file

---

## Step 5: Test the Leaderboard

1. **Complete a quiz**
   - Go to http://localhost:3000
   - Complete the quiz

2. **Submit your score**
   - Enter your name
   - Click "Submit"

3. **View leaderboard**
   - Click "🏆 Leaderboard" button
   - Your score should appear!

---

## Troubleshooting

### ❌ "Supabase credentials not found" warning
- **Fix**: Check that `.env.local` file exists and has correct values
- **Fix**: Make sure you restarted the dev server after creating `.env.local`
- **Fix**: Verify the file is named exactly `.env.local` (not `.env.local.txt`)

### ❌ "Error fetching leaderboard" in browser console
- **Fix**: Make sure you ran the SQL script in Step 1
- **Fix**: Check that the `leaderboard` table exists in Supabase dashboard
- **Fix**: Verify your anon key is correct

### ❌ "Error saving to leaderboard"
- **Fix**: Check your internet connection
- **Fix**: Verify Row Level Security policies are set (from SQL script)
- **Fix**: Check browser console for specific error messages

### ❌ Table doesn't exist
- **Fix**: Go back to Step 1 and run the SQL script again
- **Fix**: Check the SQL Editor for any error messages

---

## Quick Links

- **SQL Editor**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new
- **API Settings**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api
- **Table Editor**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor

---

## What the SQL Script Does

The SQL script creates:
- ✅ `leaderboard` table with columns: id, name, score, total_questions, percentage, created_at
- ✅ Index for fast queries
- ✅ Row Level Security (RLS) enabled
- ✅ Policies to allow anyone to read, insert, and delete scores

---

## Need Help?

If you're still having issues:
1. Check the browser console (F12) for error messages
2. Check the terminal for any warnings
3. Verify all steps were completed correctly
4. Make sure your `.env.local` file is in the project root folder


# Quick Verification Checklist

Use this to verify your database setup is working correctly.

## ✅ Checklist

### Step 1: Database Table
- [ ] Opened SQL Editor: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new
- [ ] Copied SQL from `supabase-setup.sql`
- [ ] Pasted and ran SQL script
- [ ] Saw "Success. No rows returned" message
- [ ] Verified table exists at: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor

### Step 2: Environment File
- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL=https://pukgraslmfvcacmtlftx.supabase.co`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here`
- [ ] Saved the file

### Step 3: Server Restart
- [ ] Stopped dev server (Ctrl+C)
- [ ] Ran `npm run dev` again
- [ ] No Supabase credential warnings in terminal

### Step 4: Test
- [ ] Completed a quiz
- [ ] Entered name and submitted
- [ ] Opened leaderboard
- [ ] Score appears in leaderboard

## Common Issues

**If you see "Supabase credentials not found":**
- Check `.env.local` file exists
- Check file is named exactly `.env.local` (not `.env.local.txt`)
- Restart dev server after creating file

**If leaderboard is empty or errors:**
- Verify SQL script ran successfully
- Check table exists in Supabase dashboard
- Check browser console (F12) for errors


# 🔧 Troubleshooting: "Failed to save score" Error

If you're seeing "Failed to save score. Check browser console (F12) for details", follow these steps:

## Step 1: Check Browser Console

1. Open your browser's Developer Tools (Press `F12`)
2. Go to the **Console** tab
3. Look for error messages starting with `❌` or `💡`
4. The error message will tell you exactly what's wrong

## Common Issues & Solutions

### Issue 1: Missing `session_id` Column

**Error Message:**
```
column "session_id" does not exist
or
column leaderboard.session_id does not exist
```

**Solution:**
1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new
2. Open the file `supabase-migration-session-id.sql` from your project
3. Copy the entire contents
4. Paste it into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter`)
6. You should see "Success. No rows returned"
7. Try submitting your score again

### Issue 2: Table Doesn't Exist

**Error Message:**
```
relation "leaderboard" does not exist
or
table does not exist
```

**Solution:**
1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new
2. Open the file `supabase-setup.sql` from your project
3. Copy the entire contents
4. Paste it into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter`)
6. You should see "Success. No rows returned"
7. Try submitting your score again

### Issue 3: Missing Environment Variables

**Error Message:**
```
Supabase not configured
or
NEXT_PUBLIC_SUPABASE_ANON_KEY not found
```

**Solution:**
1. Check your `.env.local` file exists
2. Make sure it contains:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://pukgraslmfvcacmtlftx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
   ```
3. **Restart your dev server** after adding/changing environment variables
4. If on Vercel, add the variables in Vercel's dashboard (Settings → Environment Variables)

### Issue 4: Permission Denied

**Error Message:**
```
permission denied
or
Row Level Security policy
```

**Solution:**
1. Make sure you ran the full `supabase-setup.sql` script
2. The script creates the necessary RLS policies
3. Re-run the script if you see permission errors

## Quick Fix Checklist

- [ ] Check browser console (F12) for specific error
- [ ] Verify `.env.local` file exists and has both variables
- [ ] Restart dev server after changing `.env.local`
- [ ] Run `supabase-setup.sql` if table doesn't exist
- [ ] Run `supabase-migration-session-id.sql` if `session_id` column is missing
- [ ] Check Supabase dashboard to verify table structure

## Still Not Working?

1. **Copy the exact error message** from the browser console
2. **Check your Supabase table structure:**
   - Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor
   - Click on the `leaderboard` table
   - Verify it has these columns:
     - `id` (bigint)
     - `name` (text)
     - `score` (integer)
     - `total_questions` (integer)
     - `percentage` (integer)
     - `session_id` (text) ← **This is important!**
     - `created_at` (timestamp)

3. **If `session_id` is missing**, run the migration script

## Direct Links

- **Supabase SQL Editor**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new
- **Supabase Table Editor**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor
- **Supabase API Settings**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api


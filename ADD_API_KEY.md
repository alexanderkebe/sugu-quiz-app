# ⚡ Quick Fix: Add Your Supabase API Key

## The Problem
Your `.env.local` file is missing the Supabase anon key. Here's how to fix it:

## Step-by-Step (2 minutes)

### 1. Get Your API Key
1. Open this link: **https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api**
2. Scroll to **"Project API keys"** section
3. Find the key labeled **"anon"** or **"public"**
4. Click the **👁️ eye icon** to reveal it (if hidden)
5. Click the **📋 copy button** to copy it
   - It's a very long string like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Add It to `.env.local`
1. Open the file `.env.local` in your project root folder
2. You should see:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://pukgraslmfvcacmtlftx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```
3. Paste your copied key after the `=` sign:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://pukgraslmfvcacmtlftx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...paste_your_key_here
   ```
4. **Save the file**

### 3. Restart Server
1. Stop your dev server (press `Ctrl+C` in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 4. Test
- Complete a quiz
- Enter your name
- Submit - it should work now! ✅

## Still Not Working?

1. **Check the file name**: Must be exactly `.env.local` (not `.env.local.txt`)
2. **Check the format**: No quotes around the key, no spaces
3. **Check browser console** (F12) for any error messages
4. **Verify the key**: Make sure you copied the entire key (it's very long)

## Direct Links
- **Get API Key**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api
- **SQL Editor** (if table doesn't exist): https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/sql/new


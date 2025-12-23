# 🚀 Deploy to Vercel

Your code is now on GitHub! Here's how to deploy it to Vercel:

## Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select **`alexanderkebe/sugu-quiz-app`**
5. Click **"Import"**

## Step 2: Configure Project

1. **Framework Preset**: Should auto-detect as "Next.js" ✅
2. **Root Directory**: Leave as `./` (default)
3. **Build Command**: Leave as default (`npm run build`)
4. **Output Directory**: Leave as default (`.next`)
5. **Install Command**: Leave as default (`npm install`)

## Step 3: Add Environment Variables ⚠️ IMPORTANT

Before deploying, you **MUST** add your Supabase credentials:

1. In the Vercel project setup, scroll to **"Environment Variables"**
2. Click **"Add"** and add these two variables:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://pukgraslmfvcacmtlftx.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_Wyy8nszdMWN456Nj9tLbHQ_-IzojxMz`
   - **Environment**: Select all (Production, Preview, Development)

3. Click **"Deploy"**

## Step 4: Wait for Deployment

- Vercel will build and deploy your app
- This usually takes 1-2 minutes
- You'll get a live URL like: `https://sugu-quiz-app.vercel.app`

## Step 5: Verify Database Setup

Make sure your Supabase database is set up:

1. Go to: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/editor
2. Check if the `leaderboard` table exists
3. If not, go to SQL Editor and run the script from `supabase-setup.sql`

## ✅ Done!

Your app should now be live! Test it:
- Complete a quiz
- Submit your score
- Check the leaderboard

## Troubleshooting

**If leaderboard doesn't work:**
- Check that environment variables are set in Vercel
- Verify the `leaderboard` table exists in Supabase
- Check browser console (F12) for errors

**If build fails:**
- Check Vercel build logs
- Make sure all dependencies are in `package.json`
- Verify TypeScript compiles without errors

## Quick Links

- **GitHub Repo**: https://github.com/alexanderkebe/sugu-quiz-app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx
- **Vercel Dashboard**: https://vercel.com/dashboard


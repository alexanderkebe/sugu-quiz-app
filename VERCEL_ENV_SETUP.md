# 🔧 Fix Vercel Environment Variables

The error "Supabase not configured" on Vercel means you need to add environment variables in Vercel's dashboard.

## Quick Fix (2 minutes)

### Step 1: Go to Your Vercel Project Settings

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your **sugu-quiz-app** project
3. Click on it to open the project
4. Click on **"Settings"** tab (top menu)
5. Click on **"Environment Variables"** (left sidebar)

### Step 2: Add Environment Variables

Click **"Add New"** and add these **TWO** variables:

#### Variable 1:
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://pukgraslmfvcacmtlftx.supabase.co`
- **Environment**: Select **ALL** (Production, Preview, Development) ✅

Click **"Save"**

#### Variable 2:
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `sb_publishable_Wyy8nszdMWN456Nj9tLbHQ_-IzojxMz`
- **Environment**: Select **ALL** (Production, Preview, Development) ✅

Click **"Save"**

### Step 3: Redeploy

After adding the variables, you need to redeploy:

1. Go to the **"Deployments"** tab
2. Find your latest deployment
3. Click the **"⋯"** (three dots) menu
4. Click **"Redeploy"**
5. Confirm the redeploy

**OR** simply push a new commit to trigger a new deployment:

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## ✅ Verify It Works

After redeploying:
1. Wait 1-2 minutes for the build to complete
2. Visit your Vercel URL
3. Complete a quiz and submit your score
4. The leaderboard should now work! 🎉

## Important Notes

- ⚠️ **Environment variables are NOT automatically synced** from `.env.local` to Vercel
- ⚠️ You must manually add them in Vercel's dashboard
- ⚠️ Make sure to select **ALL environments** (Production, Preview, Development)
- ⚠️ After adding variables, you **MUST redeploy** for them to take effect

## Direct Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx

## Troubleshooting

**Still not working?**
1. Double-check the variable names are EXACTLY:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Make sure you selected ALL environments
3. Make sure you redeployed after adding the variables
4. Check the Vercel build logs for any errors
5. Open browser console (F12) on your Vercel site to see detailed error messages


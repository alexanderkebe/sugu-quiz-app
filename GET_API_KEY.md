# How to Get Your Supabase API Key

## Quick Steps

1. **Go to API Settings**
   - Open: https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api

2. **Find the "Project API keys" section**
   - Scroll down to see the keys

3. **Copy the "anon public" key**
   - Look for the key labeled **"anon"** or **"public"**
   - It's a very long string starting with `eyJ...`
   - Click the **👁️ eye icon** to reveal it if it's hidden
   - Click the **📋 copy button** next to it

4. **Add it to `.env.local`**
   - Open `.env.local` in your project root
   - Paste the key after `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
   - Save the file

5. **Restart your dev server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## Example `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://pukgraslmfvcacmtlftx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

**Note:** The key above is just an example. Use YOUR actual key from Supabase.

## Direct Link
👉 https://supabase.com/dashboard/project/pukgraslmfvcacmtlftx/settings/api


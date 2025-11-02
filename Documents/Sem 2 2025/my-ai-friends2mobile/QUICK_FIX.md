# Quick Fix Steps

The chat function needs debugging. Follow these steps:

## Step 1: Check Browser Console

1. Open your deployed site
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Try sending a chat message
5. **Copy all the error messages** you see (especially ones in red)

---

## Step 2: Check Netlify Function Logs

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click your site
3. Click **Functions** tab
4. Click on `chat` function
5. Click **Logs** tab
6. Try sending a chat message again
7. **Copy any error messages** you see

---

## Step 3: Verify Environment Variable

1. In Netlify → Your site → **Site settings** → **Environment variables**
2. Check if `OPENAI_API_KEY` exists
3. If it's missing, add it:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-...`)
   - Click **Save**
4. **Redeploy** after adding it

---

## What to Share

Please share:

1. **Browser console errors** (the red error messages)
2. **Netlify function logs** (any errors you see)
3. **Whether `OPENAI_API_KEY` exists** in Netlify environment variables

This will help me fix the exact issue!

---

## Most Common Issues:

1. **"OpenAI API key not configured"** → Add `OPENAI_API_KEY` in Netlify and redeploy
2. **"404 Not Found"** → Function not deployed correctly
3. **"CORS error"** → Should be handled automatically
4. **"Network error"** → Check if function URL is correct


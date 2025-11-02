# Netlify Setup Guide - Fix Chat Function

## Why the chat wasn't working

The chat function wasn't working because your frontend was trying to call `http://localhost:3001`, which doesn't exist when deployed. The backend server (`server.js`) needs to run somewhere.

## Solution: Netlify Functions

I've created a Netlify Function that runs your backend code directly on Netlify, so everything works in one place!

## Steps to Fix:

### 1. Add Environment Variable in Netlify

1. Go to your Netlify dashboard: [app.netlify.com](https://app.netlify.com)
2. Click on your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Add:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (from your `.env` file locally)
6. Click **Save**

### 2. Redeploy Your Site

After adding the environment variable, you need to trigger a new deployment:

**Option A: Push to Git**

```bash
git add .
git commit -m "Add Netlify function for chat"
git push
```

Netlify will automatically redeploy.

**Option B: Manual Deploy**

1. In Netlify dashboard, go to **Deploys**
2. Click **Trigger deploy** → **Clear cache and deploy site**

### 3. Verify It's Working

1. After deployment completes, visit your site
2. Try using the chat function
3. It should now work!

## What Changed:

1. ✅ Created `/netlify/functions/chat.js` - Netlify serverless function
2. ✅ Updated `src/App.jsx` to automatically detect Netlify and use the function
3. ✅ Updated `netlify.toml` to include functions directory
4. ✅ Added memory management so conversations persist

## Troubleshooting

### If chat still doesn't work:

1. **Check Netlify Function logs:**

   - In Netlify dashboard → **Functions** tab
   - Click on `chat` function
   - Check for error messages

2. **Verify environment variable:**

   - Go to **Site settings** → **Environment variables**
   - Make sure `OPENAI_API_KEY` is set and visible

3. **Check browser console:**

   - Open browser DevTools (F12)
   - Go to **Console** tab
   - Look for error messages

4. **Common issues:**
   - ❌ `OpenAI API key not configured` → Add `OPENAI_API_KEY` in Netlify
   - ❌ `CORS error` → Should be handled automatically
   - ❌ `Function not found` → Make sure the file is in `/netlify/functions/chat.js`

## Alternative: Use External Backend

If you prefer to deploy the backend separately (e.g., on Railway or Render):

1. Deploy `server.js` to Railway/Render/etc.
2. Get the URL (e.g., `https://your-app.railway.app`)
3. In Netlify, add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app.railway.app`
4. Redeploy

The app will automatically use this URL if set.

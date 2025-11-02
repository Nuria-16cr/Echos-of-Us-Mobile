# Netlify Functions Setup - Quick Fix

## The Problem

The chat function isn't working because it needs the `OPENAI_API_KEY` environment variable in Netlify.

## The Solution (2 Steps)

### Step 1: Add API Key to Netlify

1. Go to your Netlify dashboard: [app.netlify.com](https://app.netlify.com)
2. Click on your site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add variable"**
5. Add:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-...`)
6. Click **"Save"**

### Step 2: Redeploy

After adding the environment variable, you MUST redeploy:

1. In Netlify dashboard → **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy without cache"**
3. Wait for deployment to complete

## How It Works

- The Netlify Function at `/netlify/functions/chat.js` handles chat requests
- It uses `OPENAI_API_KEY` from Netlify's environment variables
- The frontend automatically detects Netlify and uses `/.netlify/functions/chat`
- No external backend needed!

## Verify It's Working

1. After redeployment completes, visit your site
2. Open browser DevTools (F12) → **Console** tab
3. Try to send a chat message
4. Check for errors:
   - ❌ "OpenAI API key not configured" → You didn't add `OPENAI_API_KEY` or didn't redeploy
   - ❌ "404 Not Found" → Function not deployed correctly
   - ✅ No errors = It should work!

## Troubleshooting

### Still not working?

1. **Check Netlify Functions tab:**

   - Netlify dashboard → **Functions** tab
   - You should see `chat` function listed
   - Click it → **Logs** tab to see errors

2. **Verify environment variable:**

   - **Site settings** → **Environment variables**
   - Make sure `OPENAI_API_KEY` is there (not `VITE_API_URL`)

3. **Clear cache and redeploy:**

   - **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

4. **Check browser console:**
   - Open DevTools (F12) → **Console**
   - Look for error messages when trying to chat

## Quick Checklist

- [ ] `OPENAI_API_KEY` added in Netlify environment variables
- [ ] Site redeployed after adding the variable
- [ ] Function exists in Netlify → Functions tab
- [ ] No errors in browser console
- [ ] No errors in Netlify function logs

## That's It!

Once you add `OPENAI_API_KEY` and redeploy, the chat should work! 🚀


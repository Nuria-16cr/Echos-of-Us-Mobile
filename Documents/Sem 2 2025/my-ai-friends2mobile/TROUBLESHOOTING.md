# Chat Function Troubleshooting Guide

## Issue: Chat function doesn't work on Netlify

Follow these steps to diagnose and fix the problem:

## Step 1: Check Browser Console

1. Open your deployed site
2. Open browser DevTools (F12 or right-click → Inspect)
3. Go to **Console** tab
4. Try to send a chat message
5. Look for error messages

**Common errors you might see:**

- `404 Not Found` → Function not deployed correctly
- `500 Internal Server Error` → API key issue or function error
- `CORS error` → Cross-origin issue
- `Failed to fetch` → Network error

## Step 2: Check Netlify Function Logs

1. Go to Netlify dashboard → Your site
2. Click **Functions** tab
3. Click on the `chat` function
4. Check the **Logs** tab for error messages

**Common issues:**

- `OpenAI API key not configured` → You need to add `OPENAI_API_KEY` environment variable
- `Module not found` → Dependencies issue
- `Timeout` → Function taking too long (might need timeout settings)

## Step 3: Verify Environment Variable

1. In Netlify → Your site → **Site settings**
2. Go to **Environment variables**
3. Make sure `OPENAI_API_KEY` exists and has your OpenAI API key

**Important:**

- The key must be exactly `OPENAI_API_KEY` (case-sensitive)
- The value should start with `sk-...`
- After adding/updating, you MUST redeploy

## Step 4: Verify Function is Deployed

1. In Netlify → Your site → **Functions** tab
2. You should see a `chat` function listed
3. If it's missing, the function file might not be in the right place

**Function should be at:** `/netlify/functions/chat.js`

## Step 5: Test the Function Directly

You can test the Netlify function directly by visiting:
`https://your-site.netlify.app/.netlify/functions/chat`

But this will show an error since it needs a POST request. To test properly:

1. Open browser DevTools → **Network** tab
2. Try to send a chat message
3. Look for a request to `/.netlify/functions/chat`
4. Click on it to see:
   - Request payload
   - Response status
   - Response body

## Step 6: Common Fixes

### Fix 1: Missing API Key

**Symptom:** Error says "OpenAI API key not configured"
**Solution:**

1. Add `OPENAI_API_KEY` in Netlify environment variables
2. Redeploy

### Fix 2: Function Not Found

**Symptom:** 404 error when calling the function
**Solution:**

1. Make sure `netlify.toml` has `functions = "netlify/functions"`
2. Make sure file is at `/netlify/functions/chat.js`
3. Redeploy

### Fix 3: CORS Error

**Symptom:** Browser console shows CORS error
**Solution:** The function should handle CORS, but if you see this error, check:

1. Function is returning correct headers
2. Preflight OPTIONS request is handled

### Fix 4: Timeout Error

**Symptom:** Request times out
**Solution:**

1. OpenAI API might be slow
2. Check function timeout settings in Netlify
3. Default is 10 seconds, might need to increase

## Step 7: Debug Information

After trying to chat, check the browser console for these debug messages:

- `Calling API at: ...` - Shows which URL is being used
- `API Response status: ...` - Shows the HTTP status code
- `API Error response: ...` - Shows error details

## Quick Checklist

- [ ] `OPENAI_API_KEY` is set in Netlify environment variables
- [ ] Site has been redeployed after adding the API key
- [ ] Function exists in Netlify → Functions tab
- [ ] Browser console shows no errors (or you've noted them)
- [ ] Function logs show no errors (or you've noted them)
- [ ] Network request to `/.netlify/functions/chat` is visible

## Still Not Working?

If none of these steps work, please check:

1. **Netlify build logs** - Go to Deploys → Latest deploy → Build log

   - Look for errors during build
   - Check if `openai` package is installed

2. **Function code** - Make sure `/netlify/functions/chat.js` exists and is correct

3. **API Key format** - Should be `sk-proj-...` or `sk-...` (starts with `sk-`)

4. **OpenAI account** - Make sure your OpenAI account has credits/quota

If you're still stuck, share:

- Browser console errors
- Netlify function logs
- Network request details


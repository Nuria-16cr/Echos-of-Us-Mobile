# Debug Steps - Chat Function Not Working

Follow these steps to diagnose the issue:

## Step 1: Check Browser Console

1. Open your deployed site
2. Open browser DevTools (F12 or right-click → Inspect)
3. Go to **Console** tab
4. Try to send a chat message
5. Look for messages like:
   - "Attempting to call: ..."
   - "Response status: ..."
   - Any error messages in red

**Write down what you see** - especially any error messages.

---

## Step 2: Check Netlify Function Logs

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click on your site
3. Go to **Functions** tab
4. Click on the `chat` function
5. Click on **Logs** tab
6. Try sending a chat message again
7. Look for errors or messages

**Write down what you see** - especially any errors.

---

## Step 3: Check Environment Variable

1. In Netlify dashboard → Your site
2. Go to **Site settings** → **Environment variables**
3. Check if `OPENAI_API_KEY` exists
4. Make sure it has a value (should start with `sk-...`)

**Note:** If it's missing, that's the problem! Add it and redeploy.

---

## Step 4: Check Function is Deployed

1. In Netlify dashboard → **Functions** tab
2. You should see `chat` function listed
3. If it's missing, the function file might not be in the right place

---

## Step 5: Test Function Directly

1. In Netlify dashboard → **Functions** tab
2. Click on `chat` function
3. Click on **Test** tab
4. Try sending a test request (you might need to check Netlify docs for this)

---

## Common Issues

### Issue 1: "OpenAI API key not configured"

**Solution:** Add `OPENAI_API_KEY` in Netlify environment variables and redeploy

### Issue 2: "404 Not Found" or "Function not found"

**Solution:** Make sure `/netlify/functions/chat.js` exists in your repo

### Issue 3: "CORS error"

**Solution:** The function should handle CORS, but check function logs

### Issue 4: "Network error" or "Failed to fetch"

**Solution:** Check if the function URL is correct: `/.netlify/functions/chat`

### Issue 5: No errors but nothing happens

**Solution:** Check browser console and function logs for hidden errors

---

## What to Share

When asking for help, share:

1. **Browser console errors** (copy the error messages)
2. **Netlify function logs** (copy any errors)
3. **Environment variables** (confirm `OPENAI_API_KEY` exists)
4. **Function status** (is it listed in Functions tab?)

This will help diagnose the exact issue!


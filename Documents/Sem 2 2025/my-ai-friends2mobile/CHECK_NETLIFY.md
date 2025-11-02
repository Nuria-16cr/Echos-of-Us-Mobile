# Quick Check: Is Your Netlify Function Working?

## Step 1: Check if Function is Deployed

1. Go to https://app.netlify.com
2. Click on your site
3. Click **"Functions"** tab
4. **Do you see a `chat` function listed?**
   - ✅ Yes → Function is deployed
   - ❌ No → Function is NOT deployed (this is the problem!)

## Step 2: Check Environment Variable

1. In Netlify dashboard → Your site
2. Click **"Site settings"** → **"Environment variables"**
3. **Do you see `OPENAI_API_KEY`?**
   - ✅ Yes → Good!
   - ❌ No → This is the problem! Add it.

## Step 3: Test Function Directly

Try visiting this URL in your browser:
`https://echos-of-us-mobile.netlify.app/.netlify/functions/chat`

**What happens?**

- ✅ Shows an error about POST method → Function EXISTS (good!)
- ❌ Shows 404 Not Found → Function does NOT exist (problem!)
- ❌ Shows nothing/timeout → Function might not be deployed

## Most Likely Issues:

1. **Function not deployed** → Make sure `/netlify/functions/chat.js` exists in your repo
2. **OPENAI_API_KEY missing** → Add it in Netlify dashboard → Environment variables
3. **Need to redeploy** → After adding API key, trigger a new deployment

# Free Backend Setup - Railway (No Netlify Credits Needed!)

Since you ran out of Netlify credits, let's deploy the backend to Railway (100% FREE).

## Step 1: Deploy Backend to Railway

### Option A: Railway (Easiest)

1. Go to https://railway.app
2. Sign up/login (use GitHub)
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository: `Echos-of-Us-Mobile`
5. Railway will detect `server.js`
6. **Add Environment Variable:**
   - Go to your project → **Variables** tab
   - Add: `OPENAI_API_KEY` = your OpenAI API key
7. Railway will give you a URL like: `https://your-app.railway.app`

### Option B: Render (Alternative)

1. Go to https://render.com
2. Sign up (free)
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repo
5. Settings:
   - **Build Command:** (leave empty)
   - **Start Command:** `node server.js`
6. **Add Environment Variable:**
   - `OPENAI_API_KEY` = your OpenAI API key
7. Render gives you URL: `https://your-app.onrender.com`

## Step 2: Update Frontend

After deploying, I'll help you update the frontend to use your Railway/Render URL.

## Step 3: Add to Netlify Environment Variables

1. Go to Netlify → Your site → **Site settings** → **Environment variables**
2. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-app.railway.app` (or your Render URL)
3. **Redeploy** your site

That's it! No more Netlify Functions needed.

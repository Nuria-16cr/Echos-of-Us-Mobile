# Quick Railway Setup (5 Minutes)

## 1. Go to Railway

Visit: https://railway.app

- Sign up with GitHub (free)
- Click "New Project"
- Click "Deploy from GitHub repo"
- Select: `Echos-of-Us-Mobile`

## 2. Add Your API Key

- Click your project
- Click "Variables" tab
- Click "+ New Variable"
- **Key:** `OPENAI_API_KEY`
- **Value:** Your OpenAI API key (starts with `sk-...`)
- Click "Add"

## 3. Get Your URL

- Railway will auto-deploy
- Once deployed, click "Settings"
- Find your **"Public Domain"** - looks like: `https://something.up.railway.app`
- **Copy this URL**

## 4. Add to Netlify

1. Go to Netlify → Your site
2. **Site settings** → **Environment variables**
3. Add new variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://something.up.railway.app` (paste Railway URL)
4. **Save**
5. **Trigger deploy** → **Clear cache and deploy site**

## Done!

Your frontend will now use Railway backend (no Netlify credits needed).

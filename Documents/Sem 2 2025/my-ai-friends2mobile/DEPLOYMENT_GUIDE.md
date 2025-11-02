# Deployment Guide - Mobile Version

This project uses the **same approach as the desktop version**: deploy the backend separately (Railway or Render), then connect the frontend to it.

## Step 1: Deploy Backend Server

Choose one option:

### Option A: Deploy to Railway (Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository: `my-ai-friends2mobile`
4. Railway will auto-detect the `server.js` file
5. Add environment variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-...`)
6. Railway will provide a URL like: `https://your-app.railway.app`
7. **Copy this URL** - you'll need it in Step 2

### Option B: Deploy to Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `my-ai-friends2mobile`
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: `Node`
5. Add environment variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
6. Click **"Create Web Service"**
7. Render will provide a URL like: `https://your-app.onrender.com`
8. **Copy this URL** - you'll need it in Step 2

---

## Step 2: Deploy Frontend to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your GitHub repository: `my-ai-friends2mobile`
4. Netlify will auto-detect Vite:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. **Add environment variable** (IMPORTANT):
   - **Key**: `VITE_API_URL`
   - **Value**: The backend URL from Step 1 (e.g., `https://your-app.railway.app`)
6. Click **"Deploy site"**

---

## Step 3: Verify It Works

1. After deployment completes, visit your Netlify site
2. Try using the chat function
3. It should work! 🎉

---

## Important Notes

- **No API key needed in Netlify** - only the backend needs `OPENAI_API_KEY`
- The frontend only needs `VITE_API_URL` pointing to your backend
- The backend handles all API key management

---

## Troubleshooting

### Chat still doesn't work?

1. **Check backend logs** (Railway/Render):

   - Make sure `OPENAI_API_KEY` is set
   - Check for any errors in the logs

2. **Check frontend environment variable** (Netlify):

   - Go to **Site settings** → **Environment variables**
   - Make sure `VITE_API_URL` is set to your backend URL
   - **Important**: No trailing slash! (e.g., `https://your-app.railway.app` not `https://your-app.railway.app/`)

3. **Redeploy after adding environment variables**:

   - After adding `VITE_API_URL` in Netlify, redeploy your site
   - The variable needs to be available at build time

4. **Test backend directly**:

   - Visit your backend URL: `https://your-app.railway.app/chat` (should show an error about POST method, which is fine)
   - If you get 404, the backend isn't deployed correctly

5. **Check browser console**:
   - Open DevTools (F12) → Console tab
   - Look for error messages when trying to chat

---

## Quick Checklist

- [ ] Backend deployed to Railway or Render
- [ ] Backend has `OPENAI_API_KEY` environment variable
- [ ] Frontend deployed to Netlify
- [ ] Frontend has `VITE_API_URL` environment variable pointing to backend
- [ ] Both services have been redeployed after adding environment variables

---

## That's it!

Your mobile version should now work exactly like your desktop version! 🚀

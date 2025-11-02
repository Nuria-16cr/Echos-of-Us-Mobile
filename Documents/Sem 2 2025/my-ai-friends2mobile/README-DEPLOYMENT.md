# Netlify Deployment Guide

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Frontend Deployment Steps

### 1. Push your code to Git

Make sure all your changes are committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Deploy via Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **"Deploy site"**

### 3. Environment Variables (Optional)

If you need to set environment variables:

1. Go to **Site settings** → **Environment variables**
2. Add `VITE_API_URL` with your backend API URL (e.g., `https://your-backend.railway.app` or `https://your-backend.onrender.com`)

## Backend Server Deployment

⚠️ **Important:** Your `server.js` needs to be deployed separately. The chat functionality requires a backend API running.

### Option 1: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Deploy from GitHub (select your repo)
4. Set environment variable: `OPENAI_API_KEY`
5. Railway will provide a URL like `https://your-app.railway.app`
6. Update `VITE_API_URL` in Netlify to this URL

### Option 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Build command: `npm install` (if server.js is separate) or use root package.json
5. Start command: `node server.js`
6. Add environment variable: `OPENAI_API_KEY`
7. Render will provide a URL
8. Update `VITE_API_URL` in Netlify

### Option 3: Netlify Functions (Advanced)

You can convert `server.js` to Netlify serverless functions, but this requires refactoring.

## Quick Deploy with Netlify CLI

Alternatively, you can use the Netlify CLI:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

## Files Created for Deployment

- `netlify.toml` - Netlify build configuration
- `public/_redirects` - SPA routing support
- Updated `vite.config.js` - Removed base path for Netlify
- `.gitignore` - Updated to exclude Netlify files

## Troubleshooting

- **Build fails?** Check that `npm run build` works locally
- **404 errors?** The `_redirects` file should handle SPA routing
- **API errors?** Make sure your backend is deployed and `VITE_API_URL` is set correctly
- **CORS errors?** Ensure your backend has CORS enabled for your Netlify domain


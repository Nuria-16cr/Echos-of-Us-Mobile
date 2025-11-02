# Railway Deployment Fix

## Common Railway Errors & Fixes

### Error 1: "Cannot find module"

**Fix:** Make sure Railway is installing dependencies:
- Go to Railway → Your project → **Variables**
- Railway should auto-detect `package.json`
- Check **Deploy Logs** to see if `npm install` ran

### Error 2: "Port not found" or "EADDRINUSE"

**Fix:** The server.js should use `process.env.PORT` (which it does ✅)

### Error 3: "Module not found" for Express/CORS/OpenAI

**Fix:** These are in package.json dependencies ✅

### Error 4: Build fails

**Try this:**
1. Go to Railway → Your project → **Settings**
2. Scroll to **"Build Command"**
3. Set it to: `npm install`
4. Or leave empty (Railway auto-detects)

### Error 5: Start command not found

**Fix:** Railway.json already has `startCommand: "node server.js"` ✅

## Quick Fix Steps:

1. **Check Railway Logs:**
   - Railway → Your project → **Deployments**
   - Click on the failed deployment
   - **What error do you see?** (This is important!)

2. **If "package.json not found":**
   - Make sure `package.json` is in the root (it is ✅)

3. **If "module not found":**
   - Check if dependencies installed
   - Railway → **Variables** → Make sure `OPENAI_API_KEY` is set
   - Try redeploying

4. **Alternative: Use Render instead**
   - Sometimes Render is easier
   - Go to https://render.com
   - Follow the same steps but Render has simpler setup

## What error message did Railway show?

Share the error message and I'll help fix it specifically!


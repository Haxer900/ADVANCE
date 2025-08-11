# ZENTHRA Deployment Order

Deploy in this exact order to avoid CORS issues:

## 1️⃣ Deploy Backends First (Render)
**Why first?** Frontends need backend URLs for environment variables

### Step 1A: User Backend
- Deploy `backend-api` folder to Render
- Get URL: `https://zenthra-user-api.onrender.com`

### Step 1B: Admin Backend  
- Deploy `backend-admin` folder to Render
- Get URL: `https://zenthra-admin-api.onrender.com`

## 2️⃣ Deploy Frontends Second

### Step 2A: User Frontend (Vercel)
- Deploy `frontend-website` folder to Vercel
- Use backend URL in environment variables
- Get URL: `https://your-app.vercel.app`

### Step 2B: Admin Frontend (Netlify)
- Deploy `frontend-admin` folder to Netlify  
- Use both backend URLs in environment variables
- Get URL: `https://your-admin.netlify.app`

## 3️⃣ Update Backend CORS
After getting frontend URLs, update backend environment variables:

**User Backend**: Add `FRONTEND_URL_VERCEL=https://your-actual-vercel-url`
**Admin Backend**: Add `ADMIN_FRONTEND_URL_NETLIFY=https://your-actual-netlify-url`

Then redeploy both backends.

## ✅ Test Everything
- User website loads products
- Admin panel shows dashboard  
- No CORS errors in console

Total deployment time: ~20-30 minutes
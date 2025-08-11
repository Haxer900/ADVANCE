# ZENTHRA - Complete Deployment Steps

## 🚀 Hosting Plan
- **User Frontend** → Vercel
- **User Backend** → Render  
- **Admin Frontend** → Netlify
- **Admin Backend** → Render

---

## 📋 Pre-Deployment Checklist

### Required Accounts
- [ ] GitHub account (code repository)
- [ ] Vercel account
- [ ] Netlify account  
- [ ] Render account
- [ ] PostgreSQL database (Neon recommended)
- [ ] MongoDB Atlas account
- [ ] Cloudinary account
- [ ] Stripe account (for payments)

---

## 🎯 STEP 1: Deploy User Backend to Render

### 1.1 Create Render Web Service
1. Go to [render.com](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. **Important**: Set **Root Directory** to `backend-api`

### 1.2 Configure Service Settings
```
Service Name: zenthra-user-api
Build Command: npm install && npm run build
Start Command: node dist/index.js
Environment: Node
Node Version: 18.x
```

### 1.3 Add Environment Variables
```bash
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=your_neon_postgresql_url
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zenthra

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_very_long_random_secret_key_min_32_chars

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS (will be updated after frontend deployment)
FRONTEND_URL_VERCEL=https://your-app-name.vercel.app
```

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your URL: `https://zenthra-user-api.onrender.com`

---

## 🎯 STEP 2: Deploy Admin Backend to Render

### 2.1 Create Second Render Web Service
1. Go back to Render dashboard
2. Click **"New"** → **"Web Service"**
3. Connect same GitHub repository
4. **Important**: Set **Root Directory** to `backend-admin`

### 2.2 Configure Service Settings
```
Service Name: zenthra-admin-api
Build Command: npm install && npm run build
Start Command: node dist/index.js
Environment: Node
Node Version: 18.x
```

### 2.3 Add Environment Variables
```bash
NODE_ENV=production
PORT=5001

# Database (same as user backend)
DATABASE_URL=your_neon_postgresql_url
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zenthra

# Cloudinary (same as user backend)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_very_long_random_secret_key_min_32_chars
ADMIN_JWT_SECRET=your_admin_jwt_secret_different_from_user

# Stripe (same as user backend)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key

# Email (same as user backend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# 2FA
TOTP_SECRET=your_2fa_secret_key

# CORS (will be updated after frontend deployment)
ADMIN_FRONTEND_URL_NETLIFY=https://your-admin-app.netlify.app
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your URL: `https://zenthra-admin-api.onrender.com`

---

## 🎯 STEP 3: Deploy User Frontend to Vercel

### 3.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important**: Set **Root Directory** to `frontend-website`

### 3.2 Configure Build Settings
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

### 3.3 Add Environment Variables
```bash
VITE_API_URL=https://zenthra-user-api.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
VITE_SITE_NAME=ZENTHRA
VITE_SITE_URL=https://your-app-name.vercel.app
```

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Note your URL: `https://your-app-name.vercel.app`

### 3.5 Update Backend CORS
1. Go back to Render → zenthra-user-api
2. Update environment variable:
   ```bash
   FRONTEND_URL_VERCEL=https://your-actual-vercel-url.vercel.app
   ```
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🎯 STEP 4: Deploy Admin Frontend to Netlify

### 4.1 Connect to Netlify
1. Go to [netlify.com](https://app.netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub repository
4. **Important**: Set **Base directory** to `frontend-admin`

### 4.2 Configure Build Settings
```
Build command: npm run build
Publish directory: frontend-admin/dist
Production branch: main
Node version: 18
```

### 4.3 Add Environment Variables
Go to Site settings → Environment variables:
```bash
VITE_ADMIN_API_URL=https://zenthra-admin-api.onrender.com/api/admin
VITE_API_URL=https://zenthra-user-api.onrender.com/api
VITE_ADMIN_SITE_NAME=ZENTHRA Admin Panel
VITE_ADMIN_SITE_URL=https://your-admin-app.netlify.app
```

### 4.4 Deploy
1. Click **"Deploy site"**
2. Wait for deployment (2-5 minutes)
3. Note your URL: `https://your-admin-app.netlify.app`

### 4.5 Update Backend CORS
1. Go back to Render → zenthra-admin-api
2. Update environment variable:
   ```bash
   ADMIN_FRONTEND_URL_NETLIFY=https://your-actual-netlify-url.netlify.app
   ```
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🎯 STEP 5: Final Configuration & Testing

### 5.1 Update All URLs
After all deployments, update your environment variables with actual URLs:

**User Backend (Render)**:
```bash
FRONTEND_URL_VERCEL=https://your-actual-vercel-url.vercel.app
```

**Admin Backend (Render)**:
```bash
ADMIN_FRONTEND_URL_NETLIFY=https://your-actual-netlify-url.netlify.app
```

### 5.2 Test Health Endpoints
Test these URLs in your browser:
- User API: `https://zenthra-user-api.onrender.com/health`
- Admin API: `https://zenthra-admin-api.onrender.com/health`

Both should return: `{"status":"OK","message":"...API is running"}`

### 5.3 Test Frontend Connections
1. **User Website**: Open your Vercel URL
   - Homepage should load
   - Products should display
   - No CORS errors in browser console

2. **Admin Panel**: Open your Netlify URL  
   - Login page should load
   - Dashboard should display after login
   - No CORS errors in browser console

---

## 🔧 Troubleshooting Common Issues

### CORS Errors
If you see CORS errors:
1. Double-check environment variables match exact URLs
2. Redeploy backend services after URL updates
3. Check browser network tab for exact error details

### Build Failures
- **Node version**: Ensure all platforms use Node 18.x
- **Dependencies**: Run `npm install` locally first to test
- **Environment variables**: Check for typos in variable names

### Database Connection Issues
- **PostgreSQL**: Ensure Neon database allows connections
- **MongoDB**: Check MongoDB Atlas network access settings
- **Connection strings**: Verify username/password are correct

### API Not Responding
- **Render sleep**: Free tier services sleep after 15 minutes
- **Cold starts**: First request may take 30+ seconds
- **Logs**: Check Render logs for specific error messages

---

## 📊 Final URLs Summary

After successful deployment:

```
User Website:    https://your-app-name.vercel.app
User API:        https://zenthra-user-api.onrender.com
Admin Panel:     https://your-admin-app.netlify.app  
Admin API:       https://zenthra-admin-api.onrender.com
```

---

## 🎉 Success Checklist

- [ ] All 4 services deployed successfully
- [ ] Health endpoints return 200 OK
- [ ] User website loads and displays products
- [ ] Admin panel loads and shows dashboard
- [ ] No CORS errors in browser console
- [ ] Database connections working
- [ ] Payment integration ready (Stripe)

Your ZENTHRA e-commerce platform is now live! 🚀
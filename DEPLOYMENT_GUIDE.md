# ZENTHRA - Complete Deployment Guide

## 🚀 Multi-Platform Deployment Strategy

Your ZENTHRA e-commerce platform is structured for deployment across multiple hosting providers for optimal performance and cost efficiency.

### Architecture Overview
- **Frontend Website** → Vercel (Customer-facing site)
- **Admin Panel** → Netlify (Admin interface)
- **Backend API** → Render (Customer APIs)
- **Backend Admin** → Render (Admin APIs)

---

## 📦 Step 1: Deploy Backend APIs to Render

### 1.1 Deploy Customer API (Port 5000)

1. **Create Render Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select `backend-api` folder

2. **Configuration**
   ```
   Name: zenthra-api
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL_VERCEL=https://zenthra-website.vercel.app
   DATABASE_URL=your_postgresql_url
   MONGODB_URI=your_mongodb_atlas_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_key
   ```

### 1.2 Deploy Admin API (Port 5001)

1. **Create Second Render Web Service**
   - Follow same steps as above
   - Select `backend-admin` folder

2. **Configuration**
   ```
   Name: zenthra-admin-api
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=5001
   ADMIN_FRONTEND_URL_NETLIFY=https://zenthra-admin.netlify.app
   DATABASE_URL=your_postgresql_url
   MONGODB_URI=your_mongodb_atlas_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   ADMIN_JWT_SECRET=your_admin_jwt_secret
   ```

**✅ Expected URLs:**
- Customer API: `https://zenthra-api.onrender.com`
- Admin API: `https://zenthra-admin-api.onrender.com`

---

## 🌐 Step 2: Deploy Frontend Website to Vercel

1. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" 
   - Import your GitHub repository
   - Select `frontend-website` folder

2. **Configuration**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://zenthra-api.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_SITE_NAME=ZENTHRA
   VITE_SITE_URL=https://zenthra-website.vercel.app
   ```

**✅ Expected URL:** `https://zenthra-website.vercel.app`

---

## 🛠️ Step 3: Deploy Admin Panel to Netlify

1. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select `frontend-admin` folder

2. **Configuration**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_ADMIN_API_URL=https://zenthra-admin-api.onrender.com/api/admin
   VITE_API_URL=https://zenthra-api.onrender.com/api
   VITE_ADMIN_SITE_NAME=ZENTHRA Admin Panel
   VITE_ADMIN_SITE_URL=https://zenthra-admin.netlify.app
   ```

**✅ Expected URL:** `https://zenthra-admin.netlify.app`

---

## 🔧 Step 4: Configure CORS and Connections

### Backend API CORS Update
After deployment, update your Render environment variables:

**Customer API Environment:**
```
FRONTEND_URL_VERCEL=https://your-actual-vercel-url.vercel.app
CUSTOM_DOMAIN=https://your-custom-domain.com (if applicable)
```

**Admin API Environment:**
```
ADMIN_FRONTEND_URL_NETLIFY=https://your-actual-netlify-url.netlify.app
CUSTOM_ADMIN_DOMAIN=https://admin.your-domain.com (if applicable)
```

### Frontend API Connections
The frontends will automatically connect to the correct APIs based on environment variables.

---

## ✅ Step 5: Verification Checklist

### Customer Website Tests
- [ ] Homepage loads correctly
- [ ] Products display from API
- [ ] Shopping cart functionality works
- [ ] Newsletter signup functions
- [ ] No CORS errors in console

### Admin Panel Tests
- [ ] Admin login works
- [ ] Dashboard displays data
- [ ] Product management functions
- [ ] Media upload works (if configured)
- [ ] Analytics display correctly

### API Health Checks
- [ ] Customer API: `https://zenthra-api.onrender.com/health`
- [ ] Admin API: `https://zenthra-admin-api.onrender.com/health`

---

## 🚨 Troubleshooting Common Issues

### CORS Errors
If you see CORS errors:
1. Check environment variables in Render
2. Ensure URLs match exactly (no trailing slashes)
3. Redeploy backend services after URL changes

### API Connection Failures
1. Verify backend services are running on Render
2. Check environment variables in frontend deployments
3. Test API endpoints directly in browser

### Build Failures
1. Check Node.js version compatibility
2. Verify all dependencies are in package.json
3. Review build logs for specific errors

---

## 📝 Final Notes

- **Render free tier**: Services may sleep after 15 minutes of inactivity
- **SSL**: All URLs use HTTPS by default
- **Monitoring**: Set up monitoring for production APIs
- **Backups**: Regular database backups recommended
- **Domain**: Configure custom domains in respective platforms

Your ZENTHRA platform is now ready for production! 🎉
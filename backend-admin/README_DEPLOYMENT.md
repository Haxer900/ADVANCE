# Deploy Admin Backend to Render

## Quick Deploy Steps

1. **Create Web Service**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - New → Web Service  
   - Connect same GitHub repository
   - Set **Root Directory**: `backend-admin`

2. **Service Configuration**
   ```
   Name: zenthra-admin-api
   Build Command: npm install && npm run build
   Start Command: node dist/index.js
   Environment: Node
   Node Version: 18.x
   ```

3. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=your_neon_postgresql_url
   MONGODB_URI=your_mongodb_atlas_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret_min_32_chars
   ADMIN_JWT_SECRET=your_admin_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   TOTP_SECRET=your_2fa_secret
   ADMIN_FRONTEND_URL_NETLIFY=https://your-admin.netlify.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment  
   - Test: https://your-service.onrender.com/health

## Local Development
```bash
cd backend-admin
npm install
npm run dev
```

Runs on: http://localhost:5001
# Deploy User Backend to Render

## Quick Deploy Steps

1. **Create Web Service**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - New → Web Service
   - Connect GitHub repository
   - Set **Root Directory**: `backend-api`

2. **Service Configuration**
   ```
   Name: zenthra-user-api
   Build Command: npm install && npm run build
   Start Command: npm start
   Environment: Node
   ```

3. **Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=your_neon_postgresql_url
   MONGODB_URI=your_mongodb_atlas_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret_min_32_chars
   STRIPE_SECRET_KEY=your_stripe_secret
   FRONTEND_URL_VERCEL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Test: https://your-service.onrender.com/health

## Local Development
```bash
cd backend-api
npm install
npm run dev
```

Runs on: http://localhost:5000
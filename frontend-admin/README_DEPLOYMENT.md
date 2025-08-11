# Deploy Admin Frontend to Netlify

## Quick Deploy Steps

1. **Connect Repository**
   - Go to [app.netlify.com/start](https://app.netlify.com/start)
   - Connect to GitHub
   - Select this repository
   - Set **Base directory**: `frontend-admin`

2. **Build Configuration**
   ```
   Build command: npm run build
   Publish directory: frontend-admin/dist
   Production branch: main
   Node version: 18
   ```

3. **Environment Variables**
   Go to Site settings → Environment variables:
   ```bash
   VITE_ADMIN_API_URL=https://zenthra-admin-api.onrender.com/api/admin
   VITE_API_URL=https://zenthra-user-api.onrender.com/api
   VITE_ADMIN_SITE_NAME=ZENTHRA Admin Panel
   VITE_ADMIN_SITE_URL=https://your-app.netlify.app
   ```

4. **Deploy**
   - Click "Deploy site" 
   - Note your URL
   - Update backend CORS with your actual Netlify URL

## Local Development
```bash
cd frontend-admin
npm install
npm run dev
```

Runs on: http://localhost:3001
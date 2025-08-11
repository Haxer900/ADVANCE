# Deploy User Frontend to Vercel

## Quick Deploy Steps

1. **Connect Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import from GitHub
   - Select this repository
   - Set **Root Directory**: `frontend-website`

2. **Build Configuration**
   ```
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node.js Version: 18.x
   ```

3. **Environment Variables**
   ```bash
   VITE_API_URL=https://zenthra-user-api.onrender.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   VITE_SITE_NAME=ZENTHRA
   VITE_SITE_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Note your URL
   - Update backend CORS with your actual Vercel URL

## Local Development
```bash
cd frontend-website
npm install
npm run dev
```

Runs on: http://localhost:3000
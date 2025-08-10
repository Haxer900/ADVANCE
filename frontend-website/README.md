# ZENTHRA - Frontend Website

Customer-facing e-commerce website for ZENTHRA premium women's fashion.

## 🚀 Deployment (Vercel)

### Automatic Deployment
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Vercel dashboard

### Environment Variables (Vercel)
```
VITE_API_URL=https://zenthra-api.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
VITE_SITE_NAME=ZENTHRA
VITE_SITE_URL=https://zenthra-website.vercel.app
```

## 📦 Local Development
```bash
npm install
npm run dev    # Development server (port 3000)
npm run build  # Production build
npm run preview # Preview production build
```

## 🎯 Features
- Premium product catalog
- Shopping cart & checkout
- User authentication
- Wishlist functionality
- Newsletter subscription
- Responsive design
- Dark/light theme toggle
- SEO optimized

## 🏗️ Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn/ui
- TanStack Query (API state)
- Zustand (local state)
- Wouter (routing)

## 📁 Project Structure
```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── lib/           # Utilities and config
├── hooks/         # Custom React hooks
└── assets/        # Static assets
```

## 🔗 API Integration
Connects to backend API at `VITE_API_URL` for:
- Product data
- Shopping cart
- User authentication
- Newsletter subscription
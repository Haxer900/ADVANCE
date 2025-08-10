# ZENTHRA - Admin Panel

Administrative interface for managing ZENTHRA e-commerce platform.

## 🚀 Deployment (Netlify)

### Automatic Deployment
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables (Netlify)
```
VITE_ADMIN_API_URL=https://zenthra-admin-api.onrender.com/api/admin
VITE_API_URL=https://zenthra-api.onrender.com/api
VITE_ADMIN_SITE_NAME=ZENTHRA Admin Panel
VITE_ADMIN_SITE_URL=https://zenthra-admin.netlify.app
```

## 📦 Local Development
```bash
npm install
npm run dev    # Development server (port 3001)
npm run build  # Production build
npm run preview # Preview production build
```

## 🎯 Admin Features
- Product management (CRUD)
- Order management & tracking
- User management
- Analytics dashboard
- Media management (Cloudinary)
- Email marketing campaigns
- System settings
- Real-time notifications

## 🏗️ Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn/ui
- TanStack Query (API state)
- Recharts (analytics)
- Zustand (local state)
- Wouter (routing)

## 📁 Project Structure
```
src/
├── components/     # Reusable components
├── pages/         # Admin page components
│   ├── analytics.tsx
│   ├── products.tsx
│   ├── orders.tsx
│   ├── users.tsx
│   └── settings.tsx
├── lib/           # Utilities and config
└── hooks/         # Custom React hooks
```

## 🔗 API Integration
Connects to two backend APIs:
- Admin API: `VITE_ADMIN_API_URL` (product management, analytics)
- Customer API: `VITE_API_URL` (customer data, orders)

## 🔐 Authentication
- JWT-based admin authentication
- Role-based access control
- Session management
- 2FA support
# ZENTHRA - Premium Women's Fashion E-commerce Platform

A modern, full-stack e-commerce platform with separate frontend website, admin panel, and backend APIs designed for independent deployment.

## Project Structure

```
├── frontend-website/     # Main customer-facing website (Deploy to Vercel)
├── frontend-admin/       # Admin panel interface (Deploy to Netlify)
├── backend-api/          # Customer API backend (Deploy to Render)
├── backend-admin/        # Admin API backend (Deploy to Render)
├── shared-types/         # Shared TypeScript types and schemas
└── attached_assets/      # Project assets and documentation
```

## Architecture Overview

### Frontend Website (Vercel Deployment)
- **Technology**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui Components
- **State Management**: Zustand + TanStack Query
- **Deployment**: Vercel (optimized for React/Vite)

### Admin Panel (Netlify Deployment)
- **Technology**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui Components
- **Features**: Product management, Order management, Analytics, Media management
- **Deployment**: Netlify (optimized for admin workflows)

### Backend API (Render Deployment)
- **Technology**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) + MongoDB Atlas
- **Media Storage**: Cloudinary
- **Features**: Customer APIs, Product catalog, Cart, Orders, Authentication

### Backend Admin (Render Deployment)
- **Technology**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) + MongoDB Atlas
- **Features**: Admin APIs, Media management, Analytics, User management

## Deployment Guide

### 1. Frontend Website (Vercel)
```bash
cd frontend-website
npm install
npm run build
# Deploy to Vercel via GitHub integration
```

### 2. Admin Panel (Netlify)
```bash
cd frontend-admin
npm install
npm run build
# Deploy to Netlify via GitHub integration
```

### 3. Backend API (Render)
```bash
cd backend-api
npm install
npm run build
# Deploy to Render with start command: npm start
```

### 4. Backend Admin (Render)
```bash
cd backend-admin
npm install
npm run build
# Deploy to Render with start command: npm start
```

## Environment Configuration

Each component has its own `.env.example` file with required environment variables:

- `frontend-website/.env.example` - Website environment variables
- `frontend-admin/.env.example` - Admin panel environment variables
- `backend-api/.env.example` - Customer API environment variables
- `backend-admin/.env.example` - Admin API environment variables

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon)
- MongoDB Atlas cluster
- Cloudinary account

### Local Development
```bash
# Terminal 1 - Frontend Website
cd frontend-website
npm install
npm run dev # Runs on port 3000

# Terminal 2 - Admin Panel
cd frontend-admin
npm install
npm run dev # Runs on port 3001

# Terminal 3 - Backend API
cd backend-api
npm install
npm run dev # Runs on port 5000

# Terminal 4 - Backend Admin
cd backend-admin
npm install
npm run dev # Runs on port 5001
```

## Features

### Customer Website
- ✅ Premium product catalog
- ✅ Shopping cart functionality
- ✅ User authentication
- ✅ Order management
- ✅ Wishlist and favorites
- ✅ Newsletter subscription
- ✅ Responsive design
- ✅ Dark/light theme toggle

### Admin Panel
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ User management
- ✅ Analytics dashboard
- ✅ Media management (Cloudinary)
- ✅ Email marketing
- ✅ Settings management
- ✅ Real-time notifications

### Backend Features
- ✅ RESTful API design
- ✅ PostgreSQL + MongoDB integration
- ✅ Cloudinary media storage
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Input validation

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript, Node.js
- **Database**: PostgreSQL (Neon), MongoDB Atlas
- **Media Storage**: Cloudinary
- **Authentication**: JWT
- **Deployment**: Vercel, Netlify, Render
- **State Management**: Zustand, TanStack Query
- **UI Components**: Shadcn/ui, Radix UI

## API Endpoints

### Customer API (Port 5000)
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/categories` - Get all categories
- `POST /api/cart` - Manage shopping cart
- `POST /api/newsletter` - Newsletter subscription

### Admin API (Port 5001)
- `GET /api/admin/products` - Admin product management
- `GET /api/admin/orders` - Order management
- `GET /api/admin/users` - User management
- `POST /api/admin/media` - Media upload/management
- `GET /api/admin/analytics` - Analytics data

## Security Features

- JWT-based authentication
- CORS configuration for each deployment
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure headers via Helmet
- Environment-based configuration
- Separate admin and customer APIs

## Contributing

1. Clone the repository
2. Create feature branch
3. Make changes in appropriate folder
4. Test locally
5. Submit pull request

## License

MIT License - See LICENSE file for details
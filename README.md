# ZENTHRA E-commerce Platform

A premium e-commerce platform built with modern technologies, featuring a comprehensive admin panel, MongoDB integration, and a classic design aesthetic.

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom ZENTHRA branding
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand for cart & session, TanStack Query for server state
- **UI Components**: Radix UI with Shadcn/ui styling
- **Build Tool**: Vite for fast development and optimized builds

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs encryption
- **Security**: Helmet, CORS, Rate limiting, Session management
- **API**: RESTful API with comprehensive endpoints

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zenthra-ecommerce
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB connection string
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin/login

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/zenthra
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret
ADMIN_EMAIL=yashparmar77077@gmail.com
ADMIN_PASSWORD=Yash@23072005
JWT_SECRET=your-jwt-secret
```

## 🎨 Features

### Customer Features
- ✅ Product catalog with filtering and search
- ✅ Shopping cart with session persistence
- ✅ Wishlist functionality
- ✅ User registration and authentication
- ✅ Order placement and tracking
- ✅ Product reviews and ratings
- ✅ Newsletter subscription
- ✅ Coupon code system
- ✅ Responsive design with dark/light themes

### Admin Features
- ✅ Comprehensive dashboard with analytics
- ✅ Product management (CRUD operations)
- ✅ Order management with status updates
- ✅ User management
- ✅ Category management
- ✅ Email marketing campaigns
- ✅ SMS/WhatsApp integration ready
- ✅ Refund request management
- ✅ Site settings configuration
- ✅ Notification system

## 🗄️ Database Schema

### Core Collections
- **Products**: Product catalog with variants, pricing, inventory
- **Categories**: Product categorization
- **Users**: User accounts with authentication
- **Orders**: Order management with status tracking
- **Cart**: Shopping cart items
- **Wishlist**: User favorites
- **Reviews**: Product reviews and ratings
- **Newsletter**: Email subscriptions
- **Coupons**: Discount codes
- **Settings**: Site configuration

## 🔐 Authentication

### Admin Access
- **Email**: yashparmar77077@gmail.com
- **Password**: Yash@23072005

### API Authentication
- JWT tokens for user sessions
- Role-based access control (user/admin)
- Secure password hashing with bcryptjs

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/products` - Get products
- `GET /api/categories` - Get categories
- `POST /api/newsletter/subscribe` - Newsletter signup
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Protected Endpoints
- `POST /api/cart` - Cart management
- `POST /api/orders` - Order placement
- `GET /api/wishlist/:sessionId` - Wishlist access

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - Order management
- All product/category CRUD operations

## 🌟 Design System

### Brand Colors (Classic Premium)
- **Primary Black**: `hsl(220, 13%, 9%)` - Deep charcoal for elegance
- **Classic Gold**: `hsl(45, 100%, 51%)` - Premium accent color
- **Text**: `hsl(220, 13%, 18%)` - Dark readable text
- **Light**: `hsl(220, 13%, 97%)` - Light backgrounds
- **Gray**: `hsl(220, 9%, 46%)` - Medium gray for secondary elements

### Typography
- **Headings**: Poppins (modern, clean)
- **Body**: Inter (readable, professional)
- **Brand**: Custom ZENTHRA classic logo design

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm run build
npm start
# Deploy to your preferred hosting platform
```

### Environment Setup
- Set `NODE_ENV=production` for production builds
- Update `FRONTEND_URL` to your frontend domain
- Configure MongoDB connection string
- Set secure session secrets and JWT keys

## 📱 Mobile Support
- Fully responsive design
- Touch-friendly interface
- Mobile-optimized navigation
- Progressive Web App ready

## 🔒 Security Features
- CORS protection
- Rate limiting
- Helmet.js security headers
- Secure session management
- Password encryption
- Input validation and sanitization

## 🎨 UI/UX Highlights
- Clean, minimal design
- Smooth animations and transitions
- Accessible components (Radix UI)
- Dark/light theme support
- Loading states and error handling
- Intuitive navigation

## 📊 Performance
- Code splitting and lazy loading
- Image optimization
- CDN ready
- Caching strategies
- Optimized bundle sizes

## 🛠️ Development

### Scripts
```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Backend
npm run dev          # Development with auto-reload
npm run build        # TypeScript compilation
npm start           # Production server
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Comprehensive error handling

## 📞 Support
For technical support or questions about the ZENTHRA platform, please contact the development team.

## 📄 License
This project is proprietary software developed for ZENTHRA e-commerce platform.

---

**ZENTHRA** - Premium E-commerce Experience
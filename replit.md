# MORE THAN FASHION E-commerce Platform

## Overview
MORE THAN FASHION is a premium e-commerce platform showcasing luxury lifestyle products. It features an elegant user interface, comprehensive shopping cart functionality, and newsletter subscription capabilities. The platform aims to provide a premium user experience with sophisticated branding, responsive design, and smooth user interactions. It supports full media management, multi-platform deployment, and comprehensive administrative controls for products, users, orders, and marketing.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes - October 7, 2025
- **Comprehensive Security Hardening Complete**: Production-ready security improvements implemented and architect-approved
- **Backend Security Enhancements**:
  - Implemented Winston production logger with file transports (error.log, combined.log)
  - Replaced all console.logs with structured logging throughout backend
  - Created input sanitization utilities for email, strings, and phone numbers
  - Applied sanitization to all authentication routes before database operations
  - Strengthened password validation: requires uppercase, lowercase, numbers, special characters, minimum 8 characters
  - Removed all error.message leaks from API responses for security
  - Configured trust proxy setting for rate limiting to work correctly behind proxies
- **Frontend Security Improvements**:
  - Removed all console.error/log statements from components
  - Fixed TypeScript LSP errors in my-orders and order-confirmation pages
  - Fixed currency consistency across all pages (standardized to ₹ INR)
- **Production Readiness**: All security fixes verified and approved by architect with no blocking issues
- **Next Steps for Production**: Configure log rotation/retention and monitor error logs after deployment

## Previous Changes - October 6, 2025
- **Production Security Audit Complete**: Comprehensive security hardening for soft launch
- **Critical Security Fixes**:
  - Removed all hardcoded admin credentials and JWT secret fallbacks
  - Implemented separate JWT secrets (JWT_SECRET for customers, JWT_SECRET_ADMIN for admins)
  - Admin tokens now expire in 8 hours vs 7 days for customers
  - MongoDB connection now requires MONGODB_URI (no silent fallbacks)
  - Razorpay payment verification enforces RZP_KEY_SECRET requirement
- **Admin Panel Hardening**:
  - Created ProtectedAdminRoute component with server-side token validation
  - Admin middleware always fetches fresh user role data (prevents stale token exploitation)
  - Frontend routes protected with loading states during auth verification
- **Security Middlewares Added**:
  - Helmet with CSP configuration for security headers
  - CORS with configurable ALLOWED_ORIGINS (development allows all, production validates)
  - Express rate limiting: 100 req/15min general API, 5 req/15min auth endpoints
- **Documentation**: Created comprehensive SOFT_LAUNCH_CHECKLIST.md with env vars, test procedures, and deployment steps
- **Status**: Architect-approved and ready for controlled soft launch

## Previous Changes - August 18, 2025
- **Favicon Visibility Fixed**: Created proper binary ICO favicon with multi-format support and web manifest
- **Performance Lag Eliminated**: Implemented selective GPU acceleration and mobile-optimized scrolling
- **Cache-Busting Added**: Force browser refresh for favicon with versioned parameters (?v=4)
- **Vercel Compatibility**: Ensured all favicon formats work on both development and production
- **Performance Monitoring**: Added intelligent performance optimization system with console logging

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Component-based architecture using React 18 for type safety.
- **Wouter**: Lightweight client-side routing.
- **TanStack Query**: Server state management and caching.
- **Zustand**: Local state management for cart and session handling.
- **Vite**: Build tool and development server.

### UI Framework and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Shadcn/ui Components**: Pre-built accessible React components based on Radix UI.
- **Custom Design System**: ZENTHRA brand colors (gold, black, gray) with CSS custom properties.
- **Typography**: Google Fonts (Playfair Display, Inter).

### Backend Architecture
- **Express.js**: RESTful API server with modular routing and global error handling.
- **TypeScript**: Type-safe server implementation.
- **CORS Configuration**: Implemented custom middleware to support multi-domain architecture.
- **Media Management**: Comprehensive system with Cloudinary integration for image/video storage, validation, and optimization (WebP conversion, MP4 optimization).

### Data Storage
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL.
- **PostgreSQL**: Primary database for production.
- **In-Memory Storage**: Development fallback with pre-seeded data.
- **MongoDB Atlas**: Used for comprehensive media management storage alongside Cloudinary.

### Database Schema
- **Core Entities**: Products (with variants), Categories, Users, Orders, Order Items, Cart Items, Reviews, Wishlist, Coupons, Newsletter.
- **Admin Specific**: Blog Posts, Site Settings, Recently Viewed.

### Session Management
- **Client-side Sessions**: Browser localStorage for persistence.
- **Cart Persistence**: Session-based cart state with synchronization.

### API Design
- **RESTful Endpoints**: Standard HTTP methods for CRUD operations with resource-based URLs.
- **JSON Communication**: Consistent request/response format.

### Build and Development
- **Multi-Platform Architecture**: Codebase separated into independent deployable components (customer website, admin panel, customer API, admin API).
- **Independent Package Management**: Each component has optimized dependencies.
- **TypeScript Compilation**: Shared configuration for consistency.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **@neondatabase/serverless**: Connection driver.
- **Cloudinary**: Cloud-based media management for images and videos.
- **MongoDB Atlas**: Cloud database for media metadata and related data.

### UI and Styling
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first styling.
- **Lucide React**: Icon library.
- **Class Variance Authority**: Type-safe component variant management.

### State Management and API
- **TanStack Query**: Server state caching and synchronization.
- **Zustand**: Lightweight local state management.

### Development Tools
- **Vite**: Modern build tool.
- **ESBuild**: Fast JavaScript bundler.
- **TypeScript**: Type system.

### Form Handling and Validation
- **React Hook Form**: Form state management.
- **Zod**: Runtime type validation and schema validation.
- **@hookform/resolvers**: Integration with Zod.

### Date and Utilities
- **date-fns**: Date manipulation.
- **clsx & tailwind-merge**: Conditional CSS class management.
```
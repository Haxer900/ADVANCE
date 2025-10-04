# MORE THAN FASHION E-commerce Platform

## Overview
MORE THAN FASHION is a premium e-commerce platform showcasing luxury lifestyle products. It features an elegant user interface, comprehensive shopping cart functionality, and newsletter subscription capabilities. The platform aims to provide a premium user experience with sophisticated branding, responsive design, and smooth user interactions. It supports full media management, multi-platform deployment, and comprehensive administrative controls for products, users, orders, and marketing.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes - October 4, 2025
- **GitHub Import Setup Complete**: Successfully configured ZENTHRA e-commerce platform for Replit
- **Environment Configuration**: 
  - Server running on port 5000 with 0.0.0.0 host binding
  - Vite dev server configured with `allowedHosts: true` for Replit proxy compatibility
  - Express + Vite fullstack setup verified and working
- **Workflow Configuration**: Development workflow configured with webview output on port 5000
- **Deployment Ready**: Autoscale deployment configured with build (`npm run build`) and start (`npm run start`) commands
- **Dependencies**: All npm packages installed and working (647 packages)
- **Database**: Optional PostgreSQL support with in-memory fallback for development
- **Application Status**: Frontend and backend fully functional, homepage loading successfully

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
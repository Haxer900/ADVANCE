# MORE THAN FASHION E-commerce Platform

## Overview

MORE THAN FASHION is a premium e-commerce platform built with a modern full-stack architecture featuring React frontend and Express.js backend. The application showcases luxury lifestyle products with an elegant user interface, comprehensive shopping cart functionality, and newsletter subscription capabilities. The system is designed with a focus on premium user experience, featuring sophisticated styling with custom MORE THAN FASHION branding, responsive design, and smooth user interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (January 2025)

### Replit Migration & Loading Optimization (January 9, 2025)
- **Complete Migration**: Successfully migrated from Replit Agent to standard Replit environment
- **Loading Sequence Fix**: Eliminated default fallback content before custom preloader
- **Inline Critical CSS**: Added immediate-loading preloader styles inlined in HTML head
- **Clean Architecture**: Removed duplicate frontend/backend folders, consolidated to client/server structure
- **Dependency Resolution**: Fixed missing dependencies (cross-env, express, types) for clean startup
- **Performance Optimization**: Preloader now displays immediately on page load without flicker
- **Smooth Transitions**: Implemented proper loading sequence with React app hidden until preloader completes
- **Loading Sequence Fix**: Eliminated default fallback content before custom preloader
- **Inline Critical CSS**: Added immediate-loading preloader styles inlined in HTML head
- **Clean Architecture**: Removed duplicate frontend/backend folders, consolidated to client/server structure
- **Dependency Resolution**: Fixed missing dependencies (cross-env, express, types) for clean startup
- **Performance Optimization**: Preloader now displays immediately on page load without flicker
- **Smooth Transitions**: Implemented proper loading sequence with React app hidden until preloader completes

### Comprehensive System Overhaul & Deployment Preparation (January 5, 2025)
- **Classic Logo Design**: Replaced RGB lighting effects with elegant classic MORE THAN FASHION logo featuring gold accents
- **Frontend/Backend Separation**: Complete architectural separation for independent hosting deployment
- **MongoDB Integration**: Full MongoDB setup with comprehensive schemas and API endpoints
- **Admin Credentials Updated**: Changed to yashparmar77077@gmail.com with password Yash@23072005
- **Currency Conversion to INR**: Implemented comprehensive INR (₹) currency formatting throughout the entire application
- **Complete Admin Panel Implementation**: Created all requested admin management pages with full functionality
- **Admin Pages Created**: Orders, Users, Categories, Analytics, Refunds, Notifications, Email Marketing, SMS/WhatsApp, Settings
- **Settings Page**: Full frontend control capabilities for editing website content, slogans, logos, banners, and site configuration
- **Email Marketing**: Complete campaign management with templates, subscriber management, and analytics
- **SMS/WhatsApp Integration**: Ready for Twilio, AWS SNS, WhatsApp Business API with template management
- **Refund Management**: Complete refund request processing with status tracking and approval workflow
- **Notification System**: Admin notification management with priority levels and activity tracking
- **Analytics Dashboard**: Comprehensive metrics, charts, and reporting with sales trends and customer insights
- **Route Handling Fix**: Addressed page reload issues for SPA routing compatibility

### Project Migration Completed (January 5, 2025)
- **Database Configuration**: Fixed PostgreSQL connection issues with proper fallback to in-memory storage
- **Admin Authentication**: Updated admin user credentials and authentication system
- **Storage System**: Implemented dual storage approach supporting both PostgreSQL and memory-based storage
- **Application Status**: Successfully running on port 5000 with full functionality

### Comprehensive E-commerce Feature Implementation
- **Complete Modern UI/UX Overhaul**: Dark/light theme toggle, sticky navigation, preloader, scroll-to-top, announcement bar
- **Advanced E-commerce Features**: Wishlist functionality, product reviews & ratings, advanced filtering, coupon system
- **Enhanced Shopping Experience**: Recently viewed products, product variants, low-stock alerts, size guides
- **Professional Checkout Process**: Multi-step checkout, payment integration ready, coupon application, order tracking
- **Content Management**: Blog system, newsletter integration, SEO optimization, social media integration
- **Marketing & Analytics**: Exit-intent popups, flash sales, countdown timers, social proof sections
- **Legal & Compliance**: Cookie consent (GDPR), privacy policy, terms & conditions, return policies
- **Performance Optimization**: Lazy loading, image optimization, caching, CDN integration ready
- **Security Features**: HTTPS/SSL ready, secure headers, brute-force protection, password encryption
- **Multi-platform Integration**: Payment gateways (Stripe, PayPal), shipping APIs, SMS/email services ready

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Component-based architecture using React 18 with TypeScript for type safety
- **Wouter for Routing**: Lightweight client-side routing instead of React Router
- **TanStack Query**: Server state management and caching for API interactions
- **Zustand**: Local state management for cart functionality and session handling
- **Vite**: Build tool and development server for fast compilation and HMR

### UI Framework and Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/ui Components**: Pre-built accessible React components with Radix UI primitives
- **Custom Design System**: ZENTHRA brand colors (gold, black, gray) with CSS custom properties
- **Typography**: Google Fonts integration (Playfair Display for headings, Inter for body text)

### Backend Architecture
- **Express.js**: RESTful API server with middleware for JSON parsing and request logging
- **TypeScript**: Type-safe server implementation
- **Modular Routing**: Centralized route registration with organized endpoint structure
- **Error Handling**: Global error middleware with proper HTTP status codes

### Data Storage
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL interactions
- **PostgreSQL**: Primary database configured for production use
- **In-Memory Storage**: Development fallback with pre-seeded data for testing
- **Schema Management**: Shared schema definitions between frontend and backend

### Database Schema
- **Products**: ID, name, description, price, image URL, category, stock status, featured flag, variants
- **Categories**: ID, name, description, image URL for product categorization
- **Cart Items**: Session-based shopping cart with product references and quantities
- **Newsletter**: Email subscription management with timestamps
- **Users**: Complete user management with authentication, profiles, and roles
- **Reviews**: Product reviews and ratings system with verification
- **Wishlist**: User wishlist management with favorites
- **Orders**: Complete order management with status tracking, payments, and shipping
- **Order Items**: Detailed order line items with variants and pricing
- **Product Variants**: Size, color, material variations with separate pricing and inventory
- **Coupons**: Discount codes with usage limits, expiration, and validation rules
- **Recently Viewed**: Track user browsing history for personalized recommendations
- **Blog Posts**: Content management system for blog articles and guides
- **Site Settings**: Dynamic configuration management for site-wide settings

### Session Management
- **Client-side Sessions**: Browser localStorage for session persistence
- **Cart Persistence**: Session-based cart state with automatic synchronization
- **Real-time Updates**: Periodic cart refresh and state synchronization

### API Design
- **RESTful Endpoints**: Standard HTTP methods for CRUD operations
- **Resource-based URLs**: `/api/products`, `/api/categories`, `/api/cart`, `/api/newsletter`
- **JSON Communication**: Consistent request/response format with proper error handling
- **Query Parameters**: Support for filtering (category, featured products)

### Build and Development
- **Development**: Vite dev server with Express API proxy
- **Production Build**: Static file serving with Express for SPA routing
- **TypeScript Compilation**: Shared configuration for frontend/backend consistency
- **Hot Module Replacement**: Development efficiency with instant updates

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production
- **@neondatabase/serverless**: Connection driver for serverless environments

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variant management

### State Management and API
- **TanStack Query**: Server state caching and synchronization
- **Zustand**: Lightweight state management for local application state

### Development Tools
- **Vite**: Modern build tool with fast HMR and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code
- **TypeScript**: Type system for enhanced developer experience and code quality

### Form Handling and Validation
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Runtime type validation and schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Date and Utilities
- **date-fns**: Date manipulation and formatting utilities
- **clsx & tailwind-merge**: Conditional CSS class management

### Production Considerations
- **Express Static Serving**: Production-ready static file serving
- **Environment Configuration**: Development/production environment handling
- **Error Boundaries**: Comprehensive error handling throughout the application
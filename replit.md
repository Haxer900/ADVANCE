# MORE THAN FASHION E-commerce Platform

## Overview

MORE THAN FASHION is a premium e-commerce platform built with a modern full-stack architecture featuring React frontend and Express.js backend. The application showcases luxury lifestyle products with an elegant user interface, comprehensive shopping cart functionality, and newsletter subscription capabilities. The system is designed with a focus on premium user experience, featuring sophisticated styling with custom MORE THAN FASHION branding, responsive design, and smooth user interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (August 2025)

### Replit Migration & Render Deployment Fix (August 11, 2025)
- **Replit Environment Migration**: Successfully migrated project from Replit Agent to Replit environment
- **Cross-env Dependency**: Installed missing cross-env package for proper environment variable handling
- **Server Host Configuration**: Updated server binding from 127.0.0.1 to 0.0.0.0 for Replit accessibility
- **Render CommonJS Fix**: Resolved ESM/CommonJS compatibility issues for Render deployment
- **Build Configuration Update**: Changed backend builds from ESM to CommonJS format in both admin and API backends
- **TypeScript Module System**: Updated TypeScript configs to use CommonJS module system for production builds
- **Application Status**: Full-stack application running successfully on port 5000 with proper API endpoints
- **Development Environment**: Vite development server properly connected and serving frontend

## Previous Updates (January 2025)

### Comprehensive Media Storage Integration (January 9, 2025)
- **Complete Media API Implementation**: Built comprehensive media management system with Cloudinary and MongoDB Atlas integration
- **File Validation System**: Implemented strict file type validation for only JPEG, PNG, WebP, and MP4 formats as requested
- **Product-Media CRUD Operations**: Created full CRUD API endpoints for products with media management (/api/products-media)
- **Dual Storage Architecture**: Implemented hybrid storage system with in-memory fallback and MongoDB Atlas persistence
- **Environment Configuration**: Enhanced .env.example with all required credentials for Cloudinary and MongoDB Atlas (AWS Mumbai cluster)
- **Health Check System**: Added comprehensive validation service to test Cloudinary connection, MongoDB Atlas connection, and file upload validation
- **Media Optimization**: Automatic WebP conversion for images and MP4 optimization for videos with CDN delivery
- **Admin Panel Ready**: Complete backend API supporting adding, editing, deleting products and their media from admin panel
- **Security Features**: Strict file type validation by both MIME type and file extension with configurable size limits
- **API Documentation**: Created comprehensive API documentation with integration examples and testing guides

### Multi-Platform Architecture Restructure (January 10, 2025)
- **Complete Project Restructure**: Separated codebase into independent deployable components for multi-platform hosting strategy
- **Frontend Website Separation**: Created standalone React application for customer-facing website (Vercel deployment)
- **Admin Panel Separation**: Isolated admin interface as independent React application (Netlify deployment)
- **Backend API Separation**: Split backend into customer API (port 5000) and admin API (port 5001) for Render deployment
- **Independent Package Management**: Each component has its own package.json with optimized dependencies
- **Environment Configuration**: Created separate .env.example files for each deployment target
- **CORS Configuration**: Implemented custom CORS middleware for each backend to support multi-domain architecture
- **TypeScript Configuration**: Independent TypeScript configs for each component with proper path aliases
- **Deployment Documentation**: Comprehensive README files with deployment instructions for Vercel, Netlify, and Render
- **Shared Types System**: Created shared-types folder for consistent TypeScript interfaces across all components
- **Development Workflow**: Set up independent development servers on different ports (3000, 3001, 5000, 5001)
- **Security Architecture**: Separate authentication and authorization systems for customer and admin APIs
- **CORS Resolution**: Implemented comprehensive CORS middleware supporting wildcard domains and multi-platform deployment
- **API Integration**: Created smart API clients with environment-based URL switching and proper error handling
- **Deployment Configuration**: Added platform-specific config files (vercel.json, netlify.toml) and deployment guides
- **Cross-Domain Communication**: Resolved all CORS errors between separated frontend and backend components
- **Build Dependencies Fixed**: Installed missing esbuild, typescript, and @types/node dependencies across all components
- **TypeScript Configuration**: Created proper tsconfig.json files for Node ESM output in all backend services
- **Asset Resolution**: Fixed missing logo assets and theme provider components for successful builds
- **Deployment Verification**: All 4 components now build successfully and are ready for multi-platform deployment
- **Schema Import Resolution**: Fixed @shared/schema module resolution by copying schema files locally to backend directories
- **Render Runtime Fix**: Resolved all module import issues causing runtime failures on Render deployment
- **Bundle Optimization**: Successfully created production bundles (User API: 2.5MB, Admin API: optimized)

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
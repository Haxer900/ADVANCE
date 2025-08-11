import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// Security middleware
app.use(helmet());

// CORS middleware for admin panel - Allow all origins for development, specific origins for production
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3001",
    "https://localhost:3001", 
    "http://127.0.0.1:3001",
    "https://zenthra-admin.netlify.app",
    "https://*.netlify.app",
    process.env.ADMIN_FRONTEND_URL,
    process.env.ADMIN_FRONTEND_URL_NETLIFY,
    // Add any custom admin domains
    process.env.CUSTOM_ADMIN_DOMAIN
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(allowedOrigin => {
    if (allowedOrigin?.includes('*')) {
      const pattern = allowedOrigin.replace(/\*/g, '.*');
      return new RegExp(pattern).test(origin || '');
    }
    return allowedOrigin === origin;
  });
  
  // Allow all origins in development
  if (process.env.NODE_ENV === 'development' || isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ZENTHRA Admin API is running' });
});

// Admin API routes
app.get('/api/admin/dashboard', (req, res) => {
  res.json({ message: 'Admin dashboard API ready' });
});

// Error handling
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server only if not imported as module
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ZENTHRA Admin API server running on port ${PORT}`);
  });
}

export default app;
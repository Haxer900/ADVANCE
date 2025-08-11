import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Security middleware
app.use(helmet());

// CORS middleware - Allow all origins for development, specific origins for production
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://zenthra-website.vercel.app",
    "https://*.vercel.app",
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_VERCEL,
    // Add any custom domains
    process.env.CUSTOM_DOMAIN
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
  res.status(200).json({ status: 'OK', message: 'ZENTHRA Website API is running' });
});

async function startServer() {
  try {
    // Register routes
    const server = await registerRoutes(app);
    
    // Start server only if not imported as module (CommonJS compatible)
    if (require.main === module) {
      server.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 ZENTHRA Website API server running on port ${PORT}`);
      });
    }
    
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start server if this file is run directly (CommonJS compatible)
if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
module.exports.default = app;
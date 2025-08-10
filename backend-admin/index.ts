import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// Security middleware
app.use(helmet());

// CORS middleware for admin panel
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
    process.env.ADMIN_FRONTEND_URL_NETLIFY || "https://zenthra-admin.netlify.app"
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Admin API routes (placeholder for now)
app.get('/api/admin/health', (req, res) => {
  res.json({ status: 'OK', message: 'Admin API is running' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ZENTHRA Admin API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ZENTHRA Admin API server running on port ${PORT}`);
});

export default app;
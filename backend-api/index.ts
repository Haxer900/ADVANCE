import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Security middleware
app.use(helmet());

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.FRONTEND_URL_VERCEL || "https://zenthra-website.vercel.app"
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ZENTHRA Website API is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ZENTHRA Website API server running on port ${PORT}`);
});

export default app;
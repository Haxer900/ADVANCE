import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/database.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'zenthra-jwt-secret';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: decoded.id });
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid.' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};
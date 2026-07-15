import { Request, Response, NextFunction } from 'express';
import { verifyToken, sendError } from '../utils/helpers';
import User from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

// Protect Routes - Verify JWT Token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 401, 'Please log in to continue');
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 401, 'Invalid or expired token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error: any) {
    sendError(res, 500, 'Authentication error', error);
  }
};

// Authorize Admin
export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, 403, 'Access denied. Admin privileges required');
  }
  next();
};

// Optional Authentication
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    if (token && token !== 'undefined') {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.userId = decoded.userId;
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next(); // Continue without user
  }
};

// Validate Request Body
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }
    req.body = value;
    next();
  };
};

// Error Handling Middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err.name === 'CastError') {
    return sendError(res, 400, 'Invalid ID format');
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');
    return sendError(res, 400, message);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 400, `${field} already exists`);
  }

  sendError(res, err.status || 500, err.message || 'Internal Server Error', err);
};

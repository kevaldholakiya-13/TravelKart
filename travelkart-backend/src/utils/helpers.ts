// import jwt from 'jsonwebtoken';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Response } from 'express';

// Generate JWT Token
export const generateToken = (userId: string): string => {
  const secret: Secret = process.env.JWT_SECRET || 'secret';

  const options: SignOptions = {
    expiresIn: '7d',
  };

  return jwt.sign({ userId }, secret, options);
};

// Verify JWT Token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    return null;
  }
};

// Send Success Response
export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

// Send Error Response
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any
) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error: error.message }),
  });
};

// Generate Order Number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TK${timestamp.slice(-8)}${random}`;
};

// Check if Pincode is Deliverable
export const isDeliverable = (pincode: string): boolean => {
  const deliverablePincodes = (process.env.DELIVERABLE_PINCODES || '').split(',');
  return deliverablePincodes.includes(pincode.trim());
};

// Calculate Delivery Days
export const getDeliveryDays = (pincode: string): number => {
  if (!isDeliverable(pincode)) {
    return 0;
  }
  // Default 3-5 days delivery for deliverable pincodes
  return Math.floor(Math.random() * 3) + 3;
};

// Format Currency
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

// Validate Email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate Phone
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Paginate Results
export const getPaginationParams = (page: any = 1, limit: any = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;
  return { skip, limit: limitNum, page: pageNum };
};

// Sanitize String
export const sanitizeString = (str: string): string => {
  return str.trim().toLowerCase();
};

// Generate SKU
export const generateSKU = (categoryName: string, productId: string): string => {
  const categoryCode = categoryName.slice(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const idCode = productId.toString().slice(-4).toUpperCase();
  return `${categoryCode}-${timestamp}-${idCode}`;
};

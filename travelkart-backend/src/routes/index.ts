import { Router } from 'express';
import { sendSuccess } from '../utils/helpers';

// Cart Routes
const cartRouter = Router();
cartRouter.get('/', (req, res) => sendSuccess(res, 200, 'Get cart'));
cartRouter.post('/', (req, res) => sendSuccess(res, 201, 'Add to cart'));
cartRouter.put('/:id', (req, res) => sendSuccess(res, 200, 'Update cart item'));
cartRouter.delete('/:id', (req, res) => sendSuccess(res, 200, 'Remove from cart'));

// Payments Routes
const paymentsRouter = Router();
paymentsRouter.post('/stripe', (req, res) => sendSuccess(res, 200, 'Process Stripe payment'));
paymentsRouter.post('/razorpay', (req, res) => sendSuccess(res, 200, 'Process Razorpay payment'));
paymentsRouter.post('/verify', (req, res) => sendSuccess(res, 200, 'Verify payment'));

// Users Routes
const usersRouter = Router();
usersRouter.get('/:id', (req, res) => sendSuccess(res, 200, 'Get user'));
usersRouter.put('/:id', (req, res) => sendSuccess(res, 200, 'Update user'));
usersRouter.post('/:id/avatar', (req, res) => sendSuccess(res, 201, 'Update avatar'));

// Reviews Routes
const reviewsRouter = Router();
reviewsRouter.get('/:productId', (req, res) => sendSuccess(res, 200, 'Get product reviews'));
reviewsRouter.post('/', (req, res) => sendSuccess(res, 201, 'Create review'));
reviewsRouter.put('/:id', (req, res) => sendSuccess(res, 200, 'Update review'));
reviewsRouter.delete('/:id', (req, res) => sendSuccess(res, 200, 'Delete review'));

// Admin Routes
const adminRouter = Router();
adminRouter.get('/dashboard/stats', (req, res) => 
  sendSuccess(res, 200, 'Dashboard stats', {
    totalSales: 450000,
    totalOrders: 156,
    totalCustomers: 892,
    totalProducts: 234,
  })
);
adminRouter.get('/orders', (req, res) => sendSuccess(res, 200, 'Get all orders'));
adminRouter.get('/customers', (req, res) => sendSuccess(res, 200, 'Get all customers'));
adminRouter.post('/coupons', (req, res) => sendSuccess(res, 201, 'Create coupon'));
adminRouter.get('/analytics', (req, res) => sendSuccess(res, 200, 'Get analytics data'));

export { cartRouter, paymentsRouter, usersRouter, reviewsRouter, adminRouter };

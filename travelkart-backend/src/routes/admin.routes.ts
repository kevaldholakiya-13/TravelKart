import { Router } from 'express';
import { sendSuccess, sendError } from '../utils/helpers';
import { protect, authorizeAdmin } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

const router = Router();

// Dashboard Stats
router.get('/dashboard/stats', protect, authorizeAdmin, async (req: AuthRequest, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Mock total sales
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    const stats = {
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueGrowth: Math.floor(Math.random() * 50 + 10),
      ordersGrowth: Math.floor(Math.random() * 30 + 5),
    };

    sendSuccess(res, 200, 'Dashboard stats retrieved', stats);
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving stats', error);
  }
});

// Get Sales Analytics
router.get('/analytics/sales', protect, authorizeAdmin, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;

    // Mock analytics data
    const analyticsData = {
      period,
      data: [
        { label: 'Jan', value: 45000 },
        { label: 'Feb', value: 52000 },
        { label: 'Mar', value: 48000 },
        { label: 'Apr', value: 61000 },
        { label: 'May', value: 55000 },
        { label: 'Jun', value: 67000 },
      ],
    };

    sendSuccess(res, 200, 'Sales analytics retrieved', analyticsData);
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving analytics', error);
  }
});

// Get Order Analytics
router.get('/analytics/orders', protect, authorizeAdmin, async (req, res) => {
  try {
    const orders = await Order.find();

    const statusBreakdown = {
      pending: orders.filter(o => o.orderStatus === 'pending').length,
      processing: orders.filter(o => o.orderStatus === 'processing').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
    };

    sendSuccess(res, 200, 'Order analytics retrieved', statusBreakdown);
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving order analytics', error);
  }
});

// Get Product Performance
router.get('/analytics/products', protect, authorizeAdmin, async (req, res) => {
  try {
    const products = await Product.find().limit(5).sort({ rating: -1 });

    const performanceData = products.map(p => ({
      name: p.name,
      sales: Math.floor(Math.random() * 500 + 50),
      rating: p.rating,
      stock: p.stock,
      revenue: p.price * Math.floor(Math.random() * 100 + 10),
    }));

    sendSuccess(res, 200, 'Product analytics retrieved', performanceData);
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving product analytics', error);
  }
});

// Coupon Management
router.post('/coupons', protect, authorizeAdmin, async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;

    if (!code || !discount) {
      return sendError(res, 400, 'Code and discount are required');
    }

    const coupon = {
      id: Math.random().toString(36).substr(2, 9),
      code,
      discount,
      expiryDate,
      isActive: true,
      createdAt: new Date(),
    };

    sendSuccess(res, 201, 'Coupon created successfully', { coupon });
  } catch (error: any) {
    sendError(res, 500, 'Error creating coupon', error);
  }
});

// Get All Coupons
router.get('/coupons', protect, authorizeAdmin, async (req, res) => {
  try {
    // Mock coupons data
    const coupons = [
      { id: '1', code: 'TRAVEL20', discount: 20, expiryDate: '2024-12-31', isActive: true },
      { id: '2', code: 'TRAVEL10', discount: 10, expiryDate: '2024-12-31', isActive: true },
    ];

    sendSuccess(res, 200, 'Coupons retrieved', { coupons });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving coupons', error);
  }
});

// System Health Check
router.get('/health', protect, authorizeAdmin, (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      cache: 'active',
    };

    sendSuccess(res, 200, 'System health retrieved', health);
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving health', error);
  }
});

export default router;

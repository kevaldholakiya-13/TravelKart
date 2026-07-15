import { Router } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { sendSuccess, sendError, generateOrderNumber } from '../utils/helpers';
import { protect, authorizeAdmin } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Create Order
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      subtotal,
      tax,
      shipping,
      discount,
      total,
    } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, 'Cart is empty');
    }

    const orderNumber = generateOrderNumber();

    const order = new Order({
      orderNumber,
      user: req.userId,
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    await order.save();
    await order.populate('items.product');

    sendSuccess(res, 201, 'Order created successfully', { order });
  } catch (error: any) {
    sendError(res, 500, 'Error creating order', error);
  }
});

// Get My Orders
router.get('/my-orders', protect, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Orders retrieved', { orders });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving orders', error);
  }
});

// Get Order by ID
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    // Check if user is owner or admin
    if (order.user.toString() !== req.userId && req.user?.role !== 'admin') {
      return sendError(res, 403, 'Unauthorized');
    }

    sendSuccess(res, 200, 'Order retrieved', { order });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving order', error);
  }
});

// Update Order Status (Admin Only)
router.put('/:id', protect, authorizeAdmin, async (req: AuthRequest, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    sendSuccess(res, 200, 'Order updated successfully', { order });
  } catch (error: any) {
    sendError(res, 500, 'Error updating order', error);
  }
});

// Cancel Order
router.post('/:id/cancel', protect, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.user.toString() !== req.userId) {
      return sendError(res, 403, 'Unauthorized');
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return sendError(res, 400, `Cannot cancel order with status: ${order.orderStatus}`);
    }

    order.orderStatus = 'cancelled';
    await order.save();

    sendSuccess(res, 200, 'Order cancelled successfully', { order });
  } catch (error: any) {
    sendError(res, 500, 'Error cancelling order', error);
  }
});

// Get All Orders (Admin Only)
router.get('/', protect, authorizeAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments();

    sendSuccess(res, 200, 'Orders retrieved', {
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving orders', error);
  }
});

export default router;

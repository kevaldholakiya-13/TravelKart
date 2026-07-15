import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: Math.random().toString(),
        name,
        email,
        phone,
      },
      token: 'mock-token-' + Math.random().toString(),
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password required',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: '1', name: 'Test User', email },
      token: 'mock-token-' + Math.random().toString(),
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User retrieved',
    data: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
  });
});

// Products
app.get('/api/products', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Products retrieved',
    data: {
      products: [
        {
          id: '1',
          name: 'Pro Travel Backpack',
          price: 12999,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
          stock: 45,
          rating: 4.5,
        },
        {
          id: '2',
          name: 'Durable Travel Luggage',
          price: 24999,
          image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300',
          stock: 23,
          rating: 4.8,
        },
        {
          id: '3',
          name: 'Premium Camera Bag',
          price: 8999,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
          stock: 67,
          rating: 4.3,
        },
      ],
    },
  });
});

app.get('/api/products/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Product retrieved',
    data: {
      product: {
        id: req.params.id,
        name: 'Product Name',
        price: 12999,
        description: 'High quality travel product',
        stock: 45,
        rating: 4.5,
      },
    },
  });
});

// Orders
app.post('/api/orders', (req, res) => {
  const { items, shippingAddress, paymentMethod, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty',
    });
  }

  res.status(201).json({
    success: true,
    message: 'Order created',
    data: {
      order: {
        id: Math.random().toString(),
        orderNumber: 'TK' + Date.now(),
        items,
        shippingAddress,
        paymentMethod,
        total,
        status: 'pending',
      },
    },
  });
});

// Delivery
app.post('/api/delivery/check', (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
    return res.status(400).json({
      success: false,
      message: 'Pincode required',
    });
  }

  const deliverable = ['380001', '380002', '380015', '380019', '380006', '380008'].includes(pincode);

  res.status(200).json({
    success: true,
    message: 'Delivery checked',
    data: {
      isDeliverable: deliverable,
      pincode,
      estimatedDays: deliverable ? 3 : 0,
      shippingCharge: 299,
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Server error',
  });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
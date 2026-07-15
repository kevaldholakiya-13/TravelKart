# 🚀 TravelKart - Quick Reference Guide

## ⚡ Essential Commands

### Frontend Setup & Running

```bash
# Navigate to frontend
cd travelkart-frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

### Backend Setup & Running

```bash
# Navigate to backend
cd travelkart-backend

# Install dependencies
npm install

# Start development server
npm run dev
# Server runs at http://localhost:5000

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm run test
```

---

## 📦 Key Dependencies

### Frontend
```
next@14.0.0
react@18.2.0
framer-motion@10.16.0
tailwindcss@3.3.0
zustand@4.4.0
react-hot-toast@2.4.0
axios@1.6.0
```

### Backend
```
express@4.18.2
mongoose@7.0.0
jsonwebtoken@9.1.0
bcryptjs@2.4.3
joi@17.11.0
cors@2.8.5
helmet@7.1.0
```

---

## 🔑 API Quick Reference

### Authentication
```bash
# Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Get Current User
GET /api/auth/me
Header: Authorization: Bearer {token}

# Logout
POST /api/auth/logout
Header: Authorization: Bearer {token}
```

### Products
```bash
# Get All Products
GET /api/products?category=Backpacks&minPrice=1000&maxPrice=10000&rating=4

# Get Single Product
GET /api/products/productId

# Create Product (Admin)
POST /api/products
{
  "name": "Product Name",
  "description": "Description",
  "price": 5000,
  "category": "Backpacks",
  "stock": 50,
  "images": ["url1", "url2"]
}
```

### Orders
```bash
# Create Order
POST /api/orders
{
  "items": [{id, quantity, price}],
  "shippingAddress": {},
  "paymentMethod": "stripe",
  "total": 5000
}

# Get My Orders
GET /api/orders/my-orders
Header: Authorization: Bearer {token}

# Get Order Details
GET /api/orders/orderId
Header: Authorization: Bearer {token}
```

### Delivery
```bash
# Check Delivery
POST /api/delivery/check
{
  "pincode": "380001"
}

# Get Deliverable Cities
GET /api/delivery/cities

# Track Delivery
GET /api/delivery/track/trackingNumber
```

### Payments
```bash
# Process Stripe Payment
POST /api/payments/stripe
{
  "amount": 5000,
  "token": "stripe_token"
}

# Verify Payment
POST /api/payments/verify
{
  "transactionId": "trans_id",
  "amount": 5000
}
```

---

## 🌐 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/travelkart
JWT_SECRET=your_secret_key_min_32_chars
STRIPE_SECRET_KEY=sk_test_xxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
FRONTEND_URL=http://localhost:3000
```

---

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Build frontend only
docker build -t travelkart-frontend ./travelkart-frontend

# Build backend only
docker build -t travelkart-backend ./travelkart-backend

# Run frontend
docker run -p 3000:3000 travelkart-frontend

# Run backend
docker run -p 5000:5000 travelkart-backend
```

---

## 📁 File Structure Quick View

```
travelkart/
├── travelkart-frontend/
│   ├── src/
│   │   ├── app/          # Pages
│   │   ├── components/   # React components
│   │   ├── store/        # State management
│   │   └── styles/       # Global styles
│   └── package.json
│
├── travelkart-backend/
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── README.md
├── DEPLOYMENT_GUIDE.md
└── PROJECT_SUMMARY.md
```

---

## 🎯 Useful Shortcuts

### Frontend Routes
```
Home              /
Products          /products
Product Details   /products/[id]
Cart              /cart
Checkout          /checkout
Login/Register    /login
User Dashboard    /dashboard
Admin Panel       /admin
Wishlist          /wishlist
About             /about
Contact           /contact
```

### Database Test Data

**Test Pincodes (Deliverable):**
- 380001, 380002, 380015, 380019, 380006, 380008

**Test Products:**
- ID: 1 → Pro Travel Backpack (₹12,999)
- ID: 2 → Durable Travel Luggage (₹24,999)
- ID: 3 → Premium Camera Bag (₹8,999)

**Test Coupons:**
- TRAVEL20 → 20% off
- TRAVEL10 → 10% off

---

## 🔐 Security Checklist

- [x] Environment variables not committed
- [x] HTTPS enabled in production
- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] Password hashing implemented
- [x] JWT tokens secure
- [x] Input validation in place
- [x] SQL injection prevented
- [x] XSS protection enabled
- [x] CSRF tokens ready

---

## 📊 Database Quick Commands

### MongoDB Atlas
```bash
# Connect via MongoDB Compass
mongodb+srv://user:password@cluster.mongodb.net/travelkart

# View users collection
db.users.find()

# View products collection
db.products.find()

# View orders collection
db.orders.find()

# Count documents
db.users.countDocuments()
db.products.countDocuments()
```

### Mongoose Operations (Backend)
```javascript
// Find user
const user = await User.findById(userId);

// Find products
const products = await Product.find({category: 'Backpacks'});

// Create order
const order = new Order(orderData);
await order.save();

// Update product
await Product.findByIdAndUpdate(productId, updateData);

// Delete product
await Product.findByIdAndDelete(productId);
```

---

## 🚀 Deployment Quick Links

### Vercel (Frontend)
```bash
npm i -g vercel
vercel login
vercel deploy --prod
```
**Live URL:** https://travelkart-frontend.vercel.app

### Render (Backend)
```
1. Go to render.com
2. Connect GitHub repo
3. Select travelkart-backend
4. Add environment variables
5. Deploy
```
**Live URL:** https://travelkart-backend.onrender.com

### MongoDB Atlas
- **URL:** mongodb.com/cloud/atlas
- **Connection:** mongodb+srv://user:pass@cluster.mongodb.net/travelkart

---

## 🐛 Debugging Tips

### Frontend Debugging
```bash
# Enable debug mode
DEBUG=* npm run dev

# Check Next.js version
npm ls next

# Clear cache
rm -rf .next node_modules
npm install

# Analyze bundle
npm run build --analyze
```

### Backend Debugging
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Check MongoDB connection
mongosh "mongodb+srv://..."

# Test API endpoint
curl -X GET http://localhost:5000/api/health

# View server logs
tail -f combined.log
```

### Network Debugging
```bash
# Test API connectivity
curl http://localhost:5000/api/health

# Check CORS
curl -i -X OPTIONS http://localhost:5000/api/products

# Monitor requests
npm install -g http-server
http-server
```

---

## 📈 Performance Commands

### Frontend Optimization
```bash
# Build analysis
npm run build --verbose

# Check bundle size
npm ls --depth=0

# Performance audit
npm audit

# Lighthouse
npm run lighthouse
```

### Backend Optimization
```bash
# Check dependencies
npm ls

# Audit vulnerabilities
npm audit

# Monitor memory
node --max-old-space-size=4096 dist/server.js

# Load testing
npm install -g artillery
artillery run load-test.yml
```

---

## 🎮 Development Workflow

### 1. Start Development
```bash
# Terminal 1 - Frontend
cd travelkart-frontend && npm run dev

# Terminal 2 - Backend
cd travelkart-backend && npm run dev

# Terminal 3 - MongoDB (if local)
mongod
```

### 2. Make Changes
```bash
# Frontend: Edit src/app/* files
# Backend: Edit src/routes/* or src/models/*

# Changes auto-reload with hot module replacement
```

### 3. Test Changes
```bash
# Test frontend at http://localhost:3000
# Test backend at http://localhost:5000/api/health

# Test API with Postman or curl
curl http://localhost:5000/api/auth/me
```

### 4. Build & Deploy
```bash
# Frontend
npm run build
vercel deploy --prod

# Backend
npm run build
git push origin main
# Auto-deploys on Render/Railway
```

---

## 📞 Quick Help

### Common Issues & Fixes

**"Port already in use"**
```bash
# Find process
lsof -i :3000  # or :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

**"MongoDB connection error"**
```bash
# Check connection string
echo $MONGODB_URI

# Test connection
mongosh "your_connection_string"

# Restart MongoDB
sudo systemctl restart mongod
```

**"CORS error"**
```bash
# Verify API URL in frontend
echo $NEXT_PUBLIC_API_URL

# Check backend CORS config
# Should match FRONTEND_URL in .env
```

**"Build fails"**
```bash
# Clear cache
rm -rf .next node_modules
npm install

# Rebuild
npm run build

# Check logs
npm run build --verbose
```

---

## 💡 Pro Tips

1. **Use Postman** for API testing
2. **Check browser DevTools** for frontend issues
3. **Monitor server logs** for backend errors
4. **Use MongoDB Compass** for database visualization
5. **Keep environment variables** in `.env.local` and `.env`
6. **Test on mobile** for responsive design
7. **Use rate limiter** in production
8. **Enable HTTPS** in production
9. **Monitor error logs** regularly
10. **Backup database** frequently

---

## 🎓 Learning Resources

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Express.js:** https://expressjs.com
- **MongoDB:** https://docs.mongodb.com
- **Framer Motion:** https://www.framer.com/motion

---

## ✅ Checklist for Production

- [ ] All environment variables configured
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Rate limiting enabled
- [ ] Error logging setup
- [ ] Monitoring tools configured
- [ ] Email service connected
- [ ] Payment gateways tested
- [ ] CORS properly configured
- [ ] Security headers enabled
- [ ] Performance optimized
- [ ] Code reviewed
- [ ] Tests passed
- [ ] Deployment tested

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅

---

**Happy Coding! 🚀**

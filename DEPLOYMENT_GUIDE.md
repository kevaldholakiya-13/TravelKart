# 🚀 TravelKart Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Database Setup](#database-setup)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Testing & Optimization](#testing--optimization)
7. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/travelkart.git
cd travelkart
```

### 2. Frontend Setup

```bash
cd travelkart-frontend

# Install dependencies
npm install

# Create environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
EOF

# Run development server
npm run dev

# Server will start at http://localhost:3000
```

### 3. Backend Setup

```bash
cd ../travelkart-backend

# Install dependencies
npm install

# Create environment file
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelkart
MONGODB_NAME=travelkart
JWT_SECRET=your_very_secure_secret_key_change_in_production
JWT_EXPIRY=7d
STRIPE_SECRET_KEY=sk_test_your_key
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DELIVERABLE_PINCODES=380001,380002,380015,380019,380006,380008
EOF

# Compile TypeScript
npm run build

# Run development server
npm run dev

# Server will start at http://localhost:5000
```

---

## Database Setup

### Option 1: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email
   - Create organization and project

2. **Create Cluster**
   - Select Cloud Provider (AWS/Google Cloud/Azure)
   - Choose Region (ap-south-1 for India)
   - Click "Create Cluster"
   - Wait 5-10 minutes for cluster to be created

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Select "Built-in Role: Atlas admin"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Click "Connect" button
   - Select "Connect your application"
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Add to `.env` as `MONGODB_URI`

### Option 2: Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Create database and user
mongo
> use travelkart
> db.createUser({
    user: "travelkart",
    pwd: "password123",
    roles: ["readWrite"]
  })
> exit

# Connection string
mongodb://travelkart:password123@localhost:27017/travelkart
```

---

## Frontend Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Configure project
cd travelkart-frontend
vercel

# 4. Add environment variables in Vercel dashboard
# Settings > Environment Variables

# 5. Redeploy
vercel --prod

# Your site will be live at https://your-project.vercel.app
```

### Or: Deploy to Netlify

```bash
# 1. Build the project
npm run build

# 2. Create netlify.toml
cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# 3. Deploy via Netlify CLI
npm i -g netlify-cli
netlify login
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### Manual Deployment with Docker

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build and run
docker build -t travelkart-frontend .
docker run -p 3000:3000 travelkart-frontend
```

---

## Backend Deployment

### Deploy to Render

```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to render.com
# 3. New > Web Service
# 4. Connect GitHub repository
# 5. Configure:
#    - Name: travelkart-backend
#    - Environment: Node
#    - Build Command: npm run build
#    - Start Command: npm start
#    - Instance Type: Free (or Paid)

# 6. Add Environment Variables
# Environment > Environment Variables
# Add all variables from .env file

# 7. Click Create Web Service
# Your API will be live at https://travelkart-backend.onrender.com
```

### Deploy to Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Link project
cd travelkart-backend
railway link

# 4. Add environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secret
# ... add all other variables

# 5. Deploy
railway up

# View logs
railway logs

# Get your API URL
railway open
```

### Deploy to AWS (EC2)

```bash
# 1. Launch EC2 Instance
# - AMI: Ubuntu 20.04 LTS
# - Instance Type: t2.micro (free tier)
# - Key Pair: Create and download

# 2. Connect via SSH
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone repository
git clone https://github.com/yourusername/travelkart.git
cd travelkart/travelkart-backend

# 5. Install and setup
npm install
cp .env.example .env
# Edit .env with your values

# 6. Run with PM2
sudo npm i -g pm2
pm2 start "npm start" --name "travelkart-api"
pm2 startup
pm2 save

# 7. Setup Nginx reverse proxy
sudo apt install nginx
sudo systemctl start nginx

# Configure at /etc/nginx/sites-available/default
```

### Docker Deployment

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./travelkart-backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/travelkart
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  frontend:
    build: ./travelkart-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api

volumes:
  mongo_data:
EOF

# Deploy
docker-compose up -d

# Check status
docker-compose ps
```

---

## Environment Configuration

### Frontend Variables
```
NEXT_PUBLIC_API_URL              # Backend API URL
NEXT_PUBLIC_STRIPE_PUBLIC_KEY    # Stripe public key
NEXT_PUBLIC_RAZORPAY_KEY_ID      # Razorpay key
NEXT_PUBLIC_APP_URL              # Frontend URL
NEXT_PUBLIC_ENABLE_DARK_MODE     # Enable dark mode
NEXT_PUBLIC_ENABLE_ANALYTICS     # Enable tracking
```

### Backend Variables
```
PORT                             # Server port (default: 5000)
NODE_ENV                         # Environment (development/production)
MONGODB_URI                      # MongoDB connection string
MONGODB_NAME                     # Database name
JWT_SECRET                       # JWT signing secret (min 32 chars)
JWT_EXPIRY                       # Token expiry time
STRIPE_SECRET_KEY                # Stripe secret key
RAZORPAY_KEY_ID                  # Razorpay key ID
RAZORPAY_KEY_SECRET              # Razorpay secret
FRONTEND_URL                     # Frontend URL for CORS
LOG_LEVEL                        # Logging level
RATE_LIMIT_WINDOW_MS             # Rate limit window
RATE_LIMIT_MAX_REQUESTS          # Max requests per window
DELIVERABLE_PINCODES             # Comma-separated pincodes
```

---

## Testing & Optimization

### Frontend Testing
```bash
cd travelkart-frontend

# Unit tests
npm run test

# Build optimization
npm run build
npm run analyze  # Analyze bundle size

# Performance testing
npm run lighthouse
```

### Backend Testing
```bash
cd travelkart-backend

# Unit tests
npm run test

# Integration tests
npm run test:integration

# Type checking
npm run type-check
```

### Performance Optimization

**Frontend:**
- Enable image optimization: Already configured in next.config.js
- Use lazy loading for images
- Implement code splitting
- Optimize fonts (Google Fonts)
- Minify CSS/JS

**Backend:**
- Add database indexes
- Implement caching (Redis)
- Use pagination for large datasets
- Compress API responses
- Monitor with APM tools

---

## Troubleshooting

### Frontend Issues

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

**CORS errors**
- Check `NEXT_PUBLIC_API_URL` is correct
- Backend CORS is configured for frontend URL
- Restart both servers

**Build fails**
```bash
# Clear build cache
rm -rf .next
npm run build
```

### Backend Issues

**MongoDB connection error**
- Verify connection string
- Check network access in MongoDB Atlas
- Ensure MongoDB is running (local)
- Test with MongoDB Compass

**Port 5000 already in use**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

**JWT token expired**
- Check JWT_SECRET is same in .env
- Verify JWT_EXPIRY setting
- Clear browser cookies and re-login

### Deployment Issues

**Vercel build fails**
- Check Node version compatibility
- Verify all environment variables are set
- Clear Vercel build cache
- Check for hardcoded localhost URLs

**Render deployment fails**
- Check logs in Render dashboard
- Verify MongoDB URI is accessible
- Ensure all environment variables are set
- Check build command syntax

---

## 🎯 Performance Metrics to Monitor

- **Frontend:**
  - Lighthouse Score: 90+
  - First Contentful Paint: <2s
  - Time to Interactive: <3.5s
  - Bundle Size: <150KB (gzipped)

- **Backend:**
  - API Response Time: <200ms
  - Database Query Time: <100ms
  - Error Rate: <0.1%
  - Uptime: >99.9%

---

## 📞 Support & Resources

- **Documentation:** https://docs.travelkart.com
- **Issues:** GitHub Issues
- **Email:** support@travelkart.com
- **Chat:** Discord Community

---

## ✅ Deployment Checklist

- [ ] Frontend environment variables set
- [ ] Backend environment variables set
- [ ] Database created and user configured
- [ ] Git repository created and code pushed
- [ ] Frontend deployed successfully
- [ ] Backend deployed successfully
- [ ] CORS configured correctly
- [ ] Payment gateway keys added
- [ ] Email service configured
- [ ] Domain/SSL certificate setup
- [ ] Monitoring and logging enabled
- [ ] Backup strategy configured
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Error handling verified

---

**Happy Deployment! 🚀**

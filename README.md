# GatiyanFood - Food Delivery Platform

GatiyanFood is a full-stack food delivery platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform is designed to provide a seamless experience for all stakeholders—users, vendors, delivery partners, and administrators—by integrating real-time order tracking, secure transactions, and comprehensive management tools.

## Project Structure

```
vibe-food/
├── admin-portal/        # Admin dashboard frontend
├── backend/            # Backend API server
├── restaurant-portal/  # Restaurant management frontend
└── user-portal/        # Customer frontend
```

## Features

### 1. User Module
- Account & Profile Management
  - Email verification with OTP
  - Profile settings
  - Address management
  - Payment methods
- Browsing & Ordering
  - Restaurant browsing
  - Menu viewing
  - Cart management
  - Secure checkout
- Order Tracking & History
  - Real-time tracking
  - Order history
  - Delivery partner details
  - Rating & review system
- Wishlist/Favorites
- Order cancellation & refunds

### 2. Vendor Module
- Registration & Verification
  - Email verification
  - Document uploads
  - Admin approval
- Menu & Order Management
  - Menu management
  - Order lifecycle
  - Delivery partner assignment
- Analytics & Reporting
  - Sales analytics
  - Revenue reports
  - Promotions management
- Store Operations
  - Status management
  - Review responses

### 3. Delivery Module
- Partner Registration
  - Document verification
  - Admin approval
- Order Management
  - Order assignment
  - GPS tracking
  - Status updates
- Payment & Delivery
  - Payment management
  - Delivery confirmation
- Performance Tracking
  - Delivery metrics
  - Dispute resolution

### 4. Admin Module
- Dashboard
  - User management
  - Vendor management
  - Delivery partner management
- Order & Payment
  - Order monitoring
  - Payment reconciliation
- Content Management
  - Promotions
  - Discounts
- System Management
  - Security
  - Logging
  - Monitoring

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Material-UI
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- Razorpay Integration
- Multer for file uploads

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Razorpay account
- SMTP server for email verification

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# File Upload Configuration
MAX_FILE_SIZE=5242880 # 5MB in bytes
UPLOAD_PATH=uploads

# Commission Rates (in percentage)
PLATFORM_COMMISSION=10
RESTAURANT_COMMISSION=90
DELIVERY_PARTNER_COMMISSION=80
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gatiyanfood.git
cd gatiyanfood
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
# User Portal
cd ../user-portal
npm install

# Restaurant Portal
cd ../restaurant-portal
npm install

# Admin Portal
cd ../admin-portal
npm install
```

4. Set up environment variables:
- Copy `.env.example` to `.env` in each directory
- Update the variables with your values

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

User Portal:
```bash
cd user-portal
npm run dev
```

Restaurant Portal:
```bash
cd restaurant-portal
npm run dev
```

Admin Portal:
```bash
cd admin-portal
npm run dev
```

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## Testing

Run tests:
```bash
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
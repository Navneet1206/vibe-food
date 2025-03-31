# GatiyanFood - Food Delivery Platform

A full-stack food delivery platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### User Module
- Email verification using Nodemailer
- Profile management with Cloudinary image upload
- Restaurant browsing and menu viewing
- Cart management and secure checkout
- Real-time order tracking
- Review system for completed orders

### Vendor Module
- Email verification and document upload
- Menu management with Cloudinary integration
- Order management system
- Analytics dashboard

### Delivery Module
- Delivery partner registration
- Order assignment system
- Real-time status updates
- GPS tracking (optional)

### Admin Module
- Centralized dashboard
- User, vendor, and delivery partner management
- Order lifecycle management
- Payment reconciliation
- Content and promotion management

## Tech Stack

- **Frontend**: React.js, Redux Toolkit, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Real-time Updates**: Polling mechanism

## Project Structure

```
gatiyan-food/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/        # Page components
│       ├── features/     # Redux slices and features
│       ├── services/     # API services
│       └── utils/        # Utility functions
├── server/                # Backend Node.js application
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- SMTP server for email verification

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/gatiyan-food.git
cd gatiyan-food
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In server directory
cp .env.example .env
# Edit .env with your configuration

# In client directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers
```bash
# Start backend server
cd server
npm run dev

# Start frontend server
cd client
npm start
```

## API Documentation

API documentation is available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
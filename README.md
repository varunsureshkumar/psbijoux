# Elegant Jewelry Store

A sophisticated online jewelry store with real-time inventory tracking and comprehensive order management.

## Features Implemented

### Product Management
- ✨ Comprehensive product catalog with detailed views
- 🖼️ High-quality product images and descriptions
- 📱 Fully responsive mobile-first design
- 🏷️ Category-based product organization
- 💎 Real-time inventory tracking

### User Experience
- 🔍 Product recommendations ("You May Also Like")
- ⭐ Product reviews and ratings system
- 👤 User authentication (signup/login)
- 🛡️ Protected routes for authenticated users

### Order Management
- 🛒 Order creation and tracking
- 📋 Detailed order history
- 📊 Order status updates
- 🔐 Secure order access (users can only view their own orders)

### Real-time Features
- 📦 Live inventory updates
- 🔄 WebSocket-based stock tracking
- 🚀 Instant stock level notifications

## Technical Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- TanStack Query for data fetching
- Socket.io for real-time updates

### Backend
- Express.js server
- PostgreSQL database
- Drizzle ORM
- Passport.js authentication
- WebSocket for real-time communication

## Setup Instructions

1. Configure environment variables:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses PostgreSQL with the following main entities:
- Users: Authentication and user management
- Products: Jewelry items with inventory tracking
- Orders: Customer order management
- Reviews: Product reviews and ratings

## API Endpoints

### Public Endpoints
- GET `/api/products`: List all products
- GET `/api/products/:id`: Get product details
- GET `/api/products/category/:category`: Get products by category
- GET `/api/products/:id/reviews`: Get product reviews

### Protected Endpoints
- POST `/api/orders`: Create a new order
- GET `/api/orders`: Get user's orders
- GET `/api/orders/:id`: Get order details
- POST `/api/products/:id/reviews`: Add a product review
- GET `/api/user`: Get current user info

## Real-time Features
- WebSocket connection for inventory tracking
- Live stock updates across all connected clients
- Automatic inventory synchronization

## Security Features
- Secure password hashing
- Session-based authentication
- Protected routes for authenticated users
- CORS protection
- Input validation using Zod schemas

## Deployment
The application is deployed on Replit and accessible via a .replit.app domain.
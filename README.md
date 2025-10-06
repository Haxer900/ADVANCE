# ZENTHRA - Women's Fashion E-commerce Platform

A full-stack e-commerce platform built with React, Express, and Razorpay payment integration, featuring customer authentication, order management, and refund processing.

## Features

### Customer Features
- **User Authentication**: Secure signup and login with JWT tokens
- **Product Browsing**: View products with filtering and sorting options
- **Shopping Cart**: Add, update, and remove items from cart
- **Wishlist**: Save favorite products for later
- **Checkout Process**: Multi-step checkout with address validation
- **Razorpay Integration**: Secure payment processing with Razorpay
- **Order Management**: View order history and track shipments
- **Refund Requests**: Request refunds through Razorpay's refund API
- **Policy Pages**: Privacy Policy, Terms & Conditions, and Refund Policy

### Admin Features
- **Admin Dashboard**: Overview of sales, orders, and analytics
- **Product Management**: Create, edit, and delete products
- **Order Management**: View and manage customer orders
- **User Management**: Manage customer accounts and roles
- **Category Management**: Organize products into categories
- **Refund Management**: Process customer refund requests
- **Analytics**: View sales data and performance metrics
- **Email Marketing**: Create and send email campaigns
- **SMS & WhatsApp**: Messaging campaign management
- **Integration Settings**: Configure Stripe, PayPal, and Razorpay

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: In-memory storage (MemStorage) with optional PostgreSQL support
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay, Stripe, PayPal
- **Build Tools**: Vite, TypeScript
- **Additional Libraries**: React Query, Wouter (routing), Zod (validation)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository** (if applicable) or ensure you're in the project directory:
   ```bash
   cd your-project-directory
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   # JWT Secret (for customer authentication)
   JWT_SECRET=your-secure-jwt-secret-key

   # Razorpay Configuration
   RZP_KEY_ID=your_razorpay_key_id
   RZP_KEY_SECRET=your_razorpay_key_secret

   # Optional: Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # Optional: PayPal Configuration
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret

   # Optional: MongoDB Configuration (if using database)
   MONGODB_URI=your_mongodb_connection_string

   # Optional: Cloudinary Configuration (for media management)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## Getting Razorpay API Keys

1. Sign up for a Razorpay account at [https://razorpay.com/](https://razorpay.com/)
2. Navigate to Settings > API Keys
3. Generate API Keys (you'll get both Key ID and Key Secret)
4. For testing, use Test Mode keys
5. For production, switch to Live Mode and generate live keys

**Important**: Never commit your API keys to version control. Always use environment variables.

## Running the Application

1. **Development Mode**:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5000`

2. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## Test Credentials

### Admin Account
- **Email**: `admin@morethanfashion.com` or `yashparmar77077@gmail.com`
- **Password**: `admin123` or `Yash@23072005`
- **Access**: `/admin/login`

### Test Customer Account
- **Email**: `customer@test.com`
- **Password**: `Test@123`
- **Access**: `/login`

## Testing the Complete User Journey

Follow this step-by-step guide to test the entire e-commerce flow:

### 1. Customer Signup & Login
1. Navigate to `/signup`
2. Create a new account with your email and password
3. Or use the test customer account: `customer@test.com` / `Test@123`
4. Verify you're logged in (check for user icon in header)

### 2. Browse Products
1. Visit the home page to see featured products
2. Navigate to `/products` to view all products
3. Use filters and sorting options
4. Click on a product to view details

### 3. Add to Cart
1. On a product page, click "Add to Cart"
2. Navigate to `/cart` to view your cart
3. Update quantities or remove items
4. Verify the total amount is calculated correctly

### 4. Checkout Process
1. Click "Proceed to Checkout" from cart page
2. Fill in shipping address details
3. Select payment method (Razorpay)
4. Review order summary

### 5. Razorpay Payment (Test Mode)
1. Click "Place Order" to initiate Razorpay payment
2. On the Razorpay modal, use test card details:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Name**: Any name
3. Complete the payment
4. You'll be redirected to the order confirmation page

### 6. Order Confirmation
1. Verify order details on confirmation page
2. Note your order ID
3. Check that payment status shows as "completed"

### 7. View Orders
1. Navigate to `/my-orders` to see your order history
2. Verify your recent order appears in the list
3. Click "View Details" to see full order information

### 8. Request Refund
1. From the My Orders page, find a completed order
2. Click "Request Refund"
3. Confirm the refund request
4. The refund will be processed through Razorpay's refund API
5. Refund status: Typically takes 5-7 business days

### 9. Admin Panel (Optional)
1. Log out from customer account
2. Navigate to `/admin/login`
3. Login with admin credentials
4. View dashboard with sales overview
5. Check `/admin/orders` to see all customer orders
6. Process refund requests in `/admin/refunds`

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utility functions and configs
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface
│   ├── auth-storage.ts    # Authentication storage
│   └── index.ts           # Server entry point
├── shared/                # Shared code between frontend and backend
│   └── schema.ts          # Database schema and types
└── package.json           # Project dependencies
```

## Key API Endpoints

### Customer Authentication
- `POST /api/auth/signup` - Create new customer account
- `POST /api/auth/login` - Customer login
- `GET /api/auth/me` - Get current user info

### Orders
- `GET /api/my-orders` - Get customer's orders (requires auth)
- `GET /api/orders/:id` - Get specific order details (requires auth)
- `POST /api/orders` - Create new order

### Razorpay Payment
- `POST /api/razorpay/create-order` - Create Razorpay order
- `POST /api/razorpay/verify-payment` - Verify payment signature
- `POST /api/razorpay/refund` - Request refund (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID

### Cart
- `GET /api/cart/:sessionId` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

## Razorpay Integration Details

### Order Creation Flow
1. Customer proceeds to checkout
2. Backend creates a Razorpay order with `POST /api/razorpay/create-order`
3. Razorpay order ID is returned to frontend
4. Frontend loads Razorpay checkout modal

### Payment Verification Flow
1. Customer completes payment in Razorpay modal
2. Razorpay sends payment details to callback
3. Frontend sends verification request to `POST /api/razorpay/verify-payment`
4. Backend verifies signature using HMAC SHA256
5. Order status is updated to "completed"

### Refund Flow
1. Customer requests refund from My Orders page
2. Request sent to `POST /api/razorpay/refund`
3. Backend calls Razorpay Refund API
4. Refund record created in database
5. Admin can view and manage refunds in admin panel

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Secret key for JWT token generation |
| `RZP_KEY_ID` | Yes | Razorpay API Key ID |
| `RZP_KEY_SECRET` | Yes | Razorpay API Key Secret |
| `STRIPE_SECRET_KEY` | No | Stripe API secret key |
| `PAYPAL_CLIENT_ID` | No | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | No | PayPal client secret |
| `MONGODB_URI` | No | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |

## Troubleshooting

### Razorpay Payment Not Working
- Verify `RZP_KEY_ID` and `RZP_KEY_SECRET` are correctly set in `.env`
- Check that you're using Test Mode keys for testing
- Ensure the frontend receives the Razorpay key ID from backend
- Check browser console for any JavaScript errors

### Orders Not Appearing
- Verify user is logged in (check localStorage for `user-token`)
- Check that order creation completed successfully
- Verify payment status is "completed"

### Refund Request Failing
- Ensure payment was completed before requesting refund
- Verify Razorpay API credentials have refund permissions
- Check that payment ID is correct

### Authentication Issues
- Clear browser localStorage and cookies
- Verify JWT_SECRET is set in environment variables
- Check that token hasn't expired (default: 7 days)

## Security Best Practices

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use strong JWT secrets** - Generate random strings for production
3. **Use HTTPS in production** - Essential for payment processing
4. **Validate user input** - All forms use Zod validation
5. **Sanitize database queries** - Prevent SQL injection
6. **Rate limiting** - Implement for API endpoints
7. **CORS configuration** - Restrict to your domain in production

## Deployment

The application is configured for deployment on Replit with the following settings:
- **Build command**: `npm run build`
- **Run command**: `npm start`
- **Port**: 5000

For other platforms:
1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Run: `npm start`

## Support

For issues and questions:
- **Email**: support@zenthra.com
- **Phone**: +91 (555) 000-0000

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ by the ZENTHRA Team**

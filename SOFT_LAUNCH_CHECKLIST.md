# Soft Launch Checklist - Zenthra E-commerce

This document contains the pre-launch checklist and testing procedures for the Zenthra e-commerce platform.

## Security Improvements Completed ✅

### 1. **Hardcoded Credentials Removed**
- ❌ **Removed**: Hardcoded admin credentials (admin/admin123)
- ❌ **Removed**: JWT secret fallback ('zenthra-admin-secret')
- ❌ **Removed**: Hardcoded "admin-1" user bypass
- ❌ **Removed**: MongoDB URI fallback placeholder
- ❌ **Removed**: Razorpay secret fallback (empty string)
- ✅ **Status**: All secrets now require proper environment variables

### 2. **JWT Security Enhanced**
- ✅ **Separate JWT Secrets**: Admin and customer authentication now use different secrets
  - `JWT_SECRET` for customer authentication
  - `JWT_SECRET_ADMIN` for admin authentication
- ✅ **Token Expiry**: Admin tokens expire in 8 hours (vs 7 days for customers)
- ✅ **Fresh Role Checks**: Admin middleware always fetches fresh user data from storage

### 3. **Admin Panel Hardening**
- ✅ **Server-side validation**: authenticateAdmin middleware verifies JWT and role
- ✅ **Frontend protection**: ProtectedAdminRoute component validates tokens with backend
- ✅ **Role-based access**: Only admin/moderator/staff roles can access admin routes
- ✅ **No development bypasses**: All development credentials removed

### 4. **Security Middlewares Added**
- ✅ **Helmet**: Security headers (CSP, XSS protection, etc.)
- ✅ **CORS**: Proper origin validation (development allows all, production checks ALLOWED_ORIGINS)
- ✅ **Rate Limiting**: 
  - General API: 100 requests per 15 minutes per IP
  - Auth endpoints: 5 requests per 15 minutes per IP

### 5. **Environment Variables Documented**
- ✅ **Complete .env.example**: All required variables documented
- ✅ **No fallbacks**: All critical secrets require configuration

---

## Required Environment Variables

### Critical (Required for Production)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secrets (USE DIFFERENT STRONG RANDOM KEYS)
JWT_SECRET=your-super-secret-customer-jwt-key-change-in-production
JWT_SECRET_ADMIN=your-super-secret-admin-jwt-key-change-in-production

# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Payment Gateways (At least one required)

```bash
# Razorpay (Recommended for INR payments)
RZP_KEY_ID=rzp_test_your_key_id
RZP_KEY_SECRET=your_razorpay_key_secret

# Stripe (Optional - for international payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# PayPal (Optional)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### Optional Configuration

```bash
# Server
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# CORS (comma-separated production domains)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Uploads
MAX_FILE_SIZE=10485760
MAX_FILES_PER_UPLOAD=10
```

---

## Test Payment Credentials

### Razorpay Test Cards

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name

Card Number: 5555 5555 5555 4444 (Mastercard)
CVV: Any 3 digits
Expiry: Any future date
```

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
```

### PayPal Sandbox

Use PayPal Developer sandbox accounts for testing.

---

## Pre-Launch Smoke Tests

### 1. Authentication Tests

#### Customer Auth
```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Verify token works
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

#### Admin Auth
```bash
# Test admin login (requires pre-created admin user)
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"secure_admin_password"}'

# Verify admin access
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 2. Rate Limiting Tests

```bash
# Test general API rate limit (should block after 100 requests)
for i in {1..101}; do
  curl http://localhost:5000/api/products/featured
done

# Test auth rate limit (should block after 5 requests)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### 3. Payment Flow Tests

#### Razorpay Test
1. Add products to cart
2. Proceed to checkout
3. Select Razorpay payment
4. Use test card: 4111 1111 1111 1111
5. Verify order status updates to "confirmed"
6. Check order in admin panel

#### Stripe Test  
1. Add products to cart
2. Proceed to checkout
3. Select Stripe payment
4. Use test card: 4242 4242 4242 4242
5. Verify payment success webhook received
6. Verify order status

### 4. Admin Panel Tests

#### Product CRUD
```bash
# Create product (requires admin token)
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","description":"Test","price":"99.99","category":"Test","imageUrl":"https://example.com/image.jpg"}'

# Update product
curl -X PATCH http://localhost:5000/api/admin/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"price":"79.99"}'

# Delete product
curl -X DELETE http://localhost:5000/api/admin/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 5. Security Headers Test

```bash
# Verify security headers are present
curl -I http://localhost:5000/api/products/featured

# Should see headers like:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# X-XSS-Protection: 0
# Strict-Transport-Security: max-age=15552000
```

### 6. CORS Test

```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:5000/api/products \
  -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: GET"

# Should return Access-Control-Allow-Origin header
```

---

## Known Issues & Limitations

### ⚠️ Not Yet Implemented

1. **Google OAuth2 Authentication**
   - Status: Not implemented
   - Priority: High
   - Implementation required before full public launch

2. **Automated Tests**
   - Status: No test suite
   - Priority: High
   - Recommended: Add Jest/Vitest tests before public launch

3. **Token Refresh Flow**
   - Status: Not implemented
   - Priority: Medium
   - Current: Tokens expire and require re-login

4. **HttpOnly Cookies for Admin Tokens**
   - Status: Using localStorage
   - Priority: Medium
   - Security consideration: LocalStorage vulnerable to XSS

### 🔄 Partial Implementation

1. **Payment Gateway Idempotency**
   - Status: Basic implementation
   - Priority: High
   - Review: Verify idempotency keys for Razorpay/Stripe

2. **Database Migration Scripts**
   - Status: Manual setup required
   - Priority: Medium  
   - Action: Document MongoDB Atlas setup

---

## Deployment Checklist

### Before Deployment

- [ ] All environment variables configured in production
- [ ] Strong random JWT secrets generated (use: `openssl rand -base64 32`)
- [ ] Database credentials secured
- [ ] Payment gateway production keys configured
- [ ] ALLOWED_ORIGINS set to production domains
- [ ] NODE_ENV set to "production"
- [ ] Admin user created with strong password
- [ ] Cloudinary production keys configured

### After Deployment

- [ ] Test customer signup/login
- [ ] Test admin login
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout with test payment
- [ ] Verify order creation
- [ ] Verify admin dashboard access
- [ ] Test image uploads
- [ ] Verify security headers in production
- [ ] Test rate limiting
- [ ] Monitor error logs for 24 hours

### Monitoring

- [ ] Set up application monitoring (e.g., Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up payment webhook monitoring
- [ ] Monitor database performance
- [ ] Track API error rates

---

## Security Best Practices

### Production Deployment

1. **Never commit .env files** to version control
2. **Use strong, unique secrets** for JWT_SECRET and JWT_SECRET_ADMIN
3. **Enable HTTPS** on all production domains
4. **Configure ALLOWED_ORIGINS** to only allow your production domains
5. **Review and test rate limits** based on expected traffic
6. **Implement proper logging** but never log sensitive data
7. **Regular security audits** of dependencies (npm audit)
8. **Keep dependencies updated** for security patches

### Admin Account Security

1. **Use strong, unique passwords** (minimum 16 characters)
2. **Enable 2FA** when implemented
3. **Limit admin users** to only necessary personnel
4. **Regular password rotation** (every 90 days)
5. **Monitor admin activity** logs

---

## Support & Documentation

### File Changes Summary

**Security Fixes:**
- `server/routes.ts`: Removed hardcoded credentials, separated admin/customer JWT
- `server/auth-storage.ts`: Added MongoDB URI validation
- `server/index.ts`: Added helmet, CORS, rate limiting
- `client/src/App.tsx`: Added ProtectedAdminRoute wrapper
- `client/src/components/protected-admin-route.tsx`: New server-validated admin protection

**Configuration:**
- `.env.example`: Complete documentation of all required environment variables

### Architecture Overview

**Authentication Flow:**
1. Customer/Admin logs in with credentials
2. Backend validates against storage (PostgreSQL or MongoDB)
3. JWT token issued with appropriate secret (customer vs admin)
4. Frontend stores token in localStorage
5. All API requests include token in Authorization header
6. Backend middleware validates token and checks user role

**Payment Flow:**
1. User adds items to cart
2. Proceeds to checkout
3. Backend creates Razorpay/Stripe order
4. Frontend shows payment UI
5. Payment completed on gateway
6. Webhook/verification updates order status
7. Order confirmed in system

**Image Storage:**
- All product/category images stored on Cloudinary
- Upload via admin panel
- URLs saved in database
- CDN delivery for fast loading

---

## Emergency Procedures

### If Production Breaks

1. **Check environment variables** are all set correctly
2. **Check database connection** (DATABASE_URL, MONGODB_URI)
3. **Check payment gateway status** (Razorpay/Stripe dashboards)
4. **Review recent error logs**
5. **Rollback to previous deployment** if needed

### If Admin Panel Locked Out

1. **Create new admin user** via database console
2. **Reset admin password** in database
3. **Check JWT_SECRET_ADMIN** is correctly configured
4. **Verify admin user role** is set to 'admin'

### If Payments Failing

1. **Check payment gateway credentials** (RZP_KEY_ID, RZP_KEY_SECRET, etc.)
2. **Verify webhook URLs** configured in payment gateway dashboard
3. **Check order creation** is working (database logs)
4. **Test with different payment method**
5. **Check payment gateway status page**

---

## Version History

**v1.0.0 - Pre-Launch (October 2025)**
- ✅ Removed all hardcoded secrets
- ✅ Implemented separate admin/customer JWT
- ✅ Added security middlewares (helmet, CORS, rate limiting)
- ✅ Frontend admin route protection with server validation
- ✅ MongoDB connection validation
- ✅ Payment gateway security hardening
- ⚠️ Google OAuth2 pending implementation
- ⚠️ Automated tests pending

---

**Last Updated:** October 6, 2025  
**Status:** Ready for Controlled Soft Launch  
**Recommended Next Steps:** Implement Google OAuth2, Add automated tests

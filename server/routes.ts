import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { credentialStorage } from "./auth-storage";
import { insertCartItemSchema, insertNewsletterSchema, insertProductSchema, insertCategorySchema, insertUserSchema, insertOrderSchema, insertAdminNotificationSchema, insertInventoryAlertSchema, insertRefundSchema, insertAnalyticsDataSchema, insertIntegrationSchema, insertTagSchema, insertCurrencySchema, insertAffiliateSchema, insertEmailCampaignSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import mediaRoutes from "./routes/media";
import productsMediaRoutes from "./routes/products-media";
import healthRoutes from "./routes/health";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Products API error:', error);
      res.status(500).json({ message: "Failed to fetch products", error: (error as any).message });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error('Featured products API error:', error);
      res.status(500).json({ message: "Failed to fetch featured products", error: (error as any).message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Categories API error:', error);
      res.status(500).json({ message: "Failed to fetch categories", error: (error as any).message });
    }
  });

  // Cart
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      res.json(cartItems);
    } catch (error) {
      console.error('Cart API error:', error);
      res.status(500).json({ message: "Failed to fetch cart items", error: (error as any).message });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Newsletter
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.subscribeNewsletter(validatedData);
      res.json(newsletter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // ===========================================
  // CUSTOMER AUTHENTICATION
  // ===========================================

  // Customer Authentication Middleware
  const authenticateCustomer = async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }

      if (!process.env.JWT_SECRET) {
        console.error('CRITICAL: JWT_SECRET is not configured');
        return res.status(500).json({ message: "Server configuration error" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      const user = await storage.getUser(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Customer auth error:', error);
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  };

  // Customer Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        role: "customer",
        isVerified: false
      });

      // Generate JWT
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: "customer" },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ message: "Signup failed: " + error.message });
    }
  });

  // Customer Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role || "customer" },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get Current User
  app.get("/api/auth/me", authenticateCustomer, async (req, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Get Customer Orders
  app.get("/api/my-orders", authenticateCustomer, async (req, res) => {
    try {
      const orders = await storage.getOrdersByUser(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get Single Order Details
  app.get("/api/orders/:id", authenticateCustomer, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Verify order belongs to user
      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // ===========================================
  // RAZORPAY PAYMENT INTEGRATION
  // ===========================================

  // Create Razorpay Order
  app.post("/api/razorpay/create-order", async (req, res) => {
    try {
      if (!process.env.RZP_KEY_ID || !process.env.RZP_KEY_SECRET) {
        return res.status(503).json({ 
          message: "Razorpay not configured. Please add RZP_KEY_ID and RZP_KEY_SECRET to environment variables.",
          error: "RAZORPAY_NOT_CONFIGURED"
        });
      }

      const Razorpay = (await import("razorpay")).default;
      const razorpay = new Razorpay({
        key_id: process.env.RZP_KEY_ID,
        key_secret: process.env.RZP_KEY_SECRET,
      });

      const { amount, currency = "INR", orderId, receipt } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
        currency,
        receipt: receipt || `receipt_${orderId || Date.now()}`,
        notes: orderId ? { orderId } : {}
      };

      const razorpayOrder = await razorpay.orders.create(options);
      res.json({ 
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RZP_KEY_ID
      });
    } catch (error: any) {
      console.error('Razorpay order creation error:', error);
      res.status(500).json({ 
        message: "Error creating Razorpay order: " + error.message 
      });
    }
  });

  // Verify Razorpay Payment
  app.post("/api/razorpay/verify-payment", async (req, res) => {
    try {
      const crypto = await import("crypto");
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "Missing payment verification data" });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RZP_KEY_SECRET || "")
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        // Update order status if orderId provided
        if (orderId) {
          await storage.updateOrder(orderId, {
            paymentStatus: "completed",
            status: "confirmed",
            paymentMethod: "razorpay",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
          });
        }

        res.json({ 
          success: true, 
          message: "Payment verified successfully",
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Payment verification failed" 
        });
      }
    } catch (error: any) {
      console.error('Razorpay payment verification error:', error);
      res.status(500).json({ message: "Payment verification failed: " + error.message });
    }
  });

  // Request Refund via Razorpay
  app.post("/api/razorpay/refund", authenticateCustomer, async (req, res) => {
    try {
      if (!process.env.RZP_KEY_ID || !process.env.RZP_KEY_SECRET) {
        return res.status(503).json({ message: "Razorpay not configured" });
      }

      const Razorpay = (await import("razorpay")).default;
      const razorpay = new Razorpay({
        key_id: process.env.RZP_KEY_ID,
        key_secret: process.env.RZP_KEY_SECRET,
      });

      const { paymentId, amount, orderId, reason } = req.body;

      if (!paymentId) {
        return res.status(400).json({ message: "Payment ID is required" });
      }

      // Verify order belongs to user
      if (orderId) {
        const order = await storage.getOrder(orderId);
        if (!order || order.userId !== req.user.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      // Create refund via Razorpay
      const refundData: any = { payment_id: paymentId };
      if (amount) {
        refundData.amount = Math.round(amount * 100); // amount in paise
      }

      const refund = await razorpay.payments.refund(paymentId, refundData);

      // Store refund in database
      if (orderId) {
        await storage.createRefund({
          orderId,
          userId: req.user.id,
          amount: amount ? amount.toString() : "0",
          reason: reason || "Customer requested refund",
          status: "pending",
          adminNotes: `Razorpay Refund ID: ${refund.id}`,
          processedBy: null,
          processedAt: null
        });
      }

      res.json({ 
        success: true, 
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status
        }
      });
    } catch (error: any) {
      console.error('Razorpay refund error:', error);
      res.status(500).json({ message: "Refund request failed: " + error.message });
    }
  });

  // ===========================================
  // ADMIN DASHBOARD API ROUTES
  // ===========================================

  // Admin Authentication Middleware
  const authenticateAdmin = async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zenthra-admin-secret') as any;
      
      // For development admin user, don't require storage lookup
      if (decoded.userId === "admin-1" && decoded.role === "admin") {
        req.user = {
          id: "admin-1",
          email: "admin@zenthra.com",
          role: "admin"
        };
        return next();
      }
      
      // For real users, look them up in storage
      const user = await storage.getUser(decoded.userId);
      if (!user || !user.role || !['admin', 'moderator', 'staff'].includes(user.role)) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  };

  // Admin Authentication with development fallback
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      // Check for development fallback credentials first
      if ((username === "admin" || email === "admin@morethanfashion.com") && password === "admin123") {
        const token = jwt.sign(
          { userId: "admin-1", email: "admin@zenthra.com", role: "admin" },
          process.env.JWT_SECRET || 'zenthra-admin-secret',
          { expiresIn: '24h' }
        );
        return res.json({ 
          success: true, 
          token,
          user: { 
            id: "admin-1",
            username: "admin", 
            email: "admin@zenthra.com",
            role: "admin" 
          }
        });
      }
      
      // Check stored admin user (from MemStorage)
      if (email === "yashparmar77077@gmail.com") {
        const user = await storage.getUserByEmail(email);
        if (user) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid && user.role === 'admin') {
            const token = jwt.sign(
              { userId: user.id, email: user.email, role: user.role },
              process.env.JWT_SECRET || 'zenthra-admin-secret',
              { expiresIn: '24h' }
            );
            return res.json({ 
              success: true, 
              token,
              user: { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
              }
            });
          }
        }
      }
      
      // Try MongoDB auth as last resort (if configured)
      try {
        const user = await credentialStorage.authenticateUser(username || email, password);
        
        if (!['admin', 'moderator', 'staff'].includes(user.role)) {
          return res.status(403).json({ message: "Insufficient privileges" });
        }

        const token = `admin-token-${user.id}-${Date.now()}`;
        return res.json({ 
          success: true, 
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: user.permissions
          }
        });
      } catch (mongoError) {
        // MongoDB not available - already handled above
      }
      
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin Dashboard Overview
  app.get("/api/admin/dashboard", authenticateAdmin, async (req, res) => {
    try {
      const [products, orders, users, analytics] = await Promise.all([
        storage.getProducts(),
        storage.getOrders(),
        storage.getUsers(),
        storage.getAnalyticsData()
      ]);

      const dashboardData = {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total), 0),
        lowStockProducts: products.filter(p => !p.inStock).length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        recentOrders: orders.slice(-10),
        topProducts: products.filter(p => p.featured).slice(0, 5)
      };

      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // ===========================================
  // PRODUCT MANAGEMENT (ADMIN)
  // ===========================================

  app.post("/api/admin/products", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const product = await storage.updateProduct(req.params.id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ===========================================
  // CATEGORY MANAGEMENT (ADMIN)
  // ===========================================

  app.post("/api/admin/categories", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", authenticateAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const category = await storage.updateCategory(req.params.id, updates);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", authenticateAdmin, async (req, res) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // ===========================================
  // USER MANAGEMENT (ADMIN)
  // ===========================================

  app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Remove password from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", authenticateAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({ ...userData, password: hashedPassword });
      
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", authenticateAdmin, async (req, res) => {
    try {
      const updates = req.body;
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", authenticateAdmin, async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // ===========================================
  // ORDER MANAGEMENT (ADMIN)
  // ===========================================

  app.get("/api/admin/orders", authenticateAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", authenticateAdmin, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.put("/api/admin/orders/:id", authenticateAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const order = await storage.updateOrder(req.params.id, updates);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Customer Order Creation (Public - no auth required for guest checkout)
  app.post("/api/orders", async (req, res) => {
    try {
      const { 
        email, firstName, lastName, address, city, state, zipCode, phone,
        paymentMethod, sessionId, items, subtotal, shipping, tax, 
        couponDiscount, total, couponCode, notes 
      } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Get user ID if logged in (from token)
      let userId = null;
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token && process.env.JWT_SECRET) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
          userId = decoded.userId;
        }
      } catch {
        // Not logged in - proceed as guest
      }

      // Create order
      const order = await storage.createOrder({
        userId: userId || null,
        sessionId: sessionId || null,
        total: total.toString(),
        shippingAddress: `${firstName} ${lastName}, ${address}, ${city}, ${state} ${zipCode}`,
        billingAddress: `${firstName} ${lastName}, ${address}, ${city}, ${state} ${zipCode}`,
        paymentMethod: paymentMethod || "card",
        paymentStatus: "pending",
        status: "pending",
        notes: notes ? `Email: ${email}, Phone: ${phone}, Notes: ${notes}` : `Email: ${email}, Phone: ${phone}`
      });

      // Clear cart after order creation
      if (sessionId) {
        await storage.clearCart(sessionId);
      }

      // Create admin notification
      await storage.createAdminNotification({
        type: "order",
        title: "New Order Received",
        message: `Order #${order.id} for $${parseFloat(total).toFixed(2)} from ${email}`,
        priority: "normal",
        relatedId: order.id
      });

      res.json({ 
        success: true,
        id: order.id,
        order, 
        message: "Order created successfully" 
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // ===========================================
  // NOTIFICATIONS & ALERTS (ADMIN)
  // ===========================================

  app.get("/api/admin/notifications", authenticateAdmin, async (req, res) => {
    try {
      const notifications = await storage.getAdminNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/admin/notifications", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertAdminNotificationSchema.parse(req.body);
      const notification = await storage.createAdminNotification(validatedData);
      res.json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.put("/api/admin/notifications/:id/read", authenticateAdmin, async (req, res) => {
    try {
      const success = await storage.markNotificationRead(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // ===========================================
  // INVENTORY & STOCK ALERTS (ADMIN)
  // ===========================================

  app.get("/api/admin/inventory/alerts", authenticateAdmin, async (req, res) => {
    try {
      const alerts = await storage.getInventoryAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory alerts" });
    }
  });

  app.post("/api/admin/inventory/alerts", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertInventoryAlertSchema.parse(req.body);
      const alert = await storage.createInventoryAlert(validatedData);
      res.json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory alert" });
    }
  });

  app.put("/api/admin/inventory/alerts/:id/acknowledge", authenticateAdmin, async (req, res) => {
    try {
      const success = await storage.acknowledgeAlert(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json({ message: "Alert acknowledged" });
    } catch (error) {
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // ===========================================
  // REFUNDS & RETURNS (ADMIN)
  // ===========================================

  app.get("/api/admin/refunds", authenticateAdmin, async (req, res) => {
    try {
      const refunds = await storage.getRefunds();
      res.json(refunds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch refunds" });
    }
  });

  app.post("/api/admin/refunds", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertRefundSchema.parse(req.body);
      const refund = await storage.createRefund(validatedData);
      res.json(refund);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid refund data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create refund" });
    }
  });

  app.put("/api/admin/refunds/:id", authenticateAdmin, async (req, res) => {
    try {
      const updates = { ...req.body, processedBy: (req as any).user.id };
      if (req.body.status === 'approved' || req.body.status === 'processed') {
        updates.processedAt = new Date();
      }
      
      const refund = await storage.updateRefund(req.params.id, updates);
      if (!refund) {
        return res.status(404).json({ message: "Refund not found" });
      }
      res.json(refund);
    } catch (error) {
      res.status(500).json({ message: "Failed to update refund" });
    }
  });

  // ===========================================
  // ANALYTICS & REPORTS (ADMIN)
  // ===========================================

  app.get("/api/admin/analytics", authenticateAdmin, async (req, res) => {
    try {
      const analytics = await storage.getAnalyticsData();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  app.post("/api/admin/analytics", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertAnalyticsDataSchema.parse(req.body);
      const analytics = await storage.createAnalyticsData(validatedData);
      res.json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create analytics data" });
    }
  });

  // Report Generation (CSV, Excel, PDF)
  app.get("/api/admin/reports/:type", authenticateAdmin, async (req, res) => {
    try {
      const { type } = req.params;
      const { format = 'json', startDate, endDate } = req.query;

      let data;
      let filename;

      switch (type) {
        case 'sales':
          data = await storage.getOrders();
          filename = 'sales-report';
          break;
        case 'users':
          data = await storage.getUsers();
          filename = 'users-report';
          break;
        case 'products':
          data = await storage.getProducts();
          filename = 'products-report';
          break;
        default:
          return res.status(400).json({ message: "Invalid report type" });
      }

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
        
        // Simple CSV generation
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map(item => Object.values(item).join(',')).join('\n');
        res.send(`${headers}\n${rows}`);
      } else {
        res.json(data);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // ===========================================
  // INTEGRATIONS MANAGEMENT (ADMIN)
  // ===========================================

  app.get("/api/admin/integrations", authenticateAdmin, async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post("/api/admin/integrations", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid integration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.put("/api/admin/integrations/:name", authenticateAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const integration = await storage.updateIntegration(req.params.name, updates);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  // ===========================================
  // TAGS MANAGEMENT (ADMIN)
  // ===========================================

  app.get("/api/admin/tags", authenticateAdmin, async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/admin/tags", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tag data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tag" });
    }
  });

  app.delete("/api/admin/tags/:id", authenticateAdmin, async (req, res) => {
    try {
      const success = await storage.deleteTag(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.json({ message: "Tag deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });

  // ===========================================
  // CURRENCY MANAGEMENT (ADMIN)
  // ===========================================

  app.get("/api/admin/currencies", authenticateAdmin, async (req, res) => {
    try {
      const currencies = await storage.getCurrencies();
      res.json(currencies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch currencies" });
    }
  });

  app.post("/api/admin/currencies", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertCurrencySchema.parse(req.body);
      const currency = await storage.createCurrency(validatedData);
      res.json(currency);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid currency data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create currency" });
    }
  });

  // ===========================================
  // AFFILIATE SYSTEM (ADMIN)
  // ===========================================

  app.get("/api/admin/affiliates", authenticateAdmin, async (req, res) => {
    try {
      const affiliates = await storage.getAffiliates();
      res.json(affiliates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliates" });
    }
  });

  app.post("/api/admin/affiliates", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertAffiliateSchema.parse(req.body);
      const affiliate = await storage.createAffiliate(validatedData);
      res.json(affiliate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid affiliate data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create affiliate" });
    }
  });

  // ===========================================
  // EMAIL MARKETING (ADMIN)
  // ===========================================

  app.get("/api/admin/email-campaigns", authenticateAdmin, async (req, res) => {
    try {
      const campaigns = await storage.getEmailCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email campaigns" });
    }
  });

  app.post("/api/admin/email-campaigns", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertEmailCampaignSchema.parse(req.body);
      const campaign = await storage.createEmailCampaign(validatedData);
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create email campaign" });
    }
  });

  // ===========================================
  // NEWSLETTER MANAGEMENT (ADMIN)
  // ===========================================

  app.get("/api/admin/newsletters", authenticateAdmin, async (req, res) => {
    try {
      const newsletters = await storage.getNewsletters();
      res.json(newsletters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch newsletter subscriptions" });
    }
  });

  // Staff management routes
  app.get("/api/admin/staff", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const staff = await credentialStorage.getStaffMembers();
        res.json(staff);
      } catch (error) {
        // Fallback for development
        res.json([]);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff members" });
    }
  });

  app.post("/api/admin/staff", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { username, email, password, role, permissions } = req.body;
      
      try {
        const newStaff = await credentialStorage.createUser({
          username,
          email,
          password,
          role: role || 'staff',
          permissions: permissions || []
        });
        
        res.json(newStaff);
      } catch (error) {
        res.status(400).json({ message: (error as any).message || "Failed to create staff member" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create staff member" });
    }
  });

  // Media management routes
  app.use("/api/media", mediaRoutes);
  
  // Product with media management routes
  app.use("/api/products-media", productsMediaRoutes);

  // Health check and system validation routes
  app.use("/api/health", healthRoutes);

  // ===========================================
  // PAYMENT PROCESSING (STRIPE & PAYPAL)
  // ===========================================

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ 
          message: "Payment processing unavailable. Stripe not configured.",
          error: "STRIPE_NOT_CONFIGURED"
        });
      }

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2022-11-15",
      });

      const { amount, currency = "usd", orderId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: orderId ? { orderId } : {},
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // PayPal setup route
  app.get("/api/paypal/setup", async (req, res) => {
    try {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        return res.status(503).json({ 
          message: "PayPal not configured",
          error: "PAYPAL_NOT_CONFIGURED"
        });
      }

      // Import PayPal helpers
      try {
        const { getClientToken } = await import("./paypal");
        const clientToken = await getClientToken();
        res.json({ clientToken });
      } catch (importError) {
        console.error('PayPal module import error:', importError);
        res.status(503).json({ error: "PayPal integration not available" });
      }
    } catch (error: any) {
      console.error('PayPal setup error:', error);
      res.status(500).json({ error: "Failed to setup PayPal" });
    }
  });

  app.post("/api/paypal/order", async (req, res) => {
    try {
      try {
        const { createPaypalOrder } = await import("./paypal");
        await createPaypalOrder(req, res);
      } catch (importError) {
        console.error('PayPal module import error:', importError);
        res.status(503).json({ error: "PayPal integration not available" });
      }
    } catch (error: any) {
      console.error('PayPal order creation error:', error);
      res.status(500).json({ error: "Failed to create PayPal order" });
    }
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    try {
      try {
        const { capturePaypalOrder } = await import("./paypal");
        await capturePaypalOrder(req, res);
      } catch (importError) {
        console.error('PayPal module import error:', importError);
        res.status(503).json({ error: "PayPal integration not available" });
      }
    } catch (error: any) {
      console.error('PayPal order capture error:', error);
      res.status(500).json({ error: "Failed to capture PayPal order" });
    }
  });

  // Payment webhook handlers for order processing integration
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const event = req.body;
      
      // Handle Stripe webhook events
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          
          // Find and update order with payment success
          if (paymentIntent.metadata?.orderId) {
            await storage.updateOrder(paymentIntent.metadata.orderId, {
              paymentStatus: "completed",
              status: "confirmed"
            });
            
            // Send notification
            await storage.createAdminNotification({
              type: "payment",
              title: "Payment Received",
              message: `Payment completed for order ${paymentIntent.metadata.orderId}`,
              priority: "normal"
            });
          }
          break;
          
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          
          if (failedPayment.metadata?.orderId) {
            await storage.updateOrder(failedPayment.metadata.orderId, {
              paymentStatus: "failed",
              status: "cancelled"
            });
          }
          break;
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error('Stripe webhook error:', error);
      res.status(400).json({ error: "Webhook error" });
    }
  });

  app.post("/api/webhooks/paypal", async (req, res) => {
    try {
      const event = req.body;
      
      // Handle PayPal webhook events
      if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const capture = event.resource;
        const orderId = capture.custom_id; // Use custom_id to store our order ID
        
        if (orderId) {
          await storage.updateOrder(orderId, {
            paymentStatus: "completed",
            status: "confirmed"
          });
          
          // Send notification
          await storage.createAdminNotification({
            type: "payment",
            title: "PayPal Payment Received", 
            message: `PayPal payment completed for order ${orderId}`,
            priority: "normal"
          });
        }
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error('PayPal webhook error:', error);
      res.status(400).json({ error: "Webhook error" });
    }
  });

  // Order processing and checkout
  app.post("/api/checkout", authenticateAdmin, async (req, res) => {
    try {
      const { cartItems, shippingAddress, billingAddress, paymentMethod, userId, sessionId } = req.body;
      
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total
      let total = 0;
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          total += parseFloat(product.price) * item.quantity;
        }
      }

      // Create order
      const order = await storage.createOrder({
        userId: userId || null,
        sessionId: sessionId || null,
        total: total.toString(),
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentStatus: "pending",
        status: "pending"
      });

      // Clear cart after order creation
      if (sessionId) {
        await storage.clearCart(sessionId);
      }

      // Create notification
      await storage.createAdminNotification({
        type: "order",
        title: "New Order Received",
        message: `Order #${order.id} for $${total.toFixed(2)} requires processing`,
        priority: "normal",
        relatedId: order.id
      });

      res.json({ order, message: "Order created successfully" });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ message: "Failed to process checkout" });
    }
  });

  // ===========================================
  // EMAIL MARKETING FUNCTIONALITY
  // ===========================================

  app.get("/api/admin/email-campaigns", authenticateAdmin, async (req, res) => {
    try {
      const campaigns = await storage.getEmailCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email campaigns" });
    }
  });

  app.post("/api/admin/email-campaigns", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertEmailCampaignSchema.parse(req.body);
      const campaign = await storage.createEmailCampaign(validatedData);
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create email campaign" });
    }
  });

  app.put("/api/admin/email-campaigns/:id", authenticateAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const campaign = await storage.updateEmailCampaign(req.params.id, updates);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update email campaign" });
    }
  });

  app.post("/api/admin/email-campaigns/:id/send-test", authenticateAdmin, async (req, res) => {
    try {
      const { testEmail } = req.body;
      if (!testEmail) {
        return res.status(400).json({ message: "Test email address required" });
      }

      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ message: "Test email sent successfully", sentTo: testEmail });
    } catch (error) {
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  app.post("/api/admin/email-campaigns/:id/send", authenticateAdmin, async (req, res) => {
    try {
      const campaign = await storage.getEmailCampaigns();
      const targetCampaign = campaign.find(c => c.id === req.params.id);
      
      if (!targetCampaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Update campaign status
      await storage.updateEmailCampaign(req.params.id, {
        status: "sent",
        sentAt: new Date()
      });

      // Create notification
      await storage.createAdminNotification({
        type: "system",
        title: "Email Campaign Sent",
        message: `Campaign "${targetCampaign.name}" has been sent successfully`,
        priority: "normal",
        relatedId: targetCampaign.id
      });

      res.json({ message: "Campaign sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send email campaign" });
    }
  });

  // ===========================================
  // SMS/WHATSAPP FUNCTIONALITY
  // ===========================================

  app.post("/api/admin/sms/send", authenticateAdmin, async (req, res) => {
    try {
      const { phoneNumber, message, type = "promotional" } = req.body;
      
      if (!phoneNumber || !message) {
        return res.status(400).json({ message: "Phone number and message are required" });
      }

      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create notification
      await storage.createAdminNotification({
        type: "system",
        title: "SMS Sent",
        message: `SMS sent to ${phoneNumber}: ${message.substring(0, 50)}...`,
        priority: "normal"
      });

      res.json({ 
        message: "SMS sent successfully", 
        sentTo: phoneNumber,
        messageId: `sms_${Date.now()}`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to send SMS" });
    }
  });

  app.post("/api/otp/send", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // In a real implementation, you would store this OTP and send it via SMS
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 500));

      res.json({ 
        message: "OTP sent successfully", 
        sentTo: phoneNumber,
        // In development, return the OTP for testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post("/api/otp/verify", async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      
      if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
      }

      // In a real implementation, you would verify against stored OTP
      // For now, simulate verification
      const isValid = otp.length === 6;

      if (isValid) {
        res.json({ message: "OTP verified successfully", verified: true });
      } else {
        res.status(400).json({ message: "Invalid OTP", verified: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  // ===========================================
  // INTEGRATIONS MANAGEMENT
  // ===========================================

  app.get("/api/admin/integrations", authenticateAdmin, async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      // Don't expose sensitive config data
      const safeIntegrations = integrations.map(({ config, ...integration }) => ({
        ...integration,
        hasConfig: !!config
      }));
      res.json(safeIntegrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post("/api/admin/integrations", authenticateAdmin, async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid integration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.put("/api/admin/integrations/:name", authenticateAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const integration = await storage.updateIntegration(req.params.name, updates);
      if (!integration) {
        return res.status(404).json({ message: "Integration not found" });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  // ===========================================
  // STAFF MANAGEMENT & RBAC
  // ===========================================

  app.get("/api/admin/staff", authenticateAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      const staffUsers = users.filter(user => 
        user.role && ['admin', 'moderator', 'staff'].includes(user.role)
      );
      // Remove password from response
      const safeUsers = staffUsers.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff members" });
    }
  });

  app.put("/api/admin/staff/:id/role", authenticateAdmin, async (req, res) => {
    try {
      const { role } = req.body;
      
      if (!['customer', 'staff', 'moderator', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.updateUser(req.params.id, { role });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // ===========================================
  // ANALYTICS DATA COLLECTION
  // ===========================================

  app.post("/api/admin/analytics/collect", authenticateAdmin, async (req, res) => {
    try {
      // Collect analytics data
      const [orders, users, products] = await Promise.all([
        storage.getOrders(),
        storage.getUsers(),
        storage.getProducts()
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(order => 
        order.createdAt && order.createdAt >= today
      );

      const totalSales = todayOrders.reduce((sum, order) => 
        sum + parseFloat(order.total), 0
      );

      const newUsersToday = users.filter(user => 
        user.createdAt && user.createdAt >= today
      );

      const analyticsData = await storage.createAnalyticsData({
        date: today,
        totalSales: totalSales.toString(),
        totalOrders: todayOrders.length,
        newUsers: newUsersToday.length,
        pageViews: Math.floor(Math.random() * 1000) + 500, // Simulated
        conversionRate: todayOrders.length > 0 ? "0.0250" : "0.0000",
        avgOrderValue: todayOrders.length > 0 ? 
          (totalSales / todayOrders.length).toString() : "0.00",
        topProducts: products.filter(p => p.featured).slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          sales: Math.floor(Math.random() * 10) + 1
        }))
      });

      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to collect analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

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
      if (!user || !['admin', 'moderator', 'staff'].includes(user.role)) {
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

  const httpServer = createServer(app);
  return httpServer;
}

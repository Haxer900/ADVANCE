import { type Product, type InsertProduct, type Category, type InsertCategory, type CartItem, type InsertCartItem, type Newsletter, type InsertNewsletter, type User, type InsertUser, type Order, type InsertOrder, type AdminNotification, type InsertAdminNotification, type InventoryAlert, type InsertInventoryAlert, type Refund, type InsertRefund, type AnalyticsData, type InsertAnalyticsData, type Integration, type InsertIntegration, type Tag, type InsertTag, type Currency, type InsertCurrency, type Affiliate, type InsertAffiliate, type EmailCampaign, type InsertEmailCampaign } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { products, categories, cartItems, newsletters, users, orders, adminNotifications, inventoryAlerts, refunds, analyticsData, integrations, tags, currencies, affiliates, emailCampaigns } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Newsletter
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletters(): Promise<Newsletter[]>;

  // Users (Admin Management)
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Orders (Admin Management)
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;

  // Admin Notifications
  getAdminNotifications(): Promise<AdminNotification[]>;
  createAdminNotification(notification: InsertAdminNotification): Promise<AdminNotification>;
  markNotificationRead(id: string): Promise<boolean>;

  // Inventory & Alerts
  getInventoryAlerts(): Promise<InventoryAlert[]>;
  createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert>;
  acknowledgeAlert(id: string): Promise<boolean>;

  // Refunds & Returns
  getRefunds(): Promise<Refund[]>;
  getRefund(id: string): Promise<Refund | undefined>;
  createRefund(refund: InsertRefund): Promise<Refund>;
  updateRefund(id: string, refund: Partial<InsertRefund>): Promise<Refund | undefined>;

  // Analytics
  getAnalyticsData(): Promise<AnalyticsData[]>;
  createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData>;

  // Integrations
  getIntegrations(): Promise<Integration[]>;
  getIntegration(name: string): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(name: string, integration: Partial<InsertIntegration>): Promise<Integration | undefined>;

  // Tags
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: string): Promise<boolean>;

  // Currencies
  getCurrencies(): Promise<Currency[]>;
  createCurrency(currency: InsertCurrency): Promise<Currency>;
  updateCurrency(id: string, currency: Partial<InsertCurrency>): Promise<Currency | undefined>;

  // Affiliates
  getAffiliates(): Promise<Affiliate[]>;
  createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate>;
  updateAffiliate(id: string, affiliate: Partial<InsertAffiliate>): Promise<Affiliate | undefined>;

  // Email Campaigns
  getEmailCampaigns(): Promise<EmailCampaign[]>;
  createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign>;
  updateEmailCampaign(id: string, campaign: Partial<InsertEmailCampaign>): Promise<EmailCampaign | undefined>;
  
  // SMS and Communication
  createSMS(sms: any): Promise<void>;
  getSMSHistory(): any[];
  createOTP(otp: any): Promise<void>;
  getOTPByPhone(phoneNumber: string): Promise<any | null>;
  markOTPAsUsed(id: string): Promise<void>;
  
  // Notifications
  createNotification(notification: any): Promise<void>;
  getNotificationsByRecipient(recipient: string): any[];
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private cartItems: Map<string, CartItem>;
  private newsletters: Map<string, Newsletter>;
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private adminNotifications: Map<string, AdminNotification>;
  private inventoryAlerts: Map<string, InventoryAlert>;
  private refunds: Map<string, Refund>;
  private analyticsData: Map<string, AnalyticsData>;
  private integrations: Map<string, Integration>;
  private tags: Map<string, Tag>;
  private currencies: Map<string, Currency>;
  private affiliates: Map<string, Affiliate>;
  private emailCampaigns: Map<string, EmailCampaign>;
  private smsHistory: Map<string, any>;
  private otpRecords: Map<string, any>;
  private notifications: Map<string, any>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.newsletters = new Map();
    this.users = new Map();
    this.orders = new Map();
    this.adminNotifications = new Map();
    this.inventoryAlerts = new Map();
    this.refunds = new Map();
    this.analyticsData = new Map();
    this.integrations = new Map();
    this.tags = new Map();
    this.currencies = new Map();
    this.affiliates = new Map();
    this.emailCampaigns = new Map();
    this.smsHistory = new Map();
    this.otpRecords = new Map();
    this.notifications = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const womensCategory: Category = {
      id: randomUUID(),
      name: "Vestments",
      description: "Elegance Draped",
      imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"
    };
    
    const mensCategory: Category = {
      id: randomUUID(),
      name: "Breeches", 
      description: "Tailored Grace",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    };

    const lifestyleCategory: Category = {
      id: randomUUID(),
      name: "Raiment",
      description: "Complete Poise",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
    };

    this.categories.set(womensCategory.id, womensCategory);
    this.categories.set(mensCategory.id, mensCategory);
    this.categories.set(lifestyleCategory.id, lifestyleCategory);

    // Initialize products
    const products: Product[] = [
      // Featured Products
      {
        id: randomUUID(),
        name: "Designer Handbag",
        description: "Premium leather craftsmanship with elegant design and attention to detail",
        price: "899.00",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        category: "Vestments",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Premium Timepiece",
        description: "Swiss movement precision with sophisticated design elements",
        price: "1299.00",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        category: "Breeches",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Silk Scarf",
        description: "Hand-printed luxury silk with intricate patterns",
        price: "349.00",
        imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26",
        category: "Vestments",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      // Vestments (Women's Fashion)
      {
        id: randomUUID(),
        name: "Cashmere Sweater",
        description: "Ultra-soft cashmere blend with modern silhouette",
        price: "549.00",
        imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Silk Evening Dress",
        description: "Floor-length elegance with delicate embellishments",
        price: "1899.00",
        imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
        category: "Vestments",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Leather Ankle Boots",
        description: "Timeless design with premium Italian leather",
        price: "749.00",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Pearl Earrings",
        description: "Cultured pearls set in 18k gold",
        price: "999.00",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Designer Sunglasses",
        description: "UV protection meets haute couture styling",
        price: "459.00",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Wool Trench Coat",
        description: "Classic silhouette in premium wool blend",
        price: "1299.00",
        imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Luxury Blazer",
        description: "Tailored elegance with premium fabric and perfect fit",
        price: "1599.00",
        imageUrl: "https://images.unsplash.com/photo-1507038732509-8b1a9297ee71",
        category: "Vestments",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Elegant Necklace",
        description: "Sophisticated jewelry piece with premium materials",
        price: "799.00",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Satin Blouse",
        description: "Luxurious satin with elegant draping",
        price: "389.00",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Pleated Midi Skirt",
        description: "Flowing pleats in premium fabric",
        price: "429.00",
        imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa",
        category: "Vestments",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      // Breeches (Men's Fashion)
      {
        id: randomUUID(),
        name: "Leather Shoes",
        description: "Handcrafted Italian leather with exceptional quality",
        price: "699.00",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        category: "Breeches",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Premium Wallet",
        description: "Crafted from finest leather with modern functionality",
        price: "299.00",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        category: "Breeches",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Tailored Suit",
        description: "Bespoke tailoring in premium wool",
        price: "2499.00",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
        category: "Breeches",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Leather Belt",
        description: "Full-grain leather with premium buckle",
        price: "189.00",
        imageUrl: "https://images.unsplash.com/photo-1624222247344-550fb60583c0",
        category: "Breeches",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Silk Tie",
        description: "Pure silk with classic pattern",
        price: "149.00",
        imageUrl: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc",
        category: "Breeches",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      // Raiment (Lifestyle)
      {
        id: randomUUID(),
        name: "Family Picnic Set",
        description: "Premium outdoor dining experience for the whole family",
        price: "449.00",
        imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18",
        category: "Raiment",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Yoga Mat Set",
        description: "Premium eco-friendly materials with carrying bag",
        price: "129.00",
        imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
        category: "Raiment",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Travel Luggage Set",
        description: "Durable and stylish for the modern traveler",
        price: "899.00",
        imageUrl: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87",
        category: "Raiment",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Coffee Table Book Collection",
        description: "Curated selection of art and fashion books",
        price: "349.00",
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        category: "Raiment",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Scented Candle Set",
        description: "Luxury fragrances for elegant ambiance",
        price: "189.00",
        imageUrl: "https://images.unsplash.com/photo-1602874801006-de7760f4eaa7",
        category: "Raiment",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      }
    ];

    products.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize default admin user
    const adminUser: User = {
      id: randomUUID(),
      email: "yashparmar77077@gmail.com",
      password: "$2b$10$OgXOn/TS.HBSlw83wmyov.vhvuSJG6HZxKjRZvbtMOfVcUfQLrblO", // Yash@23072005
      firstName: "Yash",
      lastName: "Parmar",
      phone: null,
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize test customer user
    const testCustomer: User = {
      id: randomUUID(),
      email: "customer@test.com",
      password: "$2a$10$rZ7l5Y.qFvZpZz8KYhY5Ke3Jl5X6K5Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8u", // Test@123
      firstName: "Test",
      lastName: "Customer",
      phone: "+91 (555) 123-4567",
      role: "customer",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(testCustomer.id, testCustomer);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      inStock: insertProduct.inStock ?? true,
      featured: insertProduct.featured ?? false,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (existingProduct) {
      const updatedProduct = { ...existingProduct, ...product };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description ?? null,
      imageUrl: insertCategory.imageUrl ?? null
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (existingCategory) {
      const updatedCategory = { ...existingCategory, ...category };
      this.categories.set(id, updatedCategory);
      return updatedCategory;
    }
    return undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.productId === insertItem.productId && item.sessionId === insertItem.sessionId
    );

    if (existingItem) {
      existingItem.quantity += insertItem.quantity ?? 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      quantity: insertItem.quantity ?? 1
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = await this.getCartItems(sessionId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      subscribedAt: new Date(),
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values());
  }

  // User management for admin functionality
  async getUsers(): Promise<User[]> { 
    return Array.from(this.users.values()); 
  }
  async getUser(id: string): Promise<User | undefined> { 
    return this.users.get(id); 
  }
  async getUserByEmail(email: string): Promise<User | undefined> { 
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  async createUser(insertUser: InsertUser): Promise<User> { 
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      phone: insertUser.phone ?? null,
      role: insertUser.role ?? "customer",
      isVerified: insertUser.isVerified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id: string, userUpdate: Partial<InsertUser>): Promise<User | undefined> { 
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...userUpdate, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }
  async deleteUser(id: string): Promise<boolean> { 
    return this.users.delete(id);
  }
  
  async getOrders(): Promise<Order[]> { 
    return Array.from(this.orders.values()); 
  }
  async getOrder(id: string): Promise<Order | undefined> { 
    return this.orders.get(id); 
  }
  async getOrdersByUser(userId: string): Promise<Order[]> { 
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }
  async createOrder(insertOrder: InsertOrder): Promise<Order> { 
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      userId: insertOrder.userId ?? null,
      sessionId: insertOrder.sessionId ?? null,
      status: insertOrder.status ?? "pending",
      shippingAddress: insertOrder.shippingAddress ?? null,
      billingAddress: insertOrder.billingAddress ?? null,
      paymentMethod: insertOrder.paymentMethod ?? null,
      paymentStatus: insertOrder.paymentStatus ?? "pending",
      trackingNumber: insertOrder.trackingNumber ?? null,
      notes: insertOrder.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }
  async updateOrder(id: string, orderUpdate: Partial<InsertOrder>): Promise<Order | undefined> { 
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, ...orderUpdate, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }
  async deleteOrder(id: string): Promise<boolean> { 
    return this.orders.delete(id);
  }
  
  async getAdminNotifications(): Promise<AdminNotification[]> { 
    return Array.from(this.adminNotifications.values()); 
  }
  async createAdminNotification(insertNotification: InsertAdminNotification): Promise<AdminNotification> { 
    const id = randomUUID();
    const notification: AdminNotification = {
      ...insertNotification,
      id,
      isRead: insertNotification.isRead ?? false,
      priority: insertNotification.priority ?? "normal",
      relatedId: insertNotification.relatedId ?? null,
      createdAt: new Date(),
    };
    this.adminNotifications.set(id, notification);
    return notification;
  }
  async markNotificationRead(id: string): Promise<boolean> { 
    const notification = this.adminNotifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.adminNotifications.set(id, notification);
      return true;
    }
    return false;
  }
  
  async getInventoryAlerts(): Promise<InventoryAlert[]> { 
    return Array.from(this.inventoryAlerts.values()); 
  }
  async createInventoryAlert(insertAlert: InsertInventoryAlert): Promise<InventoryAlert> { 
    const id = randomUUID();
    const alert: InventoryAlert = {
      ...insertAlert,
      id,
      acknowledged: insertAlert.acknowledged ?? false,
      createdAt: new Date(),
    };
    this.inventoryAlerts.set(id, alert);
    return alert;
  }
  async acknowledgeAlert(id: string): Promise<boolean> { 
    const alert = this.inventoryAlerts.get(id);
    if (alert) {
      alert.acknowledged = true;
      this.inventoryAlerts.set(id, alert);
      return true;
    }
    return false;
  }
  
  async getRefunds(): Promise<Refund[]> { 
    return Array.from(this.refunds.values()); 
  }
  async getRefund(id: string): Promise<Refund | undefined> { 
    return this.refunds.get(id); 
  }
  async createRefund(insertRefund: InsertRefund): Promise<Refund> { 
    const id = randomUUID();
    const refund: Refund = {
      ...insertRefund,
      id,
      userId: insertRefund.userId ?? null,
      status: insertRefund.status ?? "pending",
      adminNotes: insertRefund.adminNotes ?? null,
      processedBy: insertRefund.processedBy ?? null,
      processedAt: insertRefund.processedAt ?? null,
      createdAt: new Date(),
    };
    this.refunds.set(id, refund);
    return refund;
  }
  async updateRefund(id: string, refundUpdate: Partial<InsertRefund>): Promise<Refund | undefined> { 
    const refund = this.refunds.get(id);
    if (refund) {
      const updatedRefund = { ...refund, ...refundUpdate };
      this.refunds.set(id, updatedRefund);
      return updatedRefund;
    }
    return undefined;
  }
  
  async getAnalyticsData(): Promise<AnalyticsData[]> { 
    return Array.from(this.analyticsData.values()); 
  }
  async createAnalyticsData(insertData: InsertAnalyticsData): Promise<AnalyticsData> { 
    const id = randomUUID();
    const data: AnalyticsData = {
      ...insertData,
      id,
      totalSales: insertData.totalSales ?? "0",
      totalOrders: insertData.totalOrders ?? 0,
      newUsers: insertData.newUsers ?? 0,
      pageViews: insertData.pageViews ?? 0,
      conversionRate: insertData.conversionRate ?? "0",
      avgOrderValue: insertData.avgOrderValue ?? "0",
      topProducts: insertData.topProducts ?? null,
      metadata: insertData.metadata ?? null,
    };
    this.analyticsData.set(id, data);
    return data;
  }
  
  async getIntegrations(): Promise<Integration[]> { 
    return Array.from(this.integrations.values()); 
  }
  async getIntegration(name: string): Promise<Integration | undefined> { 
    return Array.from(this.integrations.values()).find(integration => integration.name === name);
  }
  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> { 
    const id = randomUUID();
    const integration: Integration = {
      ...insertIntegration,
      id,
      isActive: insertIntegration.isActive ?? false,
      config: insertIntegration.config ?? null,
      lastSync: insertIntegration.lastSync ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.integrations.set(id, integration);
    return integration;
  }
  async updateIntegration(name: string, integrationUpdate: Partial<InsertIntegration>): Promise<Integration | undefined> { 
    const integration = Array.from(this.integrations.values()).find(i => i.name === name);
    if (integration) {
      const updatedIntegration = { ...integration, ...integrationUpdate, updatedAt: new Date() };
      this.integrations.set(integration.id, updatedIntegration);
      return updatedIntegration;
    }
    return undefined;
  }
  
  async getTags(): Promise<Tag[]> { 
    return Array.from(this.tags.values()); 
  }
  async createTag(insertTag: InsertTag): Promise<Tag> { 
    const id = randomUUID();
    const tag: Tag = {
      ...insertTag,
      id,
      color: insertTag.color ?? "#6B7280",
      description: insertTag.description ?? null,
      createdAt: new Date(),
    };
    this.tags.set(id, tag);
    return tag;
  }
  async deleteTag(id: string): Promise<boolean> { 
    return this.tags.delete(id);
  }
  
  async getCurrencies(): Promise<Currency[]> { 
    return Array.from(this.currencies.values()); 
  }
  async createCurrency(insertCurrency: InsertCurrency): Promise<Currency> { 
    const id = randomUUID();
    const currency: Currency = {
      ...insertCurrency,
      id,
      exchangeRate: insertCurrency.exchangeRate ?? "1",
      isActive: insertCurrency.isActive ?? true,
      lastUpdated: new Date(),
    };
    this.currencies.set(id, currency);
    return currency;
  }
  async updateCurrency(id: string, currencyUpdate: Partial<InsertCurrency>): Promise<Currency | undefined> { 
    const currency = this.currencies.get(id);
    if (currency) {
      const updatedCurrency = { ...currency, ...currencyUpdate, lastUpdated: new Date() };
      this.currencies.set(id, updatedCurrency);
      return updatedCurrency;
    }
    return undefined;
  }
  
  async getAffiliates(): Promise<Affiliate[]> { 
    return Array.from(this.affiliates.values()); 
  }
  async createAffiliate(insertAffiliate: InsertAffiliate): Promise<Affiliate> { 
    const id = randomUUID();
    const affiliate: Affiliate = {
      ...insertAffiliate,
      id,
      commissionRate: insertAffiliate.commissionRate ?? "0.05",
      totalEarnings: insertAffiliate.totalEarnings ?? "0",
      totalReferrals: insertAffiliate.totalReferrals ?? 0,
      isActive: insertAffiliate.isActive ?? true,
      createdAt: new Date(),
    };
    this.affiliates.set(id, affiliate);
    return affiliate;
  }
  async updateAffiliate(id: string, affiliateUpdate: Partial<InsertAffiliate>): Promise<Affiliate | undefined> { 
    const affiliate = this.affiliates.get(id);
    if (affiliate) {
      const updatedAffiliate = { ...affiliate, ...affiliateUpdate };
      this.affiliates.set(id, updatedAffiliate);
      return updatedAffiliate;
    }
    return undefined;
  }
  
  async getEmailCampaigns(): Promise<EmailCampaign[]> { 
    return Array.from(this.emailCampaigns.values()); 
  }
  async createEmailCampaign(insertCampaign: InsertEmailCampaign): Promise<EmailCampaign> { 
    const id = randomUUID();
    const campaign: EmailCampaign = {
      ...insertCampaign,
      id,
      recipients: insertCampaign.recipients ?? null,
      status: insertCampaign.status ?? "draft",
      sentAt: insertCampaign.sentAt ?? null,
      openRate: insertCampaign.openRate ?? null,
      clickRate: insertCampaign.clickRate ?? null,
      createdAt: new Date(),
    };
    this.emailCampaigns.set(id, campaign);
    return campaign;
  }
  async updateEmailCampaign(id: string, campaignUpdate: Partial<InsertEmailCampaign>): Promise<EmailCampaign | undefined> { 
    const campaign = this.emailCampaigns.get(id);
    if (campaign) {
      const updatedCampaign = { ...campaign, ...campaignUpdate };
      this.emailCampaigns.set(id, updatedCampaign);
      return updatedCampaign;
    }
    return undefined;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    if (!db) {
      throw new Error("Database connection not available");
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0] || undefined;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not connected");
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0] || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not connected");
    const result = await db.delete(categories).where(eq(categories.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(cartItems).values(item).returning();
    return result[0];
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    if (!db) throw new Error("Database not connected");
    const result = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return result[0] || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    if (!db) throw new Error("Database not connected");
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    if (!db) throw new Error("Database not connected");
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return (result.rowCount || 0) > 0;
  }

  // Newsletter
  async subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(newsletters).values(newsletter).returning();
    return result[0];
  }

  async getNewsletters(): Promise<Newsletter[]> {
    if (!db) throw new Error("Database not connected");
    return await db.select().from(newsletters);
  }

  // Stub implementations for complex admin features (database would be required)
  async getUsers(): Promise<User[]> { 
    if (!db) throw new Error("Database not connected");
    return await db.select().from(users); 
  }
  async getUser(id: string): Promise<User | undefined> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || undefined;
  }
  async getUserByEmail(email: string): Promise<User | undefined> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || undefined;
  }
  async createUser(user: InsertUser): Promise<User> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0] || undefined;
  }
  async deleteUser(id: string): Promise<boolean> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }
  
  async getOrders(): Promise<Order[]> { 
    if (!db) throw new Error("Database not connected");
    return await db.select().from(orders); 
  }
  async getOrder(id: string): Promise<Order | undefined> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0] || undefined;
  }
  async getOrdersByUser(userId: string): Promise<Order[]> { 
    if (!db) throw new Error("Database not connected");
    return await db.select().from(orders).where(eq(orders.userId, userId)); 
  }
  async createOrder(order: InsertOrder): Promise<Order> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }
  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return result[0] || undefined;
  }
  async deleteOrder(id: string): Promise<boolean> { 
    if (!db) throw new Error("Database not connected");
    const result = await db.delete(orders).where(eq(orders.id, id));
    return (result.rowCount || 0) > 0;
  }
  
  // All other admin features would require implementation
  async getAdminNotifications(): Promise<AdminNotification[]> { return []; }
  async createAdminNotification(notification: InsertAdminNotification): Promise<AdminNotification> { throw new Error("Feature not implemented"); }
  async markNotificationRead(id: string): Promise<boolean> { return false; }
  
  async getInventoryAlerts(): Promise<InventoryAlert[]> { return []; }
  async createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert> { throw new Error("Feature not implemented"); }
  async acknowledgeAlert(id: string): Promise<boolean> { return false; }
  
  async getRefunds(): Promise<Refund[]> { return []; }
  async getRefund(id: string): Promise<Refund | undefined> { return undefined; }
  async createRefund(refund: InsertRefund): Promise<Refund> { throw new Error("Feature not implemented"); }
  async updateRefund(id: string, refund: Partial<InsertRefund>): Promise<Refund | undefined> { return undefined; }
  
  async getAnalyticsData(): Promise<AnalyticsData[]> { return []; }
  async createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData> { throw new Error("Feature not implemented"); }
  
  async getIntegrations(): Promise<Integration[]> { return []; }
  async getIntegration(name: string): Promise<Integration | undefined> { return undefined; }
  async createIntegration(integration: InsertIntegration): Promise<Integration> { throw new Error("Feature not implemented"); }
  async updateIntegration(name: string, integration: Partial<InsertIntegration>): Promise<Integration | undefined> { return undefined; }
  
  async getTags(): Promise<Tag[]> { return []; }
  async createTag(tag: InsertTag): Promise<Tag> { throw new Error("Feature not implemented"); }
  async deleteTag(id: string): Promise<boolean> { return false; }
  
  async getCurrencies(): Promise<Currency[]> { return []; }
  async createCurrency(currency: InsertCurrency): Promise<Currency> { throw new Error("Feature not implemented"); }
  async updateCurrency(id: string, currency: Partial<InsertCurrency>): Promise<Currency | undefined> { return undefined; }
  
  async getAffiliates(): Promise<Affiliate[]> { return []; }
  async createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate> { throw new Error("Feature not implemented"); }
  async updateAffiliate(id: string, affiliate: Partial<InsertAffiliate>): Promise<Affiliate | undefined> { return undefined; }
  
  async getEmailCampaigns(): Promise<EmailCampaign[]> { return []; }
  async createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign> { throw new Error("Feature not implemented"); }
  async updateEmailCampaign(id: string, campaign: Partial<InsertEmailCampaign>): Promise<EmailCampaign | undefined> { return undefined; }
}

// Simple implementation for immediate development needs
class SimpleStorage implements IStorage {
  private products = [
    {
      id: "1",
      name: "Designer Handbag",
      description: "Premium leather craftsmanship with elegant design",
      price: "899.00",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      category: "Vestments",
      inStock: true,
      featured: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Premium Timepiece",
      description: "Swiss movement precision with sophisticated design",
      price: "1299.00",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category: "Breeches",
      inStock: true,
      featured: true,
      createdAt: new Date(),
    }
  ];
  
  private categories = [
    { id: "1", name: "Vestments", description: "Elegance Draped", imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1" },
    { id: "2", name: "Breeches", description: "Tailored Grace", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
    { id: "3", name: "Raiment", description: "Complete Poise", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136" }
  ];
  
  private cartItems: any[] = [];
  private users: any[] = [];
  private orders: any[] = [];
  private newsletters: any[] = [];

  async getProducts() { return this.products; }
  async getProduct(id: string) { return this.products.find(p => p.id === id); }
  async getFeaturedProducts() { return this.products.filter(p => p.featured); }
  async getProductsByCategory(category: string) { return this.products.filter(p => p.category === category); }
  async createProduct(product: any) { const newProduct = { ...product, id: Date.now().toString() }; this.products.push(newProduct); return newProduct; }
  async updateProduct(id: string, updates: any) { const index = this.products.findIndex(p => p.id === id); if (index >= 0) { this.products[index] = { ...this.products[index], ...updates }; return this.products[index]; } return undefined; }
  async deleteProduct(id: string) { const index = this.products.findIndex(p => p.id === id); if (index >= 0) { this.products.splice(index, 1); return true; } return false; }

  async getCategories() { return this.categories; }
  async getCategory(id: string) { return this.categories.find(c => c.id === id); }
  async createCategory(category: any) { const newCategory = { ...category, id: Date.now().toString() }; this.categories.push(newCategory); return newCategory; }
  async updateCategory(id: string, updates: any) { const index = this.categories.findIndex(c => c.id === id); if (index >= 0) { this.categories[index] = { ...this.categories[index], ...updates }; return this.categories[index]; } return undefined; }
  async deleteCategory(id: string) { const index = this.categories.findIndex(c => c.id === id); if (index >= 0) { this.categories.splice(index, 1); return true; } return false; }

  async getCartItems(sessionId: string) { return this.cartItems.filter(item => item.sessionId === sessionId); }
  async addToCart(item: any) { const newItem = { ...item, id: Date.now().toString() }; this.cartItems.push(newItem); return newItem; }
  async updateCartItem(id: string, quantity: number) { const item = this.cartItems.find(i => i.id === id); if (item) { item.quantity = quantity; return item; } return undefined; }
  async removeFromCart(id: string) { const index = this.cartItems.findIndex(i => i.id === id); if (index >= 0) { this.cartItems.splice(index, 1); return true; } return false; }
  async clearCart(sessionId: string) { this.cartItems = this.cartItems.filter(item => item.sessionId !== sessionId); return true; }

  async subscribeNewsletter(newsletter: any) { const newNewsletter = { ...newsletter, id: Date.now().toString(), subscribedAt: new Date() }; this.newsletters.push(newNewsletter); return newNewsletter; }
  async getNewsletters() { return this.newsletters; }

  async getUsers() { return this.users; }
  async getUser(id: string) { return this.users.find(u => u.id === id); }
  async getUserByEmail(email: string) { return this.users.find(u => u.email === email); }
  async createUser(user: any) { const newUser = { ...user, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() }; this.users.push(newUser); return newUser; }
  async updateUser(id: string, updates: any) { const index = this.users.findIndex(u => u.id === id); if (index >= 0) { this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date() }; return this.users[index]; } return undefined; }
  async deleteUser(id: string) { const index = this.users.findIndex(u => u.id === id); if (index >= 0) { this.users.splice(index, 1); return true; } return false; }

  async getOrders() { return this.orders; }
  async getOrder(id: string) { return this.orders.find(o => o.id === id); }
  async getOrdersByUser(userId: string) { return this.orders.filter(o => o.userId === userId); }
  async createOrder(order: any) { const newOrder = { ...order, id: Date.now().toString(), createdAt: new Date() }; this.orders.push(newOrder); return newOrder; }
  async updateOrder(id: string, updates: any) { const index = this.orders.findIndex(o => o.id === id); if (index >= 0) { this.orders[index] = { ...this.orders[index], ...updates }; return this.orders[index]; } return undefined; }
  async deleteOrder(id: string) { const index = this.orders.findIndex(o => o.id === id); if (index >= 0) { this.orders.splice(index, 1); return true; } return false; }

  // Stubs for other methods
  async getAdminNotifications() { return []; }
  async createAdminNotification(notification: any) { return { id: Date.now().toString(), ...notification }; }
  async markNotificationRead(id: string) { return true; }
  async getInventoryAlerts() { return []; }
  async createInventoryAlert(alert: any) { return { id: Date.now().toString(), ...alert }; }
  async acknowledgeAlert(id: string) { return true; }
  async getRefunds() { return []; }
  async getRefund(id: string) { return undefined; }
  async createRefund(refund: any) { return { id: Date.now().toString(), ...refund }; }
  async updateRefund(id: string, updates: any) { return undefined; }
  async getAnalyticsData() { return []; }
  async createAnalyticsData(data: any) { return { id: Date.now().toString(), ...data }; }
  async getIntegrations() { return []; }
  async getIntegration(name: string) { return undefined; }
  async createIntegration(integration: any) { return { id: Date.now().toString(), ...integration }; }
  async updateIntegration(name: string, updates: any) { return undefined; }
  async getTags() { return []; }
  async createTag(tag: any) { return { id: Date.now().toString(), ...tag }; }
  async deleteTag(id: string) { return true; }
  async getCurrencies() { return []; }
  async createCurrency(currency: any) { return { id: Date.now().toString(), ...currency }; }
  async updateCurrency(id: string, updates: any) { return undefined; }
  async getAffiliates() { return []; }
  async createAffiliate(affiliate: any) { return { id: Date.now().toString(), ...affiliate }; }
  async updateAffiliate(id: string, updates: any) { return undefined; }
  async getEmailCampaigns() { return []; }
  async createEmailCampaign(campaign: any) { return { id: Date.now().toString(), ...campaign }; }
  async updateEmailCampaign(id: string, updates: any) { return undefined; }
  
  // SMS and Communication methods
  private smsHistory: any[] = [];
  private otpRecords: any[] = [];
  private notifications: any[] = [];
  
  async createSMS(sms: any) { 
    const newSMS = { ...sms, id: Date.now().toString(), createdAt: new Date() }; 
    this.smsHistory.push(newSMS); 
  }
  getSMSHistory() { return this.smsHistory; }
  
  async createOTP(otp: any) { 
    const newOTP = { ...otp, id: Date.now().toString(), createdAt: new Date() }; 
    this.otpRecords.push(newOTP); 
  }
  async getOTPByPhone(phoneNumber: string) { 
    return this.otpRecords.find(otp => otp.phoneNumber === phoneNumber && !otp.used) || null; 
  }
  async markOTPAsUsed(id: string) { 
    const otp = this.otpRecords.find(o => o.id === id); 
    if (otp) otp.used = true; 
  }
  
  async createNotification(notification: any) { 
    const newNotification = { ...notification, id: Date.now().toString(), createdAt: new Date() }; 
    this.notifications.push(newNotification); 
  }
  getNotificationsByRecipient(recipient: string) { 
    return this.notifications.filter(n => n.recipient === recipient); 
  }
}

// Create storage instance
export const storage: IStorage = new SimpleStorage();
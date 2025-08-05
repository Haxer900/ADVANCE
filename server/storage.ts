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
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private cartItems: Map<string, CartItem>;
  private newsletters: Map<string, Newsletter>;
  private users: Map<string, User>;

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.newsletters = new Map();
    this.users = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const womensCategory: Category = {
      id: randomUUID(),
      name: "Women's Collection",
      description: "Sophisticated elegance",
      imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"
    };
    
    const mensCategory: Category = {
      id: randomUUID(),
      name: "Men's Collection", 
      description: "Refined sophistication",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    };

    const lifestyleCategory: Category = {
      id: randomUUID(),
      name: "Family & Lifestyle",
      description: "Creating memories together",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136"
    };

    this.categories.set(womensCategory.id, womensCategory);
    this.categories.set(mensCategory.id, mensCategory);
    this.categories.set(lifestyleCategory.id, lifestyleCategory);

    // Initialize products
    const products: Product[] = [
      {
        id: randomUUID(),
        name: "Designer Handbag",
        description: "Premium leather craftsmanship with elegant design and attention to detail",
        price: "899.00",
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
        category: "Women's Collection",
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
        category: "Men's Collection",
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
        category: "Women's Collection",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Leather Shoes",
        description: "Handcrafted Italian leather with exceptional quality",
        price: "699.00",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        category: "Men's Collection",
        inStock: true,
        featured: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Luxury Blazer",
        description: "Tailored elegance with premium fabric and perfect fit",
        price: "1599.00",
        imageUrl: "https://images.unsplash.com/photo-1507038732509-8b1a9297ee71",
        category: "Women's Collection",
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
        category: "Men's Collection",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Elegant Necklace",
        description: "Sophisticated jewelry piece with premium materials",
        price: "799.00",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
        category: "Women's Collection",
        inStock: true,
        featured: false,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Family Picnic Set",
        description: "Premium outdoor dining experience for the whole family",
        price: "449.00",
        imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18",
        category: "Family & Lifestyle",
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
      email: "admin@zenthra.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      firstName: "Admin",
      lastName: "User",
      phone: null,
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
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
  
  async getOrders(): Promise<Order[]> { return []; }
  async getOrder(id: string): Promise<Order | undefined> { return undefined; }
  async getOrdersByUser(userId: string): Promise<Order[]> { return []; }
  async createOrder(order: InsertOrder): Promise<Order> { throw new Error("Database required for order management"); }
  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> { return undefined; }
  async deleteOrder(id: string): Promise<boolean> { return false; }
  
  async getAdminNotifications(): Promise<AdminNotification[]> { return []; }
  async createAdminNotification(notification: InsertAdminNotification): Promise<AdminNotification> { throw new Error("Database required"); }
  async markNotificationRead(id: string): Promise<boolean> { return false; }
  
  async getInventoryAlerts(): Promise<InventoryAlert[]> { return []; }
  async createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert> { throw new Error("Database required"); }
  async acknowledgeAlert(id: string): Promise<boolean> { return false; }
  
  async getRefunds(): Promise<Refund[]> { return []; }
  async getRefund(id: string): Promise<Refund | undefined> { return undefined; }
  async createRefund(refund: InsertRefund): Promise<Refund> { throw new Error("Database required"); }
  async updateRefund(id: string, refund: Partial<InsertRefund>): Promise<Refund | undefined> { return undefined; }
  
  async getAnalyticsData(): Promise<AnalyticsData[]> { return []; }
  async createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData> { throw new Error("Database required"); }
  
  async getIntegrations(): Promise<Integration[]> { return []; }
  async getIntegration(name: string): Promise<Integration | undefined> { return undefined; }
  async createIntegration(integration: InsertIntegration): Promise<Integration> { throw new Error("Database required"); }
  async updateIntegration(name: string, integration: Partial<InsertIntegration>): Promise<Integration | undefined> { return undefined; }
  
  async getTags(): Promise<Tag[]> { return []; }
  async createTag(tag: InsertTag): Promise<Tag> { throw new Error("Database required"); }
  async deleteTag(id: string): Promise<boolean> { return false; }
  
  async getCurrencies(): Promise<Currency[]> { return []; }
  async createCurrency(currency: InsertCurrency): Promise<Currency> { throw new Error("Database required"); }
  async updateCurrency(id: string, currency: Partial<InsertCurrency>): Promise<Currency | undefined> { return undefined; }
  
  async getAffiliates(): Promise<Affiliate[]> { return []; }
  async createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate> { throw new Error("Database required"); }
  async updateAffiliate(id: string, affiliate: Partial<InsertAffiliate>): Promise<Affiliate | undefined> { return undefined; }
  
  async getEmailCampaigns(): Promise<EmailCampaign[]> { return []; }
  async createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign> { throw new Error("Database required"); }
  async updateEmailCampaign(id: string, campaign: Partial<InsertEmailCampaign>): Promise<EmailCampaign | undefined> { return undefined; }
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

// Create storage instance based on database availability
export const storage: IStorage = db ? new DatabaseStorage() : new MemStorage();
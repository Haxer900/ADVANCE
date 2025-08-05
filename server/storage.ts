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

  constructor() {
    this.products = new Map();
    this.categories = new Map();
    this.cartItems = new Map();
    this.newsletters = new Map();
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

  // Stub implementations for admin methods (return empty arrays/false for memory storage)
  async getUsers(): Promise<User[]> { return []; }
  async getUser(id: string): Promise<User | undefined> { return undefined; }
  async getUserByEmail(email: string): Promise<User | undefined> { return undefined; }
  async createUser(user: InsertUser): Promise<User> { throw new Error("Database required for user management"); }
  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> { return undefined; }
  async deleteUser(id: string): Promise<boolean> { return false; }
  
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
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0] || undefined;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0] || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const result = await db.insert(cartItems).values(item).returning();
    return result[0];
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return result[0] || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return result.rowCount > 0;
  }

  // Newsletter
  async subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const result = await db.insert(newsletters).values(newsletter).returning();
    return result[0];
  }

  async getNewsletters(): Promise<Newsletter[]> {
    return await db.select().from(newsletters);
  }

  // Users (Admin Management)
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Orders (Admin Management)
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0] || undefined;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db.update(orders).set(order).where(eq(orders.id, id)).returning();
    return result[0] || undefined;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.rowCount > 0;
  }

  // Admin Notifications
  async getAdminNotifications(): Promise<AdminNotification[]> {
    return await db.select().from(adminNotifications);
  }

  async createAdminNotification(notification: InsertAdminNotification): Promise<AdminNotification> {
    const result = await db.insert(adminNotifications).values(notification).returning();
    return result[0];
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const result = await db.update(adminNotifications).set({ isRead: true }).where(eq(adminNotifications.id, id));
    return result.rowCount > 0;
  }

  // Inventory & Alerts
  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    return await db.select().from(inventoryAlerts);
  }

  async createInventoryAlert(alert: InsertInventoryAlert): Promise<InventoryAlert> {
    const result = await db.insert(inventoryAlerts).values(alert).returning();
    return result[0];
  }

  async acknowledgeAlert(id: string): Promise<boolean> {
    const result = await db.update(inventoryAlerts).set({ acknowledged: true }).where(eq(inventoryAlerts.id, id));
    return result.rowCount > 0;
  }

  // Refunds & Returns
  async getRefunds(): Promise<Refund[]> {
    return await db.select().from(refunds);
  }

  async getRefund(id: string): Promise<Refund | undefined> {
    const result = await db.select().from(refunds).where(eq(refunds.id, id));
    return result[0] || undefined;
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    const result = await db.insert(refunds).values(refund).returning();
    return result[0];
  }

  async updateRefund(id: string, refund: Partial<InsertRefund>): Promise<Refund | undefined> {
    const result = await db.update(refunds).set(refund).where(eq(refunds.id, id)).returning();
    return result[0] || undefined;
  }

  // Analytics
  async getAnalyticsData(): Promise<AnalyticsData[]> {
    return await db.select().from(analyticsData);
  }

  async createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData> {
    const result = await db.insert(analyticsData).values(data).returning();
    return result[0];
  }

  // Integrations
  async getIntegrations(): Promise<Integration[]> {
    return await db.select().from(integrations);
  }

  async getIntegration(name: string): Promise<Integration | undefined> {
    const result = await db.select().from(integrations).where(eq(integrations.name, name));
    return result[0] || undefined;
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const result = await db.insert(integrations).values(integration).returning();
    return result[0];
  }

  async updateIntegration(name: string, integration: Partial<InsertIntegration>): Promise<Integration | undefined> {
    const result = await db.update(integrations).set(integration).where(eq(integrations.name, name)).returning();
    return result[0] || undefined;
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const result = await db.insert(tags).values(tag).returning();
    return result[0];
  }

  async deleteTag(id: string): Promise<boolean> {
    const result = await db.delete(tags).where(eq(tags.id, id));
    return result.rowCount > 0;
  }

  // Currencies
  async getCurrencies(): Promise<Currency[]> {
    return await db.select().from(currencies);
  }

  async createCurrency(currency: InsertCurrency): Promise<Currency> {
    const result = await db.insert(currencies).values(currency).returning();
    return result[0];
  }

  async updateCurrency(id: string, currency: Partial<InsertCurrency>): Promise<Currency | undefined> {
    const result = await db.update(currencies).set(currency).where(eq(currencies.id, id)).returning();
    return result[0] || undefined;
  }

  // Affiliates
  async getAffiliates(): Promise<Affiliate[]> {
    return await db.select().from(affiliates);
  }

  async createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate> {
    const result = await db.insert(affiliates).values(affiliate).returning();
    return result[0];
  }

  async updateAffiliate(id: string, affiliate: Partial<InsertAffiliate>): Promise<Affiliate | undefined> {
    const result = await db.update(affiliates).set(affiliate).where(eq(affiliates.id, id)).returning();
    return result[0] || undefined;
  }

  // Email Campaigns
  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    return await db.select().from(emailCampaigns);
  }

  async createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign> {
    const result = await db.insert(emailCampaigns).values(campaign).returning();
    return result[0];
  }

  async updateEmailCampaign(id: string, campaign: Partial<InsertEmailCampaign>): Promise<EmailCampaign | undefined> {
    const result = await db.update(emailCampaigns).set(campaign).where(eq(emailCampaigns.id, id)).returning();
    return result[0] || undefined;
  }
}

export const storage = new DatabaseStorage();

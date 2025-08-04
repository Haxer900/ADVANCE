import { type Product, type InsertProduct, type Category, type InsertCategory, type CartItem, type InsertCartItem, type Newsletter, type InsertNewsletter } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Newsletter
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
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
}

export const storage = new MemStorage();

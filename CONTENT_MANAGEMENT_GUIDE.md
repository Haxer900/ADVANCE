# ZENTHRA Content Management Guide

This guide explains how to edit all the information and content on your ZENTHRA e-commerce platform.

## 🛍️ Product Management

### Adding/Editing Products
**Location**: `server/storage.ts` (lines 15-50)

Current products are stored in the `products` array. To modify:

```typescript
{
  id: "unique-id",
  name: "Product Name",
  description: "Product description text",
  price: "99.99",
  imageUrl: "https://your-image-url.com/image.jpg",
  category: "Category Name",
  inStock: true,
  featured: false
}
```

**How to Edit**:
1. Open `server/storage.ts`
2. Find the `products` array
3. Add, remove, or modify product objects
4. Save the file - changes apply immediately

### Product Categories
**Location**: `server/storage.ts` (categories array)

```typescript
{
  id: "unique-id",
  name: "Category Name",
  description: "Category description",
  imageUrl: "https://category-image-url.com/image.jpg"
}
```

## 🎨 Visual Content & Branding

### Company Logo & Branding
**Location**: `client/src/components/logo.tsx`
- Update the SVG logo design
- Change colors, fonts, and styling

### Website Colors & Styling
**Location**: `client/src/index.css` (lines 1-100)
- Primary colors: `--primary`, `--primary-foreground`
- Secondary colors: `--secondary`, `--secondary-foreground`
- Background colors: `--background`, `--card`
- Text colors: `--foreground`, `--muted-foreground`

### Homepage Content
**Location**: `client/src/pages/home.tsx`

**Editable Sections**:
- Hero section title and subtitle
- Featured product sections
- Call-to-action buttons
- Newsletter signup text

## 📝 Text Content

### Website Title & SEO
**Location**: `client/index.html`
- Page title: `<title>ZENTHRA - Premium Luxury Lifestyle</title>`
- Meta description for SEO
- Open Graph data for social media

### Navigation Menu
**Location**: `client/src/components/header.tsx` (lines 31-39)

```typescript
const navigation = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/products" },
  { name: "New Arrivals", href: "/products?featured=true" },
  { name: "Blog", href: "/blog" },
  { name: "Our Story", href: "/our-story" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
```

### Footer Content
**Location**: `client/src/components/footer.tsx`
- Company information
- Links and legal pages
- Social media links
- Contact information

## 📄 Page Content

### About Page
**Location**: `client/src/pages/about.tsx`
- Company story and mission
- Team information
- Values and philosophy

### Our Story Page
**Location**: `client/src/pages/our-story.tsx`
- Brand history
- Founding story
- Company milestones

### Contact Page
**Location**: `client/src/pages/contact.tsx`
- Contact form
- Business address
- Phone and email
- Business hours

## 🛒 E-commerce Settings

### Shipping Information
**Location**: Multiple files
- `client/src/pages/checkout.tsx` - Checkout shipping options
- `client/src/pages/product-detail.tsx` - Product page shipping info
- `client/src/pages/cart.tsx` - Cart shipping calculations

**Current Settings**:
- Free shipping threshold: $100
- Standard shipping: 3-5 business days
- Express shipping: 1-2 business days

### Return Policy
**Location**: `client/src/pages/product-detail.tsx` (Shipping & Returns tab)
- 30-day return policy
- Return conditions
- Exchange process

### Pricing & Currency
- All prices in USD ($)
- Tax rate: 8% (in checkout.tsx)
- To change currency, update all price display components

## 🎯 Marketing Content

### Announcement Bar
**Location**: `client/src/components/announcement-bar.tsx`
- Promotional messages
- Sale announcements
- Important notices

### Newsletter
**Location**: `client/src/pages/home.tsx` and `server/storage.ts`
- Newsletter signup forms
- Email collection
- Subscriber management

### Blog Posts
**Location**: `server/storage.ts` (blogPosts array)

```typescript
{
  id: "unique-id",
  title: "Blog Post Title",
  slug: "blog-post-url",
  excerpt: "Short description",
  content: "Full blog post content",
  featuredImage: "https://image-url.com/image.jpg",
  author: "Author Name",
  tags: ["tag1", "tag2"],
  published: true,
  createdAt: "2025-01-05T00:00:00Z",
  readTime: 5
}
```

## ⚙️ Technical Settings

### Database Configuration
**Location**: `server/storage.ts`
- In-memory storage for development
- PostgreSQL configuration for production

### API Endpoints
**Location**: `server/routes.ts`
- Product endpoints
- Cart management
- Order processing
- User management

### Environment Variables
Create a `.env` file for:
- Database connections
- Payment gateway keys
- Email service configuration
- Third-party integrations

## 🔧 Quick Edit Checklist

### Most Common Edits:

1. **Change Product Information**:
   - Edit `server/storage.ts` products array
   - Update name, price, description, images

2. **Update Company Branding**:
   - Logo: `client/src/components/logo.tsx`
   - Colors: `client/src/index.css`
   - Title: `client/index.html`

3. **Modify Navigation**:
   - Menu items: `client/src/components/header.tsx`
   - Footer links: `client/src/components/footer.tsx`

4. **Change Homepage Content**:
   - Hero section: `client/src/pages/home.tsx`
   - Featured products: Update product `featured: true`

5. **Update Contact Information**:
   - Contact page: `client/src/pages/contact.tsx`
   - Footer: `client/src/components/footer.tsx`

6. **Modify Shipping/Returns**:
   - Shipping rules: `client/src/pages/checkout.tsx`
   - Return policy: `client/src/pages/product-detail.tsx`

## 🚀 Making Changes Live

1. Edit the relevant files
2. Save changes
3. The development server automatically reloads
4. Changes appear immediately in the browser

## 📞 Need Help?

If you need help with any specific edits:
1. Tell me exactly what you want to change
2. I can show you the specific lines to edit
3. I can make the changes for you

**Common Requests**:
- "Change the hero text on homepage"
- "Add a new product"
- "Update contact information"
- "Modify shipping rates"
- "Change website colors"
- "Add new blog post"

Your ZENTHRA platform is fully customizable - every piece of text, image, color, and functionality can be modified to match your exact needs!
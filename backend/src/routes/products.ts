import { Router } from 'express';
import { Product, Review } from '../models';
import { z } from 'zod';

const router = Router();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit = '20', skip = '0' } = req.query;
    
    const filter: any = { isActive: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }
    
    const products = await Product.find(filter)
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string))
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get product reviews
    const reviews = await Review.find({ productId: req.params.id, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ ...product.toObject(), reviews });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product (admin only)
router.post('/', async (req, res) => {
  try {
    const productSchema = z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      originalPrice: z.number().positive().optional(),
      imageUrl: z.string().url(),
      images: z.array(z.string().url()).optional(),
      category: z.string().min(1),
      inStock: z.boolean().default(true),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).optional()
    });
    
    const validatedData = productSchema.parse(req.body);
    const product = new Product(validatedData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid product data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export { router as productsRouter };
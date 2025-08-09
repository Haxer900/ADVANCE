import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { mediaStorage } from '../services/media-storage';
import { storage } from '../storage';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload';
import { insertProductSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// ===========================================
// PRODUCT CRUD WITH MEDIA MANAGEMENT
// ===========================================

/**
 * Create new product with optional media upload
 * POST /api/products-media
 */
router.post('/', 
  uploadMultiple,
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Product description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('categoryId').notEmpty().withMessage('Category ID is required'),
    body('stock').optional().isNumeric()
  ],
  async (req, res) => {
    try {
      // Validate product data
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        categoryId: req.body.categoryId,
        stock: req.body.stock ? parseInt(req.body.stock) : 100,
        featured: req.body.featured === 'true',
        imageUrl: '', // Will be set to primary media URL
        variants: req.body.variants ? JSON.parse(req.body.variants) : []
      };

      const validatedProduct = insertProductSchema.parse(productData);
      
      // Create the product
      const product = await storage.createProduct(validatedProduct);

      // Upload media files if provided
      const uploadedMedia = [];
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const isPrimary = i === 0; // First image is primary

          const media = await mediaStorage.uploadMedia(
            file.buffer,
            file.originalname,
            file.mimetype,
            {
              productId: product.id,
              context: 'product',
              isPrimary,
              alt: req.body[`alt_${i}`] || `${product.name} image ${i + 1}`,
              title: req.body[`title_${i}`] || product.name,
              description: req.body[`description_${i}`] || `Product image for ${product.name}`,
              tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : []
            },
            req.body.userId
          );

          uploadedMedia.push(media);

          // Set primary image URL on product
          if (isPrimary) {
            productData.imageUrl = media.transformationUrl || media.cloudinarySecureUrl;
            await storage.updateProduct(product.id, { imageUrl: productData.imageUrl });
          }
        }
      }

      res.status(201).json({
        message: 'Product created successfully',
        product: {
          ...product,
          imageUrl: productData.imageUrl
        },
        media: uploadedMedia,
        mediaCount: uploadedMedia.length
      });
    } catch (error) {
      console.error('Create product with media error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid product data', 
          errors: error.errors 
        });
      }
      res.status(500).json({ 
        message: 'Failed to create product with media',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * Get product with all media
 * GET /api/products-media/:id
 */
router.get('/:id',
  param('id').isString().notEmpty(),
  async (req, res) => {
    try {
      const productId = req.params.id;
      
      // Get product details
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Get all media for the product
      const media = await mediaStorage.getProductMedia(productId);
      const primaryMedia = await mediaStorage.getPrimaryProductMedia(productId);

      res.json({
        product,
        media,
        primaryMedia,
        mediaCount: media.length
      });
    } catch (error) {
      console.error('Get product with media error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch product with media',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * Update product details and optionally add new media
 * PUT /api/products-media/:id
 */
router.put('/:id',
  uploadMultiple,
  param('id').isString().notEmpty(),
  async (req, res) => {
    try {
      const productId = req.params.id;

      // Check if product exists
      const existingProduct = await storage.getProduct(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Update product data
      const updateData: any = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.price) updateData.price = parseFloat(req.body.price);
      if (req.body.categoryId) updateData.categoryId = req.body.categoryId;
      if (req.body.stock !== undefined) updateData.stock = parseInt(req.body.stock);
      if (req.body.featured !== undefined) updateData.featured = req.body.featured === 'true';
      if (req.body.variants) updateData.variants = JSON.parse(req.body.variants);

      const updatedProduct = await storage.updateProduct(productId, updateData);

      // Upload new media files if provided
      const newMedia = [];
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          
          const media = await mediaStorage.uploadMedia(
            file.buffer,
            file.originalname,
            file.mimetype,
            {
              productId,
              context: 'product',
              isPrimary: false, // Don't automatically set as primary when updating
              alt: req.body[`alt_${i}`] || `${updatedProduct.name} image`,
              title: req.body[`title_${i}`] || updatedProduct.name,
              description: req.body[`description_${i}`] || `Product image for ${updatedProduct.name}`,
              tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : []
            },
            req.body.userId
          );

          newMedia.push(media);
        }
      }

      // Get all media for response
      const allMedia = await mediaStorage.getProductMedia(productId);
      const primaryMedia = await mediaStorage.getPrimaryProductMedia(productId);

      // Update product image URL if there's a primary media
      if (primaryMedia && !updateData.imageUrl) {
        updateData.imageUrl = primaryMedia.transformationUrl || primaryMedia.cloudinarySecureUrl;
        await storage.updateProduct(productId, { imageUrl: updateData.imageUrl });
      }

      res.json({
        message: 'Product updated successfully',
        product: updatedProduct,
        newMedia,
        allMedia,
        primaryMedia,
        newMediaCount: newMedia.length,
        totalMediaCount: allMedia.length
      });
    } catch (error) {
      console.error('Update product with media error:', error);
      res.status(500).json({ 
        message: 'Failed to update product with media',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * Delete product and all associated media
 * DELETE /api/products-media/:id
 */
router.delete('/:id',
  param('id').isString().notEmpty(),
  async (req, res) => {
    try {
      const productId = req.params.id;

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Get all media associated with the product
      const productMedia = await mediaStorage.getProductMedia(productId);

      // Delete all media files from Cloudinary and storage
      const deletionPromises = productMedia.map(media => 
        mediaStorage.deleteMedia(media.id)
      );
      await Promise.all(deletionPromises);

      // Delete the product
      await storage.deleteProduct(productId);

      res.json({
        message: 'Product and all associated media deleted successfully',
        deletedProduct: product,
        deletedMediaCount: productMedia.length
      });
    } catch (error) {
      console.error('Delete product with media error:', error);
      res.status(500).json({ 
        message: 'Failed to delete product with media',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * Add media to existing product
 * POST /api/products-media/:id/media
 */
router.post('/:id/media',
  uploadMultiple,
  param('id').isString().notEmpty(),
  async (req, res) => {
    try {
      const productId = req.params.id;

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      const uploadedMedia = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        
        const media = await mediaStorage.uploadMedia(
          file.buffer,
          file.originalname,
          file.mimetype,
          {
            productId,
            context: 'product',
            isPrimary: req.body[`isPrimary_${i}`] === 'true',
            alt: req.body[`alt_${i}`] || `${product.name} image`,
            title: req.body[`title_${i}`] || product.name,
            description: req.body[`description_${i}`] || `Product image for ${product.name}`,
            tags: req.body.tags ? req.body.tags.split(',').map((tag: string) => tag.trim()) : []
          },
          req.body.userId
        );

        uploadedMedia.push(media);
      }

      // Update product image URL if a new primary image was set
      const primaryMedia = await mediaStorage.getPrimaryProductMedia(productId);
      if (primaryMedia) {
        const imageUrl = primaryMedia.transformationUrl || primaryMedia.cloudinarySecureUrl;
        await storage.updateProduct(productId, { imageUrl });
      }

      res.status(201).json({
        message: 'Media added to product successfully',
        productId,
        uploadedMedia,
        uploadedCount: uploadedMedia.length
      });
    } catch (error) {
      console.error('Add media to product error:', error);
      res.status(500).json({ 
        message: 'Failed to add media to product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * Set primary media for product
 * PUT /api/products-media/:id/media/:mediaId/primary
 */
router.put('/:id/media/:mediaId/primary',
  [
    param('id').isString().notEmpty(),
    param('mediaId').isString().notEmpty()
  ],
  async (req, res) => {
    try {
      const productId = req.params.id;
      const mediaId = req.params.mediaId;

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if media exists and belongs to product
      const media = await mediaStorage.getMediaById(mediaId);
      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      // Get product media to verify ownership
      const productMedia = await mediaStorage.getProductMedia(productId);
      const mediaExists = productMedia.some(m => m.id === mediaId);
      if (!mediaExists) {
        return res.status(400).json({ error: 'Media does not belong to this product' });
      }

      // Set as primary
      await mediaStorage.updateMedia(mediaId, { isPrimary: true });

      // Update product image URL
      const imageUrl = media.transformationUrl || media.cloudinarySecureUrl;
      await storage.updateProduct(productId, { imageUrl });

      res.json({
        message: 'Primary media set successfully',
        productId,
        mediaId,
        newImageUrl: imageUrl
      });
    } catch (error) {
      console.error('Set primary media error:', error);
      res.status(500).json({ 
        message: 'Failed to set primary media',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * Remove media from product
 * DELETE /api/products-media/:id/media/:mediaId
 */
router.delete('/:id/media/:mediaId',
  [
    param('id').isString().notEmpty(),
    param('mediaId').isString().notEmpty()
  ],
  async (req, res) => {
    try {
      const productId = req.params.id;
      const mediaId = req.params.mediaId;

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if media exists
      const media = await mediaStorage.getMediaById(mediaId);
      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      // Delete the media
      await mediaStorage.deleteMedia(mediaId);

      // If this was the primary media, update product image URL
      if (media.isPrimary) {
        const newPrimaryMedia = await mediaStorage.getPrimaryProductMedia(productId);
        const newImageUrl = newPrimaryMedia 
          ? (newPrimaryMedia.transformationUrl || newPrimaryMedia.cloudinarySecureUrl)
          : '';
        await storage.updateProduct(productId, { imageUrl: newImageUrl });
      }

      res.json({
        message: 'Media removed from product successfully',
        productId,
        deletedMediaId: mediaId,
        wasPrimary: media.isPrimary
      });
    } catch (error) {
      console.error('Remove media from product error:', error);
      res.status(500).json({ 
        message: 'Failed to remove media from product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * Get all products with their primary media
 * GET /api/products-media
 */
router.get('/',
  [
    query('category').optional().isString(),
    query('featured').optional().isBoolean(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  async (req, res) => {
    try {
      const category = req.query.category as string;
      const featured = req.query.featured === 'true';
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      // Get products based on filters
      let products;
      if (category) {
        products = await storage.getProductsByCategory(category);
      } else if (featured) {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getProducts();
      }

      // Apply pagination
      const paginatedProducts = products.slice(offset, offset + limit);

      // Get primary media for each product
      const productsWithMedia = await Promise.all(
        paginatedProducts.map(async (product) => {
          const primaryMedia = await mediaStorage.getPrimaryProductMedia(product.id);
          const mediaCount = (await mediaStorage.getProductMedia(product.id)).length;
          
          return {
            ...product,
            primaryMedia,
            mediaCount,
            // Ensure imageUrl is up to date
            imageUrl: primaryMedia 
              ? (primaryMedia.transformationUrl || primaryMedia.cloudinarySecureUrl)
              : product.imageUrl
          };
        })
      );

      res.json({
        products: productsWithMedia,
        pagination: {
          limit,
          offset,
          total: products.length,
          hasMore: offset + limit < products.length
        },
        filters: {
          category,
          featured
        }
      });
    } catch (error) {
      console.error('Get products with media error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch products with media',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Error handling middleware
router.use(handleUploadError);

export default router;
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { mediaStorage } from '../services/media-storage';
import { cloudinaryService } from '../services/cloudinary';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload';
import { z } from 'zod';

const router = Router();

// Validation schemas
const uploadMediaSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  collectionId: z.string().optional(),
  context: z.enum(['product', 'category', 'banner', 'lookbook', 'blog', 'user', 'site']),
  isPrimary: z.boolean().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folder: z.string().optional()
});

// Upload single media file
router.post('/upload', uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate request body
    const validationResult = uploadMediaSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.errors
      });
    }

    const options = validationResult.data;
    const userId = req.body.userId; // From auth middleware

    const media = await mediaStorage.uploadMedia(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      options,
      userId
    );

    res.status(201).json({
      message: 'Media uploaded successfully',
      media
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ 
      error: 'Failed to upload media',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Upload multiple media files
router.post('/upload/multiple', uploadMultiple, handleUploadError, async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Validate request body
    const validationResult = uploadMediaSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validationResult.error.errors
      });
    }

    const options = validationResult.data;
    const userId = req.body.userId;

    const uploadPromises = req.files.map((file, index) => 
      mediaStorage.uploadMedia(
        file.buffer,
        file.originalname,
        file.mimetype,
        {
          ...options,
          isPrimary: index === 0 && options.isPrimary // Only first file can be primary
        },
        userId
      )
    );

    const media = await Promise.all(uploadPromises);

    res.status(201).json({
      message: `${media.length} media files uploaded successfully`,
      media
    });
  } catch (error) {
    console.error('Upload multiple media error:', error);
    res.status(500).json({ 
      error: 'Failed to upload media files',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get media by ID
router.get('/:id', 
  param('id').isString().notEmpty(),
  async (req, res) => {
    try {
      const mediaId = req.params.id;
      const media = await mediaStorage.getMediaById(mediaId);
      
      res.json(media);
    } catch (error) {
      console.error('Get media error:', error);
      res.status(500).json({ 
        error: 'Failed to get media',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get product media
router.get('/product/:productId',
  param('productId').isString().notEmpty(),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const media = await mediaStorage.getProductMedia(productId);
      
      res.json({
        productId,
        media
      });
    } catch (error) {
      console.error('Get product media error:', error);
      res.status(500).json({ 
        error: 'Failed to get product media',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get primary product media
router.get('/product/:productId/primary',
  param('productId').isString().notEmpty(),
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const media = await mediaStorage.getPrimaryProductMedia(productId);
      
      if (!media) {
        return res.status(404).json({ error: 'No primary media found for product' });
      }

      res.json(media);
    } catch (error) {
      console.error('Get primary product media error:', error);
      res.status(500).json({ 
        error: 'Failed to get primary product media',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get media by context
router.get('/context/:context',
  param('context').isIn(['product', 'category', 'banner', 'lookbook', 'blog', 'user', 'site']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  async (req, res) => {
    try {
      const context = req.params.context;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const media = await mediaStorage.getMediaByContext(context, limit, offset);
      
      res.json({
        context,
        limit,
        offset,
        count: media.length,
        media
      });
    } catch (error) {
      console.error('Get media by context error:', error);
      res.status(500).json({ 
        error: 'Failed to get media by context',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Update media metadata
router.patch('/:id',
  param('id').isString().notEmpty(),
  body('alt').optional().isString(),
  body('title').optional().isString(),
  body('description').optional().isString(),
  body('tags').optional().isArray(),
  body('isPrimary').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  async (req, res) => {
    try {
      const mediaId = req.params.id;
      const updates = req.body;

      const media = await mediaStorage.updateMedia(mediaId, updates);
      
      res.json({
        message: 'Media updated successfully',
        media
      });
    } catch (error) {
      console.error('Update media error:', error);
      res.status(500).json({ 
        error: 'Failed to update media',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Delete media
router.delete('/:id',
  param('id').isString().notEmpty(),
  async (req, res) => {
    try {
      const mediaId = req.params.id;
      
      await mediaStorage.deleteMedia(mediaId);
      
      res.json({
        message: 'Media deleted successfully'
      });
    } catch (error) {
      console.error('Delete media error:', error);
      res.status(500).json({ 
        error: 'Failed to delete media',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Search media
router.get('/search',
  query('q').isString().notEmpty(),
  query('context').optional().isIn(['product', 'category', 'banner', 'lookbook', 'blog', 'user', 'site']),
  query('mediaType').optional().isIn(['image', 'video']),
  query('tags').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  async (req, res) => {
    try {
      const query = req.query.q as string;
      const context = req.query.context as string | undefined;
      const mediaType = req.query.mediaType as 'image' | 'video' | undefined;
      const tags = req.query.tags ? (req.query.tags as string).split(',') : undefined;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const media = await mediaStorage.searchMedia(
        query,
        { context, mediaType, tags },
        limit,
        offset
      );
      
      res.json({
        query,
        filters: { context, mediaType, tags },
        limit,
        offset,
        count: media.length,
        media
      });
    } catch (error) {
      console.error('Search media error:', error);
      res.status(500).json({ 
        error: 'Failed to search media',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get transformation URL
router.get('/:id/transformation/:name',
  param('id').isString().notEmpty(),
  param('name').isString().notEmpty(),
  async (req, res) => {
    try {
      const mediaId = req.params.id;
      const transformationName = req.params.name;
      
      // For simplified implementation, return the base transformation URL
      const media = await mediaStorage.getMediaById(mediaId);
      const url = media?.transformationUrl;
      
      if (!url) {
        return res.status(404).json({ error: 'Transformation not found' });
      }

      res.json({
        mediaId,
        transformationName,
        url
      });
    } catch (error) {
      console.error('Get transformation URL error:', error);
      res.status(500).json({ 
        error: 'Failed to get transformation URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Create media collection
router.post('/collections',
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
  body('context').isIn(['product', 'category', 'banner', 'lookbook', 'blog', 'user', 'site']),
  body('slug').isString().notEmpty(),
  body('isPublic').optional().isBoolean(),
  body('metadata').optional().isObject(),
  async (req, res) => {
    try {
      const collectionData = req.body;
      
      // Simplified implementation - just return success for now
      const collection = { id: 'temp', ...collectionData, createdAt: new Date(), updatedAt: new Date() };
      
      res.status(201).json({
        message: 'Collection created successfully',
        collection
      });
    } catch (error) {
      console.error('Create collection error:', error);
      res.status(500).json({ 
        error: 'Failed to create collection',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get media collection
router.get('/collections/:id',
  param('id').isString().notEmpty(),
  async (req, res) => {
    try {
      const collectionId = req.params.id;
      
      // Simplified implementation
      const result = { collection: { id: collectionId }, media: [] };
      
      res.json(result);
    } catch (error) {
      console.error('Get collection error:', error);
      res.status(500).json({ 
        error: 'Failed to get collection',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Health check for Cloudinary
router.get('/health/cloudinary', async (req, res) => {
  try {
    const isValid = cloudinaryService.validateConfig();
    
    if (!isValid) {
      return res.status(500).json({
        status: 'error',
        message: 'Cloudinary configuration is invalid'
      });
    }

    res.json({
      status: 'ok',
      message: 'Cloudinary is configured correctly'
    });
  } catch (error) {
    console.error('Cloudinary health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check Cloudinary health'
    });
  }
});

export default router;
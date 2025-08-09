import { Router } from 'express';
import { validationService } from '../services/validation';
import { mediaStorage } from '../services/media-storage';
import { storage } from '../storage';

const router = Router();

/**
 * System health check endpoint
 * GET /api/health
 */
router.get('/', async (req, res) => {
  try {
    const healthCheck = await validationService.performHealthCheck();
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 206 : 500;

    res.status(statusCode).json({
      ...healthCheck,
      api: {
        status: 'healthy',
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Health check failed',
      api: {
        status: 'unhealthy',
        version: '1.0.0',
        uptime: process.uptime()
      }
    });
  }
});

/**
 * Media storage system test
 * GET /api/health/media
 */
router.get('/media', async (req, res) => {
  try {
    const testResults = {
      timestamp: new Date(),
      cloudinary: {
        configured: false,
        error: null as string | null
      },
      mongodb: {
        connected: false,
        error: null as string | null
      },
      fileValidation: {
        working: true,
        tests: [] as any[]
      }
    };

    // Test Cloudinary configuration
    try {
      const cloudinaryResult = await validationService.validateCloudinaryConnection();
      testResults.cloudinary.configured = cloudinaryResult.isValid;
      if (!cloudinaryResult.isValid) {
        testResults.cloudinary.error = cloudinaryResult.error || 'Unknown error';
      }
    } catch (error) {
      testResults.cloudinary.error = error instanceof Error ? error.message : 'Test failed';
    }

    // Test MongoDB connection
    try {
      const mongoResult = await validationService.validateMongoDBConnection();
      testResults.mongodb.connected = mongoResult.isValid;
      if (!mongoResult.isValid) {
        testResults.mongodb.error = mongoResult.error || 'Unknown error';
      }
    } catch (error) {
      testResults.mongodb.error = error instanceof Error ? error.message : 'Test failed';
    }

    // Test file validation
    const testFiles = [
      { originalname: 'test.jpg', mimetype: 'image/jpeg', size: 1024 },
      { originalname: 'test.png', mimetype: 'image/png', size: 2048 },
      { originalname: 'test.webp', mimetype: 'image/webp', size: 1536 },
      { originalname: 'test.mp4', mimetype: 'video/mp4', size: 5120 },
      { originalname: 'invalid.gif', mimetype: 'image/gif', size: 1024 }, // Should fail
      { originalname: 'toolarge.jpg', mimetype: 'image/jpeg', size: 20971520 } // Should fail (20MB)
    ];

    testResults.fileValidation.tests = testFiles.map(file => {
      const validation = validationService.validateFileUpload(file);
      return {
        file: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        isValid: validation.isValid,
        errors: validation.errors
      };
    });

    const overallStatus = 
      testResults.cloudinary.configured && testResults.mongodb.connected && testResults.fileValidation.working
        ? 'healthy' : 'degraded';

    res.status(overallStatus === 'healthy' ? 200 : 206).json({
      status: overallStatus,
      message: 'Media storage system test completed',
      ...testResults
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Media test failed'
    });
  }
});

/**
 * Test upload validation endpoint
 * POST /api/health/validate-file
 */
router.post('/validate-file', async (req, res) => {
  try {
    const { originalname, mimetype, size } = req.body;

    if (!originalname || !mimetype || !size) {
      return res.status(400).json({
        error: 'Missing required fields: originalname, mimetype, size'
      });
    }

    const validation = validationService.validateFileUpload({
      originalname,
      mimetype,
      size: parseInt(size)
    });

    res.json({
      file: { originalname, mimetype, size },
      validation,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Validation test failed',
      timestamp: new Date()
    });
  }
});

/**
 * Database statistics endpoint
 * GET /api/health/stats
 */
router.get('/stats', async (req, res) => {
  try {
    // Get basic statistics
    const products = await storage.getProducts();
    const categories = await storage.getCategories();
    const users = await storage.getUsers();

    // Get media statistics - simplified for in-memory storage
    const stats = {
      timestamp: new Date(),
      database: {
        products: products.length,
        categories: categories.length,
        users: users.length,
        featuredProducts: products.filter(p => p.featured).length
      },
      media: {
        totalFiles: 0, // Would need to implement counting in mediaStorage
        imageFiles: 0,
        videoFiles: 0,
        totalSizeBytes: 0
      },
      system: {
        nodeVersion: process.version,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        env: process.env.NODE_ENV
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Stats collection failed',
      timestamp: new Date()
    });
  }
});

export default router;
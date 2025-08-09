import { cloudinaryService } from './cloudinary';
import { mongoService } from './mongodb';

/**
 * Comprehensive validation service for API credentials and connections
 */
export class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  /**
   * Validate all required environment variables
   */
  validateEnvironmentVariables(): {
    isValid: boolean;
    missing: string[];
    warnings: string[];
  } {
    const required = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY', 
      'CLOUDINARY_API_SECRET',
      'MONGODB_URI'
    ];

    const optional = [
      'JWT_SECRET',
      'MAX_FILE_SIZE',
      'MAX_FILES_PER_UPLOAD'
    ];

    const missing = required.filter(key => !process.env[key]);
    const warnings = optional.filter(key => !process.env[key]);

    return {
      isValid: missing.length === 0,
      missing,
      warnings
    };
  }

  /**
   * Test Cloudinary connection and configuration
   */
  async validateCloudinaryConnection(): Promise<{
    isValid: boolean;
    error?: string;
    details?: any;
  }> {
    try {
      // Check configuration
      if (!cloudinaryService.validateConfig()) {
        return {
          isValid: false,
          error: 'Cloudinary configuration is incomplete'
        };
      }

      // Test connection by attempting to get account details
      const cloudinary = require('cloudinary').v2;
      const result = await cloudinary.api.ping();
      
      return {
        isValid: true,
        details: {
          status: result.status,
          message: 'Cloudinary connection successful'
        }
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Cloudinary connection failed: ${error}`,
        details: error
      };
    }
  }

  /**
   * Test MongoDB Atlas connection
   */
  async validateMongoDBConnection(): Promise<{
    isValid: boolean;
    error?: string;
    details?: any;
  }> {
    try {
      await mongoService.connect();
      
      if (mongoService.isMongoConnected()) {
        return {
          isValid: true,
          details: {
            message: 'MongoDB Atlas connection successful'
          }
        };
      } else {
        return {
          isValid: false,
          error: 'MongoDB connection established but not ready'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: `MongoDB connection failed: ${error}`,
        details: error
      };
    }
  }

  /**
   * Test file upload validation
   */
  validateFileUpload(
    file: {
      originalname: string;
      mimetype: string;
      size: number;
    }
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png', 
      'image/webp',
      'video/mp4'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, and MP4 files are allowed.`);
    }

    // Validate file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push(`Invalid file extension: ${fileExtension}. Only .jpg, .jpeg, .png, .webp, and .mp4 files are allowed.`);
    }

    // Validate file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
    if (file.size > maxSize) {
      errors.push(`File too large: ${file.size} bytes. Maximum size is ${maxSize} bytes (${Math.round(maxSize / 1024 / 1024)}MB).`);
    }

    // Validate filename
    if (file.originalname.length > 255) {
      errors.push('Filename too long. Maximum 255 characters allowed.');
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(file.originalname.replace(/\.[^.]+$/, ''))) {
      errors.push('Invalid filename. Only letters, numbers, dots, hyphens, and underscores are allowed.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Comprehensive system health check
   */
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: Date;
    services: {
      environment: any;
      cloudinary: any;
      mongodb: any;
    };
    summary: {
      totalServices: number;
      healthyServices: number;
      degradedServices: number;
      unhealthyServices: number;
    };
  }> {
    const timestamp = new Date();
    
    // Check environment variables
    const envCheck = this.validateEnvironmentVariables();
    
    // Check Cloudinary
    const cloudinaryCheck = await this.validateCloudinaryConnection();
    
    // Check MongoDB
    const mongoCheck = await this.validateMongoDBConnection();

    const services = {
      environment: {
        status: envCheck.isValid ? 'healthy' : 'unhealthy',
        missing: envCheck.missing,
        warnings: envCheck.warnings
      },
      cloudinary: {
        status: cloudinaryCheck.isValid ? 'healthy' : 'unhealthy',
        error: cloudinaryCheck.error,
        details: cloudinaryCheck.details
      },
      mongodb: {
        status: mongoCheck.isValid ? 'healthy' : 'degraded',
        error: mongoCheck.error,
        details: mongoCheck.details
      }
    };

    // Calculate summary
    const serviceStatuses = [
      services.environment.status,
      services.cloudinary.status,
      services.mongodb.status
    ];

    const healthyServices = serviceStatuses.filter(s => s === 'healthy').length;
    const degradedServices = serviceStatuses.filter(s => s === 'degraded').length;
    const unhealthyServices = serviceStatuses.filter(s => s === 'unhealthy').length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (unhealthyServices > 0) {
      overallStatus = 'unhealthy';
    } else if (degradedServices > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      status: overallStatus,
      timestamp,
      services,
      summary: {
        totalServices: 3,
        healthyServices,
        degradedServices,
        unhealthyServices
      }
    };
  }
}

export const validationService = ValidationService.getInstance();
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  url: string;
  version: number;
  created_at: string;
}

export interface UploadOptions {
  folder?: string;
  context?: string;
  transformation?: any;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
  overwrite?: boolean;
  tags?: string[];
  quality?: string | number;
  format?: string;
}

class CloudinaryService {
  /**
   * Upload a file to Cloudinary
   */
  async uploadFile(
    file: Buffer | Readable | string,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions: any = {
        resource_type: options.resourceType || 'auto',
        folder: options.folder || 'more-than-fashion',
        use_filename: true,
        unique_filename: true,
        overwrite: options.overwrite || false,
        tags: options.tags || [],
      };

      // Add context for better organization
      if (options.context) {
        uploadOptions.context = options.context;
      }

      // Add public_id if specified
      if (options.publicId) {
        uploadOptions.public_id = options.publicId;
      }

      // Apply transformations for optimization
      if (options.transformation) {
        uploadOptions.transformation = options.transformation;
      } else {
        // Default optimizations
        if (options.resourceType === 'image') {
          uploadOptions.transformation = [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
            { dpr: 'auto' },
          ];
        } else if (options.resourceType === 'video') {
          uploadOptions.transformation = [
            { quality: 'auto:good' },
            { video_codec: 'h264' },
            { format: 'mp4' },
          ];
        }
      }

      const result = await cloudinary.uploader.upload(file as string, uploadOptions);
      return result as CloudinaryUploadResult;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload file to Cloudinary: ${error}`);
    }
  }

  /**
   * Upload an image with specific optimizations
   */
  async uploadImage(
    file: Buffer | string,
    options: Omit<UploadOptions, 'resourceType'> & {
      width?: number;
      height?: number;
      crop?: string;
      gravity?: string;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    const transformation: any[] = [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
      { dpr: 'auto' },
    ];

    // Add resize transformation if dimensions provided
    if (options.width || options.height) {
      transformation.push({
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
        gravity: options.gravity || 'auto',
      });
    }

    return this.uploadFile(file, {
      ...options,
      resourceType: 'image',
      transformation,
    });
  }

  /**
   * Upload a video with compression
   */
  async uploadVideo(
    file: Buffer | string,
    options: Omit<UploadOptions, 'resourceType'> & {
      width?: number;
      height?: number;
      bitRate?: string;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    const transformation: any[] = [
      { quality: 'auto:good' },
      { video_codec: 'h264' },
      { format: 'mp4' },
    ];

    // Add video optimization
    if (options.width || options.height) {
      transformation.push({
        width: options.width,
        height: options.height,
        crop: 'fill',
        gravity: 'auto',
      });
    }

    if (options.bitRate) {
      transformation.push({ bit_rate: options.bitRate });
    }

    return this.uploadFile(file, {
      ...options,
      resourceType: 'video',
      transformation,
    });
  }

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete file from Cloudinary: ${error}`);
    }
  }

  /**
   * Delete multiple files from Cloudinary
   */
  async deleteFiles(
    publicIds: string[],
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ): Promise<{ deleted: Record<string, string> }> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error('Cloudinary batch delete error:', error);
      throw new Error(`Failed to delete files from Cloudinary: ${error}`);
    }
  }

  /**
   * Generate transformed URL for existing media
   */
  generateTransformationUrl(
    publicId: string,
    transformations: any[],
    resourceType: 'image' | 'video' = 'image'
  ): string {
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      transformation: transformations,
      secure: true,
    });
  }

  /**
   * Get optimized URL for responsive images
   */
  getResponsiveImageUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: string;
      crop?: string;
      gravity?: string;
    } = {}
  ): string {
    const transformation: any[] = [
      { quality: options.quality || 'auto:good' },
      { fetch_format: options.format || 'auto' },
      { dpr: 'auto' },
    ];

    if (options.width || options.height) {
      const sizeTransform: any = {
        crop: options.crop || 'fill',
        gravity: options.gravity || 'auto',
      };
      if (options.width) sizeTransform.width = options.width;
      if (options.height) sizeTransform.height = options.height;
      transformation.push(sizeTransform);
    }

    return cloudinary.url(publicId, {
      resource_type: 'image',
      transformation,
      secure: true,
    });
  }

  /**
   * Get video thumbnail
   */
  getVideoThumbnail(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { quality: options.quality || 'auto:good' },
        { width: options.width || 400 },
        { height: options.height || 300 },
        { crop: 'fill' },
      ],
      secure: true,
    });
  }

  /**
   * Search for media files
   */
  async searchFiles(
    query: string,
    options: {
      resourceType?: 'image' | 'video';
      maxResults?: number;
      nextCursor?: string;
    } = {}
  ) {
    try {
      const searchOptions: any = {
        expression: query,
        max_results: options.maxResults || 50,
        resource_type: options.resourceType || 'image',
      };

      if (options.nextCursor) {
        searchOptions.next_cursor = options.nextCursor;
      }

      const result = await cloudinary.search.expression(searchOptions.expression).max_results(searchOptions.max_results).execute();
      return result;
    } catch (error) {
      console.error('Cloudinary search error:', error);
      throw new Error(`Failed to search Cloudinary: ${error}`);
    }
  }

  /**
   * Get file details
   */
  async getFileDetails(publicId: string, resourceType: 'image' | 'video' = 'image') {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error('Cloudinary get details error:', error);
      throw new Error(`Failed to get file details from Cloudinary: ${error}`);
    }
  }

  /**
   * Validate Cloudinary configuration
   */
  validateConfig(): boolean {
    const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('Missing Cloudinary configuration:', missing);
      return false;
    }
    
    return true;
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
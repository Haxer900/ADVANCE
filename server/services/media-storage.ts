import { cloudinaryService, type CloudinaryUploadResult } from './cloudinary';
import { nanoid } from 'nanoid';

export interface MediaMetadata {
  id: string;
  cloudinaryPublicId: string;
  cloudinarySecureUrl: string;
  transformationUrl?: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  mediaType: 'image' | 'video';
  context: string;
  format: string;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
  isPrimary: boolean;
  isActive: boolean;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaUploadOptions {
  productId?: string;
  variantId?: string;
  collectionId?: string;
  context: 'product' | 'category' | 'banner' | 'lookbook' | 'blog' | 'user' | 'site';
  isPrimary?: boolean;
  alt?: string;
  title?: string;
  description?: string;
  tags?: string[];
  folder?: string;
  transformations?: any[];
}

// In-memory storage for development/testing
class InMemoryMediaStorage {
  private mediaFiles = new Map<string, MediaMetadata>();
  private productMedia = new Map<string, string[]>(); // productId -> mediaIds
  private contextMedia = new Map<string, string[]>(); // context -> mediaIds

  /**
   * Upload media file to Cloudinary and save metadata
   */
  async uploadMedia(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    options: MediaUploadOptions,
    userId?: string
  ): Promise<MediaMetadata> {
    try {
      // Validate file type
      this.validateFileType(mimeType);

      // Determine resource type
      const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
      
      // Generate folder path
      const folder = options.folder || `more-than-fashion/${options.context}`;
      
      // Upload to Cloudinary
      const cloudinaryResult: CloudinaryUploadResult = resourceType === 'image' 
        ? await cloudinaryService.uploadImage(fileBuffer, {
            folder,
            context: `${options.context}|product_id:${options.productId || ''}`,
            tags: options.tags,
            ...(options.transformations && { transformation: options.transformations })
          })
        : await cloudinaryService.uploadVideo(fileBuffer, {
            folder,
            context: `${options.context}|product_id:${options.productId || ''}`,
            tags: options.tags,
            ...(options.transformations && { transformation: options.transformations })
          });

      // Create optimized transformation URL
      const transformationUrl = resourceType === 'image'
        ? cloudinaryService.getResponsiveImageUrl(cloudinaryResult.public_id, {
            quality: 'auto:good',
            format: 'auto'
          })
        : cloudinaryService.generateTransformationUrl(
            cloudinaryResult.public_id,
            [{ quality: 'auto:good', format: 'mp4' }],
            'video'
          );

      // Create media metadata
      const mediaId = nanoid();
      const mediaMetadata: MediaMetadata = {
        id: mediaId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinarySecureUrl: cloudinaryResult.secure_url,
        transformationUrl,
        originalName,
        fileName: cloudinaryResult.original_filename || originalName,
        mimeType,
        fileSize: cloudinaryResult.bytes,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        duration: cloudinaryResult.duration,
        mediaType: resourceType,
        context: options.context,
        format: cloudinaryResult.format,
        alt: options.alt,
        title: options.title,
        description: options.description,
        tags: options.tags || [],
        isPrimary: options.isPrimary || false,
        isActive: true,
        uploadedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store in memory
      this.mediaFiles.set(mediaId, mediaMetadata);

      // Associate with product if specified
      if (options.productId) {
        if (options.isPrimary) {
          // Remove primary flag from other media for this product
          const existingMedia = this.productMedia.get(options.productId) || [];
          existingMedia.forEach(id => {
            const media = this.mediaFiles.get(id);
            if (media) {
              media.isPrimary = false;
              this.mediaFiles.set(id, media);
            }
          });
        }

        const productMediaList = this.productMedia.get(options.productId) || [];
        productMediaList.push(mediaId);
        this.productMedia.set(options.productId, productMediaList);
      }

      // Associate with context
      const contextMediaList = this.contextMedia.get(options.context) || [];
      contextMediaList.push(mediaId);
      this.contextMedia.set(options.context, contextMediaList);

      return mediaMetadata;
    } catch (error) {
      console.error('Media upload error:', error);
      throw new Error(`Failed to upload media: ${error}`);
    }
  }

  /**
   * Update media metadata
   */
  async updateMedia(
    mediaId: string,
    updates: Partial<Pick<MediaMetadata, 'alt' | 'title' | 'description' | 'tags' | 'isPrimary' | 'isActive'>>
  ): Promise<MediaMetadata> {
    const media = this.mediaFiles.get(mediaId);
    if (!media) {
      throw new Error('Media file not found');
    }

    // If setting as primary, unset other primary media for the same product
    if (updates.isPrimary) {
      for (const [productId, mediaIds] of this.productMedia.entries()) {
        if (mediaIds.includes(mediaId)) {
          mediaIds.forEach(id => {
            if (id !== mediaId) {
              const otherMedia = this.mediaFiles.get(id);
              if (otherMedia) {
                otherMedia.isPrimary = false;
                this.mediaFiles.set(id, otherMedia);
              }
            }
          });
          break;
        }
      }
    }

    const updatedMedia = { ...media, ...updates, updatedAt: new Date() };
    this.mediaFiles.set(mediaId, updatedMedia);
    return updatedMedia;
  }

  /**
   * Delete media file from both Cloudinary and storage
   */
  async deleteMedia(mediaId: string): Promise<void> {
    const media = this.mediaFiles.get(mediaId);
    if (!media) {
      throw new Error('Media file not found');
    }

    // Delete from Cloudinary
    await cloudinaryService.deleteFile(media.cloudinaryPublicId, media.mediaType);

    // Remove from storage
    this.mediaFiles.delete(mediaId);

    // Remove from product associations
    for (const [productId, mediaIds] of this.productMedia.entries()) {
      const index = mediaIds.indexOf(mediaId);
      if (index > -1) {
        mediaIds.splice(index, 1);
        if (mediaIds.length === 0) {
          this.productMedia.delete(productId);
        } else {
          this.productMedia.set(productId, mediaIds);
        }
        break;
      }
    }

    // Remove from context associations
    for (const [context, mediaIds] of this.contextMedia.entries()) {
      const index = mediaIds.indexOf(mediaId);
      if (index > -1) {
        mediaIds.splice(index, 1);
        if (mediaIds.length === 0) {
          this.contextMedia.delete(context);
        } else {
          this.contextMedia.set(context, mediaIds);
        }
        break;
      }
    }
  }

  /**
   * Get media files by product ID
   */
  async getProductMedia(productId: string): Promise<MediaMetadata[]> {
    const mediaIds = this.productMedia.get(productId) || [];
    return mediaIds
      .map(id => this.mediaFiles.get(id))
      .filter((media): media is MediaMetadata => media !== undefined)
      .sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  /**
   * Get primary media for a product
   */
  async getPrimaryProductMedia(productId: string): Promise<MediaMetadata | null> {
    const mediaIds = this.productMedia.get(productId) || [];
    for (const id of mediaIds) {
      const media = this.mediaFiles.get(id);
      if (media && media.isPrimary && media.isActive) {
        return media;
      }
    }
    return null;
  }

  /**
   * Get media files by context
   */
  async getMediaByContext(context: string, limit = 50, offset = 0): Promise<MediaMetadata[]> {
    const mediaIds = this.contextMedia.get(context) || [];
    return mediaIds
      .map(id => this.mediaFiles.get(id))
      .filter((media): media is MediaMetadata => media !== undefined && media.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  /**
   * Get media by ID
   */
  async getMediaById(mediaId: string): Promise<MediaMetadata | null> {
    return this.mediaFiles.get(mediaId) || null;
  }

  /**
   * Search media files
   */
  async searchMedia(
    query: string,
    filters: {
      context?: string;
      mediaType?: 'image' | 'video';
      tags?: string[];
    } = {},
    limit = 50,
    offset = 0
  ): Promise<MediaMetadata[]> {
    const allMedia = Array.from(this.mediaFiles.values())
      .filter(media => {
        if (!media.isActive) return false;
        
        // Filter by context
        if (filters.context && media.context !== filters.context) return false;
        
        // Filter by media type
        if (filters.mediaType && media.mediaType !== filters.mediaType) return false;
        
        // Filter by tags
        if (filters.tags && filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some(tag => 
            media.tags?.some(mediaTag => 
              mediaTag.toLowerCase().includes(tag.toLowerCase())
            )
          );
          if (!hasMatchingTag) return false;
        }
        
        // Simple text search in title, description, alt, and filename
        const searchText = query.toLowerCase();
        return (
          media.title?.toLowerCase().includes(searchText) ||
          media.description?.toLowerCase().includes(searchText) ||
          media.alt?.toLowerCase().includes(searchText) ||
          media.fileName.toLowerCase().includes(searchText) ||
          media.originalName.toLowerCase().includes(searchText)
        );
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    return allMedia;
  }

  /**
   * Validate file type
   */
  private validateFileType(mimeType: string): void {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo'
    ];

    if (!allowedTypes.includes(mimeType)) {
      throw new Error(
        `Unsupported file type: ${mimeType}. Allowed types: ${allowedTypes.join(', ')}`
      );
    }
  }
}

export const mediaStorage = new InMemoryMediaStorage();
export default mediaStorage;
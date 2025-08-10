import { 
  mediaFiles, 
  productMedia, 
  mediaCollections, 
  mediaCollectionItems,
  mediaTransformations,
  products,
  type MediaFile,
  type ProductMedia,
  type MediaCollection,
  type InsertMediaFile,
  type InsertProductMedia,
  type InsertMediaCollection
} from '@shared/schema';
import { storage } from '../storage';
import { eq, and, desc, inArray, sql } from 'drizzle-orm';
import { cloudinaryService, type CloudinaryUploadResult } from './cloudinary';

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

class MediaService {
  /**
   * Upload media file to Cloudinary and save metadata to database
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

      // Prepare media file data
      const mediaFileData: InsertMediaFile = {
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinarySecureUrl: cloudinaryResult.secure_url,
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
        transformationUrl,
        alt: options.alt,
        title: options.title,
        description: options.description,
        tags: options.tags,
        isPrimary: options.isPrimary || false,
        isActive: true,
        uploadedBy: userId,
        metadata: {
          cloudinaryVersion: cloudinaryResult.version,
          cloudinaryCreatedAt: cloudinaryResult.created_at,
          resourceType: cloudinaryResult.resource_type,
          url: cloudinaryResult.url
        }
      };

      // Insert media file record
      const [mediaFile] = await db
        .insert(mediaFiles)
        .values(mediaFileData)
        .returning();

      // If this is for a product, create product-media association
      if (options.productId) {
        // If this should be primary, unset other primary media for this product
        if (options.isPrimary) {
          await db
            .update(productMedia)
            .set({ isPrimary: false })
            .where(eq(productMedia.productId, options.productId));
        }

        const productMediaData: InsertProductMedia = {
          productId: options.productId,
          mediaId: mediaFile.id,
          variantId: options.variantId,
          isPrimary: options.isPrimary || false,
          displayOrder: await this.getNextDisplayOrder(options.productId)
        };

        await db.insert(productMedia).values(productMediaData);
      }

      // If collection ID provided, add to collection
      if (options.collectionId) {
        await db.insert(mediaCollectionItems).values({
          collectionId: options.collectionId,
          mediaId: mediaFile.id,
          displayOrder: await this.getNextCollectionDisplayOrder(options.collectionId)
        });
      }

      // Generate common transformations
      await this.generateCommonTransformations(mediaFile.id, cloudinaryResult.public_id, resourceType);

      return {
        id: mediaFile.id,
        cloudinaryPublicId: mediaFile.cloudinaryPublicId,
        cloudinarySecureUrl: mediaFile.cloudinarySecureUrl,
        transformationUrl: mediaFile.transformationUrl,
        originalName: mediaFile.originalName,
        fileName: mediaFile.fileName,
        mimeType: mediaFile.mimeType,
        fileSize: mediaFile.fileSize,
        width: mediaFile.width,
        height: mediaFile.height,
        duration: mediaFile.duration,
        mediaType: mediaFile.mediaType,
        context: mediaFile.context,
        format: mediaFile.format,
        alt: mediaFile.alt,
        title: mediaFile.title,
        description: mediaFile.description,
        tags: mediaFile.tags as string[],
        isPrimary: mediaFile.isPrimary,
        isActive: mediaFile.isActive,
        uploadedBy: mediaFile.uploadedBy,
        createdAt: mediaFile.createdAt!,
        updatedAt: mediaFile.updatedAt!
      };
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
    updates: Partial<Pick<InsertMediaFile, 'alt' | 'title' | 'description' | 'tags' | 'isPrimary' | 'isActive'>>
  ): Promise<MediaMetadata> {
    try {
      const [updatedMedia] = await db
        .update(mediaFiles)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(mediaFiles.id, mediaId))
        .returning();

      if (!updatedMedia) {
        throw new Error('Media file not found');
      }

      // If setting as primary, unset other primary media for the same product
      if (updates.isPrimary) {
        const productMediaRecord = await db
          .select({ productId: productMedia.productId })
          .from(productMedia)
          .where(eq(productMedia.mediaId, mediaId))
          .limit(1);

        if (productMediaRecord[0]) {
          await db
            .update(productMedia)
            .set({ isPrimary: false })
            .where(
              and(
                eq(productMedia.productId, productMediaRecord[0].productId),
                eq(productMedia.mediaId, mediaId)
              )
            );

          await db
            .update(productMedia)
            .set({ isPrimary: true })
            .where(eq(productMedia.mediaId, mediaId));
        }
      }

      return this.formatMediaMetadata(updatedMedia);
    } catch (error) {
      console.error('Media update error:', error);
      throw new Error(`Failed to update media: ${error}`);
    }
  }

  /**
   * Delete media file from both Cloudinary and database
   */
  async deleteMedia(mediaId: string): Promise<void> {
    try {
      // Get media file details
      const [mediaFile] = await db
        .select()
        .from(mediaFiles)
        .where(eq(mediaFiles.id, mediaId))
        .limit(1);

      if (!mediaFile) {
        throw new Error('Media file not found');
      }

      // Delete from Cloudinary first
      await cloudinaryService.deleteFile(
        mediaFile.cloudinaryPublicId,
        mediaFile.mediaType
      );

      // Delete transformations
      await db
        .delete(mediaTransformations)
        .where(eq(mediaTransformations.mediaId, mediaId));

      // Delete product-media associations
      await db
        .delete(productMedia)
        .where(eq(productMedia.mediaId, mediaId));

      // Delete collection associations
      await db
        .delete(mediaCollectionItems)
        .where(eq(mediaCollectionItems.mediaId, mediaId));

      // Delete media file record
      await db
        .delete(mediaFiles)
        .where(eq(mediaFiles.id, mediaId));

    } catch (error) {
      console.error('Media deletion error:', error);
      throw new Error(`Failed to delete media: ${error}`);
    }
  }

  /**
   * Get media files by product ID
   */
  async getProductMedia(productId: string): Promise<MediaMetadata[]> {
    try {
      const result = await db
        .select({
          media: mediaFiles,
          productMedia: productMedia
        })
        .from(mediaFiles)
        .innerJoin(productMedia, eq(mediaFiles.id, productMedia.mediaId))
        .where(eq(productMedia.productId, productId))
        .orderBy(desc(productMedia.isPrimary), productMedia.displayOrder);

      return result.map(row => this.formatMediaMetadata(row.media));
    } catch (error) {
      console.error('Get product media error:', error);
      throw new Error(`Failed to get product media: ${error}`);
    }
  }

  /**
   * Get media files by context
   */
  async getMediaByContext(context: string, limit = 50, offset = 0): Promise<MediaMetadata[]> {
    try {
      const result = await db
        .select()
        .from(mediaFiles)
        .where(and(
          eq(mediaFiles.context, context),
          eq(mediaFiles.isActive, true)
        ))
        .orderBy(desc(mediaFiles.createdAt))
        .limit(limit)
        .offset(offset);

      return result.map(media => this.formatMediaMetadata(media));
    } catch (error) {
      console.error('Get media by context error:', error);
      throw new Error(`Failed to get media by context: ${error}`);
    }
  }

  /**
   * Get primary media for a product
   */
  async getPrimaryProductMedia(productId: string): Promise<MediaMetadata | null> {
    try {
      const result = await db
        .select({ media: mediaFiles })
        .from(mediaFiles)
        .innerJoin(productMedia, eq(mediaFiles.id, productMedia.mediaId))
        .where(
          and(
            eq(productMedia.productId, productId),
            eq(productMedia.isPrimary, true),
            eq(mediaFiles.isActive, true)
          )
        )
        .limit(1);

      return result[0] ? this.formatMediaMetadata(result[0].media) : null;
    } catch (error) {
      console.error('Get primary product media error:', error);
      throw new Error(`Failed to get primary product media: ${error}`);
    }
  }

  /**
   * Create media collection
   */
  async createCollection(data: InsertMediaCollection): Promise<MediaCollection> {
    try {
      const [collection] = await db
        .insert(mediaCollections)
        .values(data)
        .returning();

      return collection;
    } catch (error) {
      console.error('Create collection error:', error);
      throw new Error(`Failed to create collection: ${error}`);
    }
  }

  /**
   * Get media collection with items
   */
  async getCollection(collectionId: string): Promise<{
    collection: MediaCollection;
    media: MediaMetadata[];
  }> {
    try {
      const [collection] = await db
        .select()
        .from(mediaCollections)
        .where(eq(mediaCollections.id, collectionId))
        .limit(1);

      if (!collection) {
        throw new Error('Collection not found');
      }

      const mediaItems = await db
        .select({
          media: mediaFiles,
          item: mediaCollectionItems
        })
        .from(mediaFiles)
        .innerJoin(mediaCollectionItems, eq(mediaFiles.id, mediaCollectionItems.mediaId))
        .where(eq(mediaCollectionItems.collectionId, collectionId))
        .orderBy(mediaCollectionItems.displayOrder);

      return {
        collection,
        media: mediaItems.map(row => this.formatMediaMetadata(row.media))
      };
    } catch (error) {
      console.error('Get collection error:', error);
      throw new Error(`Failed to get collection: ${error}`);
    }
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
    try {
      let whereConditions: any[] = [eq(mediaFiles.isActive, true)];

      if (filters.context) {
        whereConditions.push(eq(mediaFiles.context, filters.context));
      }

      if (filters.mediaType) {
        whereConditions.push(eq(mediaFiles.mediaType, filters.mediaType));
      }

      // Note: For more complex text search, you might want to use full-text search
      // This is a simple implementation
      const result = await db
        .select()
        .from(mediaFiles)
        .where(and(...whereConditions))
        .orderBy(desc(mediaFiles.createdAt))
        .limit(limit)
        .offset(offset);

      return result.map(media => this.formatMediaMetadata(media));
    } catch (error) {
      console.error('Search media error:', error);
      throw new Error(`Failed to search media: ${error}`);
    }
  }

  /**
   * Get transformation URL for media
   */
  async getTransformationUrl(
    mediaId: string,
    transformationName: string
  ): Promise<string | null> {
    try {
      const [transformation] = await db
        .select()
        .from(mediaTransformations)
        .where(
          and(
            eq(mediaTransformations.mediaId, mediaId),
            eq(mediaTransformations.name, transformationName)
          )
        )
        .limit(1);

      return transformation?.url || null;
    } catch (error) {
      console.error('Get transformation URL error:', error);
      return null;
    }
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

  /**
   * Get next display order for product media
   */
  private async getNextDisplayOrder(productId: string): Promise<number> {
    const result = await db
      .select({ maxOrder: productMedia.displayOrder })
      .from(productMedia)
      .where(eq(productMedia.productId, productId))
      .orderBy(desc(productMedia.displayOrder))
      .limit(1);

    return (result[0]?.maxOrder || 0) + 1;
  }

  /**
   * Get next display order for collection items
   */
  private async getNextCollectionDisplayOrder(collectionId: string): Promise<number> {
    const result = await db
      .select({ maxOrder: mediaCollectionItems.displayOrder })
      .from(mediaCollectionItems)
      .where(eq(mediaCollectionItems.collectionId, collectionId))
      .orderBy(desc(mediaCollectionItems.displayOrder))
      .limit(1);

    return (result[0]?.maxOrder || 0) + 1;
  }

  /**
   * Generate common transformations for media
   */
  private async generateCommonTransformations(
    mediaId: string,
    publicId: string,
    resourceType: 'image' | 'video'
  ): Promise<void> {
    const transformations = resourceType === 'image' 
      ? [
          { name: 'thumbnail', width: 150, height: 150, crop: 'fill' },
          { name: 'card', width: 400, height: 300, crop: 'fill' },
          { name: 'hero', width: 1200, height: 600, crop: 'fill' },
          { name: 'gallery', width: 800, height: 800, crop: 'fit' }
        ]
      : [
          { name: 'thumbnail', width: 300, height: 200 },
          { name: 'preview', width: 600, height: 400 }
        ];

    for (const transform of transformations) {
      const url = resourceType === 'image'
        ? cloudinaryService.getResponsiveImageUrl(publicId, transform)
        : cloudinaryService.getVideoThumbnail(publicId, transform);

      await db.insert(mediaTransformations).values({
        mediaId,
        name: transform.name,
        transformationString: JSON.stringify(transform),
        url,
        width: transform.width,
        height: transform.height,
        format: resourceType === 'image' ? 'webp' : 'jpg'
      });
    }
  }

  /**
   * Format media metadata for response
   */
  private formatMediaMetadata(media: any): MediaMetadata {
    return {
      id: media.id,
      cloudinaryPublicId: media.cloudinaryPublicId,
      cloudinarySecureUrl: media.cloudinarySecureUrl,
      transformationUrl: media.transformationUrl,
      originalName: media.originalName,
      fileName: media.fileName,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      width: media.width,
      height: media.height,
      duration: media.duration,
      mediaType: media.mediaType,
      context: media.context,
      format: media.format,
      alt: media.alt,
      title: media.title,
      description: media.description,
      tags: media.tags as string[] || [],
      isPrimary: media.isPrimary,
      isActive: media.isActive,
      uploadedBy: media.uploadedBy,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt
    };
  }
}

export const mediaService = new MediaService();
export default mediaService;
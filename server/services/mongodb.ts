import mongoose from 'mongoose';
import { MediaMetadata } from './media-storage';

// MongoDB connection singleton
class MongoDBService {
  private static instance: MongoDBService;
  private isConnected = false;

  private constructor() {}

  static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        console.warn('MONGODB_URI not provided, skipping MongoDB connection');
        return;
      }

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
      });

      this.isConnected = true;
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('MongoDB disconnected');
    }
  }

  isMongoConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// MongoDB schemas
const MediaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  cloudinaryPublicId: { type: String, required: true },
  cloudinarySecureUrl: { type: String, required: true },
  transformationUrl: String,
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  width: Number,
  height: Number,
  duration: Number,
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  context: { type: String, required: true },
  format: { type: String, required: true },
  alt: String,
  title: String,
  description: String,
  tags: [String],
  isPrimary: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  uploadedBy: String,
  productId: String,
  variantId: String,
  collectionId: String
}, {
  timestamps: true
});

const ProductMediaSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  mediaId: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Create indexes for better performance
MediaSchema.index({ cloudinaryPublicId: 1 });
MediaSchema.index({ context: 1, isActive: 1 });
MediaSchema.index({ productId: 1, isPrimary: 1 });
MediaSchema.index({ mediaType: 1, isActive: 1 });
MediaSchema.index({ tags: 1 });

ProductMediaSchema.index({ productId: 1, isPrimary: 1 });
ProductMediaSchema.index({ mediaId: 1 });

export const MediaModel = mongoose.model('Media', MediaSchema);
export const ProductMediaModel = mongoose.model('ProductMedia', ProductMediaSchema);

// MongoDB operations
export class MongoMediaStorage {
  private mongoService = MongoDBService.getInstance();

  async ensureConnection(): Promise<boolean> {
    try {
      await this.mongoService.connect();
      return this.mongoService.isMongoConnected();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      return false;
    }
  }

  async saveMedia(media: MediaMetadata): Promise<void> {
    if (!(await this.ensureConnection())) return;

    try {
      // Save media metadata
      await MediaModel.findOneAndUpdate(
        { id: media.id },
        { 
          ...media,
          createdAt: media.createdAt,
          updatedAt: media.updatedAt
        },
        { upsert: true, new: true }
      );

      // If associated with a product, save the relationship
      if (media.productId) {
        await ProductMediaModel.findOneAndUpdate(
          { productId: media.productId, mediaId: media.id },
          {
            productId: media.productId,
            mediaId: media.id,
            isPrimary: media.isPrimary,
            sortOrder: 0
          },
          { upsert: true, new: true }
        );

        // If this is set as primary, unset other primary media for the same product
        if (media.isPrimary) {
          await ProductMediaModel.updateMany(
            { 
              productId: media.productId, 
              mediaId: { $ne: media.id } 
            },
            { isPrimary: false }
          );
        }
      }

      console.log(`Media saved to MongoDB: ${media.id}`);
    } catch (error) {
      console.error('Failed to save media to MongoDB:', error);
      throw error;
    }
  }

  async updateMedia(mediaId: string, updates: Partial<MediaMetadata>): Promise<MediaMetadata | null> {
    if (!(await this.ensureConnection())) return null;

    try {
      const updatedMedia = await MediaModel.findOneAndUpdate(
        { id: mediaId },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );

      if (updatedMedia && updates.isPrimary !== undefined) {
        // Update product media relationship
        await ProductMediaModel.findOneAndUpdate(
          { mediaId },
          { isPrimary: updates.isPrimary },
          { new: true }
        );

        // If setting as primary, unset others
        if (updates.isPrimary && updatedMedia.productId) {
          await ProductMediaModel.updateMany(
            { 
              productId: updatedMedia.productId, 
              mediaId: { $ne: mediaId } 
            },
            { isPrimary: false }
          );
        }
      }

      return updatedMedia ? this.mongoToMediaMetadata(updatedMedia) : null;
    } catch (error) {
      console.error('Failed to update media in MongoDB:', error);
      return null;
    }
  }

  async deleteMedia(mediaId: string): Promise<void> {
    if (!(await this.ensureConnection())) return;

    try {
      await MediaModel.deleteOne({ id: mediaId });
      await ProductMediaModel.deleteMany({ mediaId });
      console.log(`Media deleted from MongoDB: ${mediaId}`);
    } catch (error) {
      console.error('Failed to delete media from MongoDB:', error);
      throw error;
    }
  }

  async getMediaById(mediaId: string): Promise<MediaMetadata | null> {
    if (!(await this.ensureConnection())) return null;

    try {
      const media = await MediaModel.findOne({ id: mediaId });
      return media ? this.mongoToMediaMetadata(media) : null;
    } catch (error) {
      console.error('Failed to get media from MongoDB:', error);
      return null;
    }
  }

  async getProductMedia(productId: string): Promise<MediaMetadata[]> {
    if (!(await this.ensureConnection())) return [];

    try {
      const productMediaRelations = await ProductMediaModel
        .find({ productId })
        .sort({ isPrimary: -1, sortOrder: 1, createdAt: -1 });

      const mediaIds = productMediaRelations.map(rel => rel.mediaId);
      const mediaItems = await MediaModel.find({ 
        id: { $in: mediaIds },
        isActive: true 
      });

      // Sort according to the product media relations order
      const sortedMedia = mediaIds
        .map(id => mediaItems.find(media => media.id === id))
        .filter(Boolean)
        .map(media => this.mongoToMediaMetadata(media!));

      return sortedMedia;
    } catch (error) {
      console.error('Failed to get product media from MongoDB:', error);
      return [];
    }
  }

  async getPrimaryProductMedia(productId: string): Promise<MediaMetadata | null> {
    if (!(await this.ensureConnection())) return null;

    try {
      const primaryRelation = await ProductMediaModel.findOne({ 
        productId, 
        isPrimary: true 
      });

      if (!primaryRelation) return null;

      const media = await MediaModel.findOne({ 
        id: primaryRelation.mediaId,
        isActive: true 
      });

      return media ? this.mongoToMediaMetadata(media) : null;
    } catch (error) {
      console.error('Failed to get primary product media from MongoDB:', error);
      return null;
    }
  }

  async getMediaByContext(context: string, limit = 50, offset = 0): Promise<MediaMetadata[]> {
    if (!(await this.ensureConnection())) return [];

    try {
      const mediaItems = await MediaModel
        .find({ context, isActive: true })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      return mediaItems.map(media => this.mongoToMediaMetadata(media));
    } catch (error) {
      console.error('Failed to get media by context from MongoDB:', error);
      return [];
    }
  }

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
    if (!(await this.ensureConnection())) return [];

    try {
      const searchQuery: any = {
        isActive: true,
        $text: { $search: query }
      };

      if (filters.context) {
        searchQuery.context = filters.context;
      }

      if (filters.mediaType) {
        searchQuery.mediaType = filters.mediaType;
      }

      if (filters.tags && filters.tags.length > 0) {
        searchQuery.tags = { $in: filters.tags };
      }

      const mediaItems = await MediaModel
        .find(searchQuery)
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .skip(offset)
        .limit(limit);

      return mediaItems.map(media => this.mongoToMediaMetadata(media));
    } catch (error) {
      console.error('Failed to search media in MongoDB:', error);
      return [];
    }
  }

  private mongoToMediaMetadata(mongoDoc: any): MediaMetadata {
    return {
      id: mongoDoc.id,
      cloudinaryPublicId: mongoDoc.cloudinaryPublicId,
      cloudinarySecureUrl: mongoDoc.cloudinarySecureUrl,
      transformationUrl: mongoDoc.transformationUrl,
      originalName: mongoDoc.originalName,
      fileName: mongoDoc.fileName,
      mimeType: mongoDoc.mimeType,
      fileSize: mongoDoc.fileSize,
      width: mongoDoc.width,
      height: mongoDoc.height,
      duration: mongoDoc.duration,
      mediaType: mongoDoc.mediaType,
      context: mongoDoc.context,
      format: mongoDoc.format,
      alt: mongoDoc.alt,
      title: mongoDoc.title,
      description: mongoDoc.description,
      tags: mongoDoc.tags || [],
      isPrimary: mongoDoc.isPrimary,
      isActive: mongoDoc.isActive,
      uploadedBy: mongoDoc.uploadedBy,
      createdAt: mongoDoc.createdAt,
      updatedAt: mongoDoc.updatedAt
    };
  }
}

export const mongoMediaStorage = new MongoMediaStorage();
export const mongoService = MongoDBService.getInstance();
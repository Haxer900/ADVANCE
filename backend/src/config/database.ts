import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/morethanfashion';
    
    await mongoose.connect(mongoURI, {
      // Modern Mongoose doesn't need these options anymore
      // useNewUrlParser and useUnifiedTopology are deprecated
    });

    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('💤 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    // Fallback to in-memory storage for development
    console.log('🔄 Falling back to in-memory storage for development...');
  }
};

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};
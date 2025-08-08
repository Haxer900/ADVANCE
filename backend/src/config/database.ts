import { MongoClient, Db } from 'mongodb';

let db: Db;
let client: MongoClient;

export const connectMongoDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME || 'zenthra';

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('🔄 Connecting to MongoDB Atlas...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    db = client.db(DB_NAME);
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`📊 Database: ${DB_NAME}`);
    
    // Test the connection
    await db.admin().ping();
    console.log('🏓 Database ping successful');

  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectMongoDB first.');
  }
  return db;
};

export const closeConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('📴 MongoDB Atlas connection closed');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});
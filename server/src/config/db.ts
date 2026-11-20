import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memServer: any = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to configured MongoDB URI...');
      await mongoose.connect(uri);
      console.log('✓ Successfully connected to MongoDB.');
      return;
    } catch (err) {
      console.warn('Configured MongoDB connection failed. Falling back to embedded memory database.', err);
    }
  }

  try {
    console.log('Initializing embedded MongoDB Memory Server for zero-dependency local execution...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memServer = await MongoMemoryServer.create();
    const memUri = memServer.getUri();
    await mongoose.connect(memUri);
    console.log('✓ Successfully connected to embedded MongoDB Memory Server.');
  } catch (error) {
    console.error('Fatal error connecting to database:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memServer) {
    await memServer.stop();
  }
};

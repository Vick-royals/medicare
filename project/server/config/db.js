import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let connectionString = process.env.MONGODB_URI;
    
    // Try to connect to MongoDB Atlas first
    if (connectionString) {
      try {
        const conn = await mongoose.connect(connectionString);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return;
      } catch (error) {
        console.log(`MongoDB Atlas connection failed: ${error.message}`);
        console.log('Falling back to in-memory MongoDB...');
      }
    }
    
    // Fall back to in-memory MongoDB with longer timeout
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'health-app',
      },
      binary: {
        version: '6.0.6',
      },
    });
    connectionString = mongod.getUri();
    console.log('In-memory MongoDB URI:', connectionString);
    const conn = await mongoose.connect(connectionString);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

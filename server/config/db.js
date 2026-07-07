import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const conn = await mongoose.connect(connectionString);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

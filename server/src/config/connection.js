import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://db:27017/enigma",
  },
  server: {
    port: process.env.PORT || 3001,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_default_secret',
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 30000,
      maxPoolSize: 10,
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected Successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    return false;
  }
  return true;
};

export { config, connectDB as default };


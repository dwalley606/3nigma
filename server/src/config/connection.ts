import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  mongodb: {
    uri: string;
  };
  server: {
    port: number;
  };
  jwt: {
    secret: string;
  };
}

const config: Config = {
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://db:27017/enigma",
  },
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_default_secret',
  }
};

const connectDB = async (): Promise<boolean> => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 30000,
      maxPoolSize: 10,
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected Successfully');
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', (err as Error).message);
    return false;
  }
  return true;
};

export { config, connectDB as default };


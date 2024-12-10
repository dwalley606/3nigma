import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var __MONGOD__: MongoMemoryServer;
}

// Store original env
const originalEnv = process.env;

beforeAll(async () => {
  // Set up test environment variables
  process.env = {
    ...originalEnv,
    JWT_SECRET: 'test_secret_key_for_tests',
    NODE_ENV: 'test'
  };

  // Set up MongoDB memory server
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  global.__MONGOD__ = mongod;

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Cleanup MongoDB
  await mongoose.disconnect();
  await global.__MONGOD__.stop();

  // Restore original env
  process.env = originalEnv;
});

beforeEach(async () => {
  if (!mongoose.connection.db) {
    throw new Error('Database not connected');
  }
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}); 
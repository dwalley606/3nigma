import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var __MONGOD__: MongoMemoryServer;
}

beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  global.__MONGOD__ = mongod;

  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await global.__MONGOD__.stop();
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
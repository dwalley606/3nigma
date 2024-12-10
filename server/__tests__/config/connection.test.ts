import mongoose from 'mongoose';
import connectDB from '../../src/config/connection';

afterAll(async () => {
  await mongoose.disconnect();
});

test('should connect to MongoDB successfully', async () => {
  // Assume the connection is already established by setup.ts
  expect(mongoose.connection.readyState).toBe(1); // 1 means connected
});

test('should handle connection errors', async () => {
  // Temporarily override the MONGODB_URI to simulate a connection error
  const originalUri = process.env.MONGODB_URI;
  process.env.MONGODB_URI = 'invalid_uri';

  const isConnected = await connectDB();
  expect(isConnected).toBe(false);

  // Restore the original URI
  process.env.MONGODB_URI = originalUri;
}); 
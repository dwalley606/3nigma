import mongoose from 'mongoose';
import seedDatabase from '../../src/config/seeds';
import User from '../../src/models/User';
import Group from '../../src/models/Group';
import Message from '../../src/models/Message';
import Conversation from '../../src/models/Conversation';

beforeEach(async () => {
  if (mongoose.connection.readyState !== 1) { // 1 means connected
    throw new Error('Database not connected');
  }

  const collections = await mongoose.connection.db!.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

test('should seed the database successfully', async () => {
  await seedDatabase();

  const usersCount = await User.countDocuments();
  const groupsCount = await Group.countDocuments();
  const messagesCount = await Message.countDocuments();
  const conversationsCount = await Conversation.countDocuments();

  expect(usersCount).toBe(10); // Assuming you seed 10 users
  expect(groupsCount).toBeGreaterThan(0); // Check if at least one group is created
  expect(messagesCount).toBeGreaterThan(0); // Check if messages are created
  expect(conversationsCount).toBeGreaterThan(0); // Check if conversations are created
}); 
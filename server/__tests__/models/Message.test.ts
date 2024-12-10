import mongoose from 'mongoose';
import Message, { IMessage } from '../../src/models/Message';
import User from '../../src/models/User'; // Assuming you have a User model
import Group from '../../src/models/Group'; // Assuming you have a Group model

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Message Model Test', () => {
  it('should create & save a message successfully', async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });
    const group = await Group.create({ name: 'Test Group', members: [user._id], admins: [user._id] });

    const validMessage: IMessage = new Message({
      content: 'Hello, World!',
      sender: user._id as mongoose.Types.ObjectId,
      userRecipientId: user._id as mongoose.Types.ObjectId,
      isGroupMessage: false,
    });
    const savedMessage = await validMessage.save() as IMessage;

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.content).toBe(validMessage.content);
    expect(savedMessage.sender.toString()).toBe(user._id.toString());
    expect(savedMessage.userRecipientId?.toString()).toBe(user._id.toString());
    expect(savedMessage.isGroupMessage).toBe(false);
  });

  it('should fail to create a message without required fields', async () => {
    const messageWithoutRequiredField = new Message({});
    let err: mongoose.Error.ValidationError | undefined;
    try {
      await messageWithoutRequiredField.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      }
    }
    expect(err).toBeDefined();
    expect(err!.errors.content).toBeDefined();
    expect(err!.errors.sender).toBeDefined();
  });

  it('should update a message successfully', async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });
    const message = await Message.create({
      content: 'Initial Message',
      sender: user._id as mongoose.Types.ObjectId,
      isGroupMessage: false,
    });

    message.content = 'Updated Message';
    const updatedMessage = await message.save();

    expect(updatedMessage.content).toBe('Updated Message');
  });

  it('should delete a message successfully', async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'testpassword' });
    const message = await Message.create({
      content: 'Message to Delete',
      sender: user._id as mongoose.Types.ObjectId,
      isGroupMessage: false,
    });

    await Message.findByIdAndDelete(message._id);
    const deletedMessage = await Message.findById(message._id);

    expect(deletedMessage).toBeNull();
  });
}); 
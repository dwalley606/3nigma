import mongoose from 'mongoose';
import Conversation from '../../src/models/Conversation';

describe('Conversation Model', () => {
  test('should create a direct message conversation with valid fields', async () => {
    const participant1 = new mongoose.Types.ObjectId();
    const participant2 = new mongoose.Types.ObjectId();

    const conversation = new Conversation({
      participants: [participant1, participant2],
      isGroup: false,
      unreadCount: 0
    });

    const savedConversation = await conversation.save();
    
    expect(savedConversation._id).toBeDefined();
    expect(savedConversation.participants).toHaveLength(2);
    expect(savedConversation.participants[0].toString()).toBe(participant1.toString());
    expect(savedConversation.isGroup).toBe(false);
    expect(savedConversation.unreadCount).toBe(0);
    expect(savedConversation.messages).toHaveLength(0);
  });

  test('should create a group conversation with valid fields', async () => {
    const groupId = new mongoose.Types.ObjectId();
    const participants = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ];

    const conversation = new Conversation({
      participants,
      isGroup: true,
      name: 'Test Group',
      groupId,
      unreadCount: 0
    });

    const savedConversation = await conversation.save();
    
    expect(savedConversation._id).toBeDefined();
    expect(savedConversation.participants).toHaveLength(3);
    expect(savedConversation.isGroup).toBe(true);
    expect(savedConversation.name).toBe('Test Group');
    expect(savedConversation.groupId).toBeDefined();
    expect(savedConversation.groupId!.toString()).toBe(groupId.toString());
  });

  test('should fail without required participants', async () => {
    const conversation = new Conversation({
      isGroup: false,
      unreadCount: 0
    });

    await expect(conversation.save()).rejects.toThrow();
  });

  test('should update last message', async () => {
    const participants = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ];
    const messageId = new mongoose.Types.ObjectId();

    const conversation = await Conversation.create({
      participants,
      isGroup: false
    });

    conversation.lastMessage = messageId;
    const updatedConversation = await conversation.save();
    
    expect(updatedConversation.lastMessage?.toString()).toBe(messageId.toString());
  });

  test('should update unread count', async () => {
    const participants = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ];

    const conversation = await Conversation.create({
      participants,
      isGroup: false,
      unreadCount: 0
    });

    conversation.unreadCount = 5;
    const updatedConversation = await conversation.save();
    
    expect(updatedConversation.unreadCount).toBe(5);
  });

  test('should add message to conversation', async () => {
    const participants = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ];
    const messageId = new mongoose.Types.ObjectId();

    const conversation = await Conversation.create({
      participants,
      isGroup: false
    });

    conversation.messages.push(messageId);
    const updatedConversation = await conversation.save();
    
    expect(updatedConversation.messages).toHaveLength(1);
    expect(updatedConversation.messages[0].toString()).toBe(messageId.toString());
  });
}); 
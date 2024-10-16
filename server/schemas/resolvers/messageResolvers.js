import Message from '../../models/Message.js';

export const messageResolvers = {
  Query: {
    getMessages: async (_, { senderId, recipientId }) => {
      const messages = await Message.find({
        $or: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      });

      return messages.map((msg) => ({
        id: msg._id.toString(),
        senderId: msg.senderId,
        recipientId: msg.recipientId,
        content: msg.content,
        timestamp: msg.timestamp,
      }));
    },
  },
  Mutation: {
    sendMessage: async (_, { senderId, recipientId, content, isGroupMessage }) => {
      const newMessage = new Message({
        senderId,
        recipientId,
        content,
        isGroupMessage,
        timestamp: new Date().toISOString(),
      });
      return await newMessage.save();
    },
    deleteMessage: async (_, { messageId, forEveryone }) => {
      try {
        if (forEveryone) {
          const deletedMessage = await Message.findByIdAndDelete(messageId);
          if (!deletedMessage) {
            throw new Error('Message not found');
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error deleting message:', error);
        throw new Error('Failed to delete message');
      }
    },
  },
};
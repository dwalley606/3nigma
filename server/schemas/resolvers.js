const Message = require('../models/Message');
const { encryptMessage, decryptMessage } = require('../utils/encryption');

const resolvers = {
  Query: {
    messages: async (_, { senderId, recipientId }) => {
      return await Message.find({ senderId, recipientId });
    },
  },
  Mutation: {
    sendMessage: async (_, { senderId, recipientId, content }) => {
      const encryptedContent = encryptMessage(content, recipientId); // Simplified
      const newMessage = new Message({
        senderId,
        recipientId,
        content: encryptedContent,
        timestamp: new Date().toISOString(),
      });
      await newMessage.save();
      return newMessage;
    },
  },
};

module.exports = resolvers;

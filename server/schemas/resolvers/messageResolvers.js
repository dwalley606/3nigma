import Message from "../../models/Message.js";
import User from "../../models/User.js";

export const messageResolvers = {
  Query: {
    getMessages: async (_, { recipientId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view messages.");
      }
      const messages = await Message.find({ recipientId });

      return messages.map((msg) => ({
        id: msg._id.toString(),
        senderId: msg.senderId,
        senderName: msg.senderName, // Ensure this is included
        recipientId: msg.recipientId,
        content: msg.content,
        timestamp: msg.timestamp,
        read: msg.read !== undefined ? msg.read : false,
        isGroupMessage: msg.isGroupMessage,
      }));
    },
    getConversation: async (_, { userId, otherUserId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view conversations.");
      }
      const messages = await Message.find({
        $or: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
      }).sort({ timestamp: 1 }); // Sort by timestamp

      return messages.map((msg) => ({
        id: msg._id.toString(),
        senderId: msg.senderId,
        senderName: msg.senderName,
        recipientId: msg.recipientId,
        content: msg.content,
        timestamp: msg.timestamp,
        read: msg.read !== undefined ? msg.read : false,
        isGroupMessage: msg.isGroupMessage,
      }));
    },
  },
  Mutation: {
    sendMessage: async (
      _,
      { senderId, recipientId, content, isGroupMessage },
      context
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to send messages.");
      }
      try {
        // Log the input parameters
        console.log("sendMessage called with:", {
          senderId,
          recipientId,
          content,
          isGroupMessage,
        });

        // Find the sender
        const sender = await User.findById(senderId);
        if (!sender) {
          console.error("Sender not found for ID:", senderId);
          throw new Error("Sender not found");
        }

        // Log the sender information
        console.log("Sender found:", sender);

        // Create a new message
        const newMessage = new Message({
          senderId,
          senderName: sender.username || "Unknown", // Ensure senderName is not null
          recipientId,
          content,
          isGroupMessage,
          read: false,
          timestamp: new Date().toISOString(),
        });

        // Save the message
        const savedMessage = await newMessage.save();

        // Log the saved message
        console.log("Message saved:", savedMessage);

        // Return the message with senderName included
        return {
          id: savedMessage._id.toString(),
          senderId: savedMessage.senderId,
          senderName: savedMessage.senderName, // Ensure this is returned
          recipientId: savedMessage.recipientId,
          content: savedMessage.content,
          timestamp: savedMessage.timestamp,
          read: savedMessage.read,
          isGroupMessage: savedMessage.isGroupMessage,
        };
      } catch (error) {
        console.error("Error in sendMessage:", error);
        throw new Error("Failed to send message");
      }
    },
    deleteMessage: async (_, { messageId, forEveryone }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to delete messages.");
      }
      try {
        if (forEveryone) {
          const deletedMessage = await Message.findByIdAndDelete(messageId);
          if (!deletedMessage) {
            throw new Error("Message not found");
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error deleting message:", error);
        throw new Error("Failed to delete message");
      }
    },
    markMessagesAsRead: async (_, { conversationId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to mark messages as read.");
      }
      await Message.updateMany(
        { conversationId, read: false },
        { $set: { read: true } }
      );
      return true;
    },
  },
};

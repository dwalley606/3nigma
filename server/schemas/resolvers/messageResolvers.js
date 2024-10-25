import Message from "../../models/Message.js";
import User from "../../models/User.js";
import Group from "../../models/Group.js"; // Ensure Group model is imported
import mongoose from "mongoose";

export const messageResolvers = {
  Query: {
    getAllMessages: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view messages.");
      }
      try {
        // Fetch direct messages
        const directMessages = await Message.find({
          recipientId: userId,
          isGroupMessage: false,
        });

        // Find groups where the user is a member
        const groups = await Group.find({ members: userId });
        const groupIds = groups.map((group) => group._id);

        // Fetch group messages
        const groupMessages = await Message.find({
          recipientId: { $in: groupIds },
          isGroupMessage: true,
        }).populate('recipientId', 'name'); // Populate group name

        // Combine direct and group messages
        const allMessages = [...directMessages, ...groupMessages];

        // Add groupName to group messages
        return allMessages.map(message => {
          const groupName = message.isGroupMessage && message.recipientId ? message.recipientId.name : null;
          return {
            ...message.toObject(),
            groupName
          };
        });
      } catch (error) {
        console.error("Error fetching all messages:", error);
        throw new Error("Failed to fetch all messages");
      }
    },
    getDirectMessages: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view messages.");
      }
      try {
        // Fetch direct messages where the user is the recipient
        const messages = await Message.find({
          recipientId: userId,
          isGroupMessage: false,
        });

        return messages;
      } catch (error) {
        console.error("Error fetching direct messages:", error);
        throw new Error("Failed to fetch direct messages");
      }
    },
    getGroupMessages: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view group messages.");
      }
      try {
        // Find groups where the user is a member
        const groups = await Group.find({ members: userId });
        const groupIds = groups.map((group) => group._id);

        // Fetch group messages for those groups
        const messages = await Message.find({
          recipientId: { $in: groupIds },
          isGroupMessage: true,
        });

        return messages;
      } catch (error) {
        console.error("Error fetching group messages:", error);
        throw new Error("Failed to fetch group messages");
      }
    },
    getConversation: async (_, { userId, otherUserId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view conversations.");
      }

      try {
        // Convert string IDs to ObjectId
        const userObjectId = mongoose.Types.ObjectId(userId);
        const otherUserObjectId = mongoose.Types.ObjectId(otherUserId);

        const messages = await Message.find({
          $or: [
            { senderId: userObjectId, recipientId: otherUserObjectId },
            { senderId: otherUserObjectId, recipientId: userObjectId },
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
      } catch (error) {
        console.error("Error fetching conversation:", error);
        throw new Error("Failed to fetch conversation");
      }
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

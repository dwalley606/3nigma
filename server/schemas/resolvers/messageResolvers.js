import Message from "../../models/Message.js";
import User from "../../models/User.js";
import Group from "../../models/Group.js";
import Conversation from "../../models/Conversation.js";
import mongoose from "mongoose";

export const messageResolvers = {
  Query: {
    getConversations: async (_, { userId }) => {
      try {
        const conversations = await Conversation.find({ participants: userId })
          .populate('participants', 'id username')
          .populate({
            path: 'messages',
            populate: {
              path: 'sender',
              select: 'id username',
            },
          })
          .populate({
            path: 'lastMessage',
            populate: {
              path: 'sender',
              select: 'id username',
            },
          });

        // Debugging: Log the populated conversations
        console.log("Populated Conversations:", JSON.stringify(conversations, null, 2));

        // Ensure IDs are strings and handle null participants
        return conversations.map(conversation => ({
          ...conversation.toObject(),
          id: conversation._id.toString(),
          participants: conversation.participants.map(participant => {
            if (!participant) {
              console.warn("Missing participant in conversation:", conversation._id);
              return null;
            }
            return {
              ...participant.toObject(),
              id: participant._id.toString(),
            };
          }),
          messages: conversation.messages.map(message => ({
            ...message.toObject(),
            id: message._id.toString(),
            sender: {
              ...message.sender.toObject(),
              id: message.sender._id.toString(),
            },
          })),
          lastMessage: conversation.lastMessage ? {
            ...conversation.lastMessage.toObject(),
            id: conversation.lastMessage._id.toString(),
            sender: conversation.lastMessage.sender ? {
              ...conversation.lastMessage.sender.toObject(),
              id: conversation.lastMessage.sender._id.toString(),
            } : null,
          } : null,
        }));
      } catch (error) {
        console.error("Error fetching conversations:", error.message);
        console.error("Stack trace:", error.stack);
        throw new Error("Failed to fetch conversations");
      }
    },

    getDirectMessages: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view messages.");
      }
      try {
        const messages = await Message.find({
          userRecipientId: userId,
          isGroupMessage: false,
        }).populate('sender', 'username');

        return messages;
      } catch (error) {
        console.error("Error fetching direct messages:", error);
        throw new Error("Failed to fetch direct messages");
      }
    },

    getGroupMessages: async (_, { groupId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view group messages.");
      }
      try {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
          throw new Error("Invalid group ID format");
        }

        const messages = await Message.find({
          groupRecipientId: groupId,
          isGroupMessage: true,
        }).populate('sender', 'username');

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
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
          throw new Error("Invalid user ID format");
        }

        const conversation = await Message.find({
          $or: [
            { senderId: userId, userRecipientId: otherUserId },
            { senderId: otherUserId, userRecipientId: userId },
          ],
        }).sort({ timestamp: 1 }).populate('sender', 'username');

        return conversation;
      } catch (error) {
        console.error("Error fetching conversation:", error);
        throw new Error("Failed to fetch conversation");
      }
    },
  },

  Mutation: {
    sendDirectMessage: async (_, { senderId, recipientId, content }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to send messages.");
      }
      try {
        const sender = await User.findById(senderId);
        if (!sender) {
          throw new Error("Sender not found");
        }

        const newMessage = new Message({
          sender: senderId,
          userRecipientId: recipientId,
          content,
          isGroupMessage: false,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        // Update the conversation with the new message
        await Conversation.findOneAndUpdate(
          { participants: { $all: [senderId, recipientId] } },
          { $set: { lastMessage: savedMessage._id }, $push: { messages: savedMessage._id } },
          { upsert: true, new: true }
        );

        return savedMessage;
      } catch (error) {
        console.error("Error in sendDirectMessage:", error);
        throw new Error("Failed to send direct message");
      }
    },

    sendGroupMessage: async (_, { senderId, groupId, content }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to send messages.");
      }
      try {
        const sender = await User.findById(senderId);
        if (!sender) {
          throw new Error("Sender not found");
        }

        const newMessage = new Message({
          sender: senderId,
          groupRecipientId: groupId,
          content,
          isGroupMessage: true,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        // Update the conversation with the new message
        await Conversation.findOneAndUpdate(
          { participants: groupId, isGroup: true },
          { $set: { lastMessage: savedMessage._id }, $push: { messages: savedMessage._id } },
          { upsert: true, new: true }
        );

        return savedMessage;
      } catch (error) {
        console.error("Error in sendGroupMessage:", error);
        throw new Error("Failed to send group message");
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
      try {
        await Message.updateMany(
          { conversationId, read: false },
          { $set: { read: true } }
        );
        return true;
      } catch (error) {
        console.error("Error marking messages as read:", error);
        throw new Error("Failed to mark messages as read");
      }
    },
  },
};

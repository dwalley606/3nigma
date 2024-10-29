import Message from "../../models/Message.js";
import User from "../../models/User.js";
import Group from "../../models/Group.js";
import Conversation from "../../models/Conversation.js";
import mongoose from "mongoose";

export const messageResolvers = {
  Query: {
    getConversations: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view conversations.");
      }
      try {
        const conversations = await Conversation.find({ participants: userId })
          .populate("participants", "id username")
          .populate({
            path: "messages",
            populate: {
              path: "sender",
              select: "id username",
            },
          })
          .populate({
            path: "lastMessage",
            populate: {
              path: "sender",
              select: "id username",
            },
          });

        // Ensure IDs are strings and handle null participants
        return conversations.map((conversation) => ({
          ...conversation.toObject(),
          id: conversation._id.toString(),
          participants: conversation.participants.map((participant) => {
            if (!participant) {
              console.warn(
                "Missing participant in conversation:",
                conversation._id
              );
              return null;
            }
            return {
              ...participant.toObject(),
              id: participant._id.toString(),
            };
          }),
          messages: conversation.messages.map((message) => ({
            ...message.toObject(),
            id: message._id.toString(),
            sender: {
              ...message.sender.toObject(),
              id: message.sender._id.toString(),
            },
          })),
          lastMessage: conversation.lastMessage
            ? {
                ...conversation.lastMessage.toObject(),
                id: conversation.lastMessage._id.toString(),
                sender: conversation.lastMessage.sender
                  ? {
                      ...conversation.lastMessage.sender.toObject(),
                      id: conversation.lastMessage.sender._id.toString(),
                    }
                  : null,
              }
            : null,
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
        }).populate("sender", "username");

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

        // Find messages that are group messages and belong to the specified groupId
        const messages = await Message.find({
          groupRecipientId: groupId,
          isGroupMessage: true,
        }).populate("sender", "id username");

        if (!messages.length) {
          throw new Error("No messages found for this group.");
        }

        // Map the messages to the desired structure
        return messages.map((message) => ({
          id: message._id.toString(),
          content: message.content,
          sender: {
            id: message.sender._id.toString(),
            username: message.sender.username,
          },
          timestamp: message.timestamp,
          isGroupMessage: message.isGroupMessage,
          groupRecipientId: message.groupRecipientId.toString(),
        }));
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
        if (
          !mongoose.Types.ObjectId.isValid(userId) ||
          !mongoose.Types.ObjectId.isValid(otherUserId)
        ) {
          throw new Error("Invalid user ID format");
        }

        const conversation = await Conversation.findOne({
          participants: { $all: [userId, otherUserId] },
          isGroup: false,
        })
          .populate({
            path: "messages",
            populate: {
              path: "sender",
              select: "id username",
            },
          })
          .exec();

        if (!conversation) {
          return []; // Return empty array if no conversation exists
        }

        return conversation.messages
          .map((message) => {
            if (!message) return null;

            return {
              id: message._id?.toString() || null,
              content: message.content || "",
              sender: message.sender
                ? {
                    id: message.sender._id?.toString() || null,
                    username: message.sender.username || "",
                  }
                : null,
              userRecipientId: message.userRecipientId?.toString() || null,
              timestamp: message.timestamp || null,
              read: message.read || false,
              isGroupMessage: message.isGroupMessage || false,
            };
          })
          .filter(Boolean); // Remove any null values
      } catch (error) {
        console.error("Error fetching conversation:", error);
        throw new Error("Failed to fetch conversation");
      }
    },
  },

  Mutation: {
    sendDirectMessage: async (_, { recipientId, content }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to send messages.");
      }

      try {
        const senderId = context.user.id;

        // Create the new message
        const newMessage = new Message({
          sender: senderId,
          userRecipientId: recipientId,
          content,
          isGroupMessage: false,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        // Find existing conversation or create a new one
        let conversation = await Conversation.findOne({
          participants: { $all: [senderId, recipientId] },
          isGroup: false,
        });

        if (!conversation) {
          conversation = new Conversation({
            participants: [senderId, recipientId],
            messages: [savedMessage._id],
            lastMessage: savedMessage._id,
            isGroup: false,
          });
        } else {
          conversation.messages.push(savedMessage._id);
          conversation.lastMessage = savedMessage._id;
        }

        await conversation.save();

        // Populate the sender information before returning
        await savedMessage.populate("sender", "id username");

        return {
          id: savedMessage._id.toString(),
          content: savedMessage.content,
          sender: {
            id: savedMessage.sender._id.toString(),
            username: savedMessage.sender.username,
          },
          userRecipientId: savedMessage.userRecipientId.toString(),
          timestamp: savedMessage.timestamp,
          read: savedMessage.read,
          isGroupMessage: savedMessage.isGroupMessage,
        };
      } catch (error) {
        console.error("Error in sendDirectMessage:", error);
        throw new Error("Failed to send direct message");
      }
    },

    sendGroupMessage: async (_, { groupId, content }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to send messages.");
      }

      try {
        const senderId = context.user.id;

        // Create the new message
        const newMessage = new Message({
          sender: senderId,
          groupRecipientId: groupId,
          content,
          isGroupMessage: true,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        // Update the conversation with the new message
        let conversation = await Conversation.findOne({
          participants: groupId,
          isGroup: true,
        });

        if (!conversation) {
          conversation = new Conversation({
            participants: [senderId], // Assuming groupId is an array of participant IDs
            messages: [savedMessage._id],
            lastMessage: savedMessage._id,
            isGroup: true,
          });
        } else {
          conversation.messages.push(savedMessage._id);
          conversation.lastMessage = savedMessage._id;
        }

        await conversation.save();

        // Populate the sender information before returning
        await savedMessage.populate("sender", "id username");

        return {
          id: savedMessage._id.toString(),
          content: savedMessage.content,
          sender: {
            id: savedMessage.sender._id.toString(),
            username: savedMessage.sender.username,
          },
          timestamp: savedMessage.timestamp,
          isGroupMessage: savedMessage.isGroupMessage,
        };
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

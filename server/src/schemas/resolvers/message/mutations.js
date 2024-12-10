import Message from "../../../models/Message.js";
import Conversation from "../../../models/Conversation.js";
import Group from "../../../models/Group.js";

export const messageMutations = {
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

      // Return a success message or the saved message
      return {
        success: true,
        message: savedMessage,
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

      // Find the group conversation by groupId
      let conversation = await Conversation.findOne({
        groupId: groupId, // Ensure you're using groupId to find the conversation
        isGroup: true,
      });

      if (!conversation) {
        // If no conversation is found, create a new one
        const group = await Group.findById(groupId);
        if (!group) {
          throw new Error("Group not found");
        }

        conversation = new Conversation({
          participants: group.members, // Assuming group.members is an array of user IDs
          messages: [savedMessage._id],
          lastMessage: savedMessage._id,
          isGroup: true,
          groupId: groupId,
        });
      } else {
        // Update the existing conversation
        conversation.messages.push(savedMessage._id);
        conversation.lastMessage = savedMessage._id;
      }
      await conversation.save();

      // Populate the sender information before returning
      await savedMessage.populate("sender", "id username");

      // Return a success message or the saved message
      return {
        success: true,
        message: {
          id: savedMessage._id.toString(),
          content: savedMessage.content,
          sender: {
            id: savedMessage.sender._id.toString(),
            username: savedMessage.sender.username,
          },
          timestamp: savedMessage.timestamp,
          isGroupMessage: savedMessage.isGroupMessage,
        },
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
};

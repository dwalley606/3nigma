import { IResolvers } from '@graphql-tools/utils';
import Message from "../../../models/Message.js";
import Conversation from "../../../models/Conversation.js";
import Group from "../../../models/Group.js";
import { AuthContext } from '../../../utils/auth.js';
import { Types } from 'mongoose';

interface SendDirectMessageArgs {
  recipientId: string;
  content: string;
}

interface SendGroupMessageArgs {
  groupId: string;
  content: string;
}

interface DeleteMessageArgs {
  messageId: string;
  forEveryone: boolean;
}

interface MarkMessagesAsReadArgs {
  conversationId: string;
}

interface PopulatedSender {
  _id: Types.ObjectId;
  username: string;
}

export const messageMutations: IResolvers = {
  Mutation: {
    sendDirectMessage: async (
      _: unknown,
      { recipientId, content }: SendDirectMessageArgs,
      context: AuthContext
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to send messages.");
      }

      try {
        const senderId = context.user.id;

        const newMessage = new Message({
          sender: senderId,
          userRecipientId: recipientId,
          content,
          isGroupMessage: false,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

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
          conversation.messages.push(savedMessage._id as Types.ObjectId);
          conversation.lastMessage = savedMessage._id as Types.ObjectId;
        }

        await conversation.save();
        await savedMessage.populate({
          path: "sender",
          select: "username"
        });

        return {
          success: true,
          message: {
            id: savedMessage._id.toString(),
            content: savedMessage.content,
            sender: {
              id: (savedMessage.sender as unknown as PopulatedSender)._id.toString(),
              username: (savedMessage.sender as unknown as PopulatedSender).username,
            },
            timestamp: savedMessage.timestamp,
            isGroupMessage: savedMessage.isGroupMessage,
          },
        };
      } catch (error) {
        console.error("Error in sendDirectMessage:", error);
        throw new Error("Failed to send direct message");
      }
    },

    sendGroupMessage: async (
      _: unknown,
      { groupId, content }: SendGroupMessageArgs,
      context: AuthContext
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to send messages.");
      }

      try {
        const senderId = context.user.id;

        const newMessage = new Message({
          sender: senderId,
          groupRecipientId: groupId,
          content,
          isGroupMessage: true,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        let conversation = await Conversation.findOne({
          groupId: groupId,
          isGroup: true,
        });

        if (!conversation) {
          const group = await Group.findById(groupId);
          if (!group) {
            throw new Error("Group not found");
          }

          conversation = new Conversation({
            participants: group.members,
            messages: [savedMessage._id],
            lastMessage: savedMessage._id,
            isGroup: true,
            groupId: groupId,
          });
        } else {
          conversation.messages.push(savedMessage._id as Types.ObjectId);
          conversation.lastMessage = savedMessage._id as Types.ObjectId;
        }
        await conversation.save();
        await savedMessage.populate("sender", "id username");

        return {
          success: true,
          message: {
            id: savedMessage._id.toString(),
            content: savedMessage.content,
            sender: {
              id: (savedMessage.sender as unknown as PopulatedSender)._id.toString(),
              username: (savedMessage.sender as unknown as PopulatedSender).username,
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

    deleteMessage: async (
      _: unknown,
      { messageId, forEveryone }: DeleteMessageArgs,
      context: AuthContext
    ) => {
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

    markMessagesAsRead: async (
      _: unknown,
      { conversationId }: MarkMessagesAsReadArgs,
      context: AuthContext
    ) => {
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

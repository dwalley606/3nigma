import { IResolvers } from '@graphql-tools/utils';
import mongoose from 'mongoose';
import Message from "../../../models/Message.js";
import Conversation from "../../../models/Conversation.js";
import { AuthContext } from '../../../utils/auth.js';
import { IUser } from "../../../models/User.js";
import { IMessage } from "../../../models/Message.js";

interface GetConversationsArgs {
  userId: string;
}

interface GetDirectMessagesArgs {
  userId: string;
}

interface GetGroupMessagesArgs {
  groupId: string;
}

export const messageQueries: IResolvers = {
  Query: {
    getConversations: async (
      _: unknown,
      { userId }: GetConversationsArgs,
      context: AuthContext
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to view conversations.");
      }
      try {
        const conversations = await Conversation.find({ participants: userId })
          .populate("participants", "username")
          .populate({
            path: "messages",
            populate: {
              path: "sender",
              select: "username",
            },
          })
          .populate({
            path: "lastMessage",
            populate: {
              path: "sender",
              select: "username",
            },
          })
          .populate("groupId");

        const sortedConversations = conversations.sort((a, b) => {
          const lastMessageA = a.lastMessage instanceof mongoose.Document
            ? new Date((a.lastMessage.toObject() as IMessage).timestamp).getTime()
            : 0;
          const lastMessageB = b.lastMessage instanceof mongoose.Document
            ? new Date((b.lastMessage.toObject() as IMessage).timestamp).getTime()
            : 0;
          return lastMessageB - lastMessageA;
        });

        return sortedConversations.map((conversation) => {
          const groupId =
            conversation.isGroup && conversation.groupId
              ? conversation.groupId._id.toString()
              : null;

          return {
            id: conversation._id.toString(),
            participants: conversation.participants.map((participant) => {
              if (participant instanceof mongoose.Document) {
                const user = participant.toObject() as IUser;
                return {
                  id: user._id.toString(),
                  username: user.username,
                };
              }
              return null;
            }).filter((participant) => participant !== null),
            messages: conversation.messages.map((message) => {
              if (message instanceof mongoose.Document) {
                const msg = message.toObject();
                return {
                  id: msg._id.toString(),
                  content: msg.content,
                  sender: msg.sender instanceof mongoose.Document ? {
                    id: msg.sender._id.toString(),
                    username: msg.sender.username,
                  } : null,
                  timestamp: msg.timestamp,
                };
              }
              return null;
            }).filter((message) => message !== null),
            lastMessage: conversation.lastMessage instanceof mongoose.Document
              ? {
                  id: conversation.lastMessage._id.toString(),
                  content: (conversation.lastMessage.toObject() as IMessage).content,
                  sender: (conversation.lastMessage.toObject() as IMessage & { sender: IUser }).sender ? {
                    id: (conversation.lastMessage.toObject() as IMessage & { sender: IUser }).sender._id.toString(),
                    username: (conversation.lastMessage.toObject() as IMessage & { sender: IUser }).sender.username,
                  } : null,
                  timestamp: (conversation.lastMessage.toObject() as IMessage).timestamp,
                }
              : null,
            isGroup: conversation.isGroup,
            groupId: groupId,
          };
        });
      } catch (error) {
        console.error("Error fetching conversations:", error);
        throw new Error("Failed to fetch conversations");
      }
    },

    getDirectMessages: async (
      _: unknown,
      { userId }: GetDirectMessagesArgs,
      context: AuthContext
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to view messages.");
      }
      try {
        const messages = await Message.find({
          userRecipientId: userId,
          isGroupMessage: false,
        }).populate("sender", "username");

        return messages.map((message) => ({
          id: message._id.toString(),
          content: message.content,
          sender: message.sender instanceof mongoose.Document ? {
            id: message.sender._id.toString(),
            username: (message.sender.toObject() as IUser).username,
          } : null,
          timestamp: message.timestamp,
        }));
      } catch (error) {
        console.error("Error fetching direct messages:", error);
        throw new Error("Failed to fetch direct messages");
      }
    },

    getGroupMessages: async (
      _: unknown,
      { groupId }: GetGroupMessagesArgs,
      context: AuthContext
    ) => {
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
        }).populate("sender", "username");

        return messages.map((message) => ({
          id: message._id.toString(),
          content: message.content,
          sender: message.sender instanceof mongoose.Document ? {
            id: message.sender._id.toString(),
            username: (message.sender.toObject() as IUser).username,
          } : null,
          timestamp: message.timestamp,
        }));
      } catch (error) {
        console.error("Error fetching group messages:", error);
        throw new Error("Failed to fetch group messages");
      }
    },
  },
};

import { IResolvers } from '@graphql-tools/utils';
import mongoose from 'mongoose';
import Message from "../../../models/Message.js";
import Conversation from "../../../models/Conversation.js";
import { Context } from '../../types'; // Assuming you have a Context type defined

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
      context: Context
    ) => {
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
          })
          .populate("groupId");

        const sortedConversations = conversations.sort((a, b) => {
          const lastMessageA = a.lastMessage
            ? new Date(a.lastMessage.timestamp).getTime()
            : 0;
          const lastMessageB = b.lastMessage
            ? new Date(b.lastMessage.timestamp).getTime()
            : 0;
          return lastMessageB - lastMessageA;
        });

        return sortedConversations.map((conversation) => {
          const groupId =
            conversation.isGroup && conversation.groupId
              ? conversation.groupId._id.toString()
              : null;

          return {
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
                  timestamp: conversation.lastMessage.timestamp,
                }
              : null,
            isGroup: conversation.isGroup,
            groupId: groupId,
          };
        });
      } catch (error) {
        console.error("Error fetching conversations:", error.message);
        console.error("Stack trace:", error.stack);
        throw new Error("Failed to fetch conversations");
      }
    },

    getDirectMessages: async (
      _: unknown,
      { userId }: GetDirectMessagesArgs,
      context: Context
    ) => {
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

    getGroupMessages: async (
      _: unknown,
      { groupId }: GetGroupMessagesArgs,
      context: Context
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
        }).populate("sender", "id username");

        if (!messages.length) {
          throw new Error("No messages found for this group.");
        }

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
  },
};

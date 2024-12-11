import mongoose from 'mongoose';
import { IResolvers } from '@graphql-tools/utils';
import Group from "../../../models/Group.js";
import User from "../../../models/User.js";
import Conversation from "../../../models/Conversation.js";
import { AuthContext } from '../../../utils/auth.js'; // Import the AuthContext type
import { IMessage } from "../../../models/Message.js";
import { IUser } from "../../../models/User.js"; // Assuming you have a User interface

interface GetGroupConversationsArgs {
  userId: string;
}

interface GetGroupDetailsArgs {
  userId: string;
}

export const groupQueries: IResolvers = {
  Query: {
    getGroupConversations: async (
      _: unknown,
      { userId }: GetGroupConversationsArgs,
      context: AuthContext // Use the context type
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to view group conversations.");
      }
      try {
        const conversations = await Conversation.find({
          isGroup: true,
          participants: userId,
        })
          .populate({
            path: "lastMessage",
            populate: { path: "sender", select: "username email" },
          })
          .sort({ "lastMessage.timestamp": -1 })
          .exec();

        return conversations.map((conversation) => {
          if (!conversation) {
            console.warn("Conversation is undefined");
            return null;
          }

          const lastMessage = conversation.lastMessage;

          if (!lastMessage || !(lastMessage instanceof mongoose.Document)) {
            console.warn("Last message is not populated");
            return null;
          }

          const message = lastMessage.toObject() as IMessage;

          const groupId = message.groupRecipientId;

          if (!groupId) {
            console.warn("No groupRecipientId found for conversation ID:", conversation._id);
            return null;
          }

          return {
            id: conversation._id ? conversation._id.toString() : null,
            lastMessage: {
              id: message._id ? message._id.toString() : null,
              content: message.content || "",
              sender: {
                id: message.sender ? message.sender._id.toString() : null,
                username: message.sender ? message.sender.username : null,
              },
              timestamp: message.timestamp,
              groupRecipientId: message.groupRecipientId,
            },
            createdAt: conversation.createdAt,
          };
        });
      } catch (error) {
        console.error("Error fetching group conversations:", error);
        throw new Error("Failed to fetch group conversations");
      }
    },

    getGroupDetails: async (
      _: unknown,
      { userId }: GetGroupDetailsArgs,
      context: AuthContext // Use the context type
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to view group details.");
      }
      try {
        const conversations = await Conversation.find({
          isGroup: true,
          participants: userId,
        })
          .populate({
            path: "lastMessage",
            populate: { path: "sender", select: "username email" },
          })
          .exec();

        console.log("Fetched conversations:", conversations);

        const groupsWithDetails = await Promise.all(
          conversations.map(async (conversation) => {
            if (!conversation) {
              console.warn("Conversation is null or undefined:", conversation);
              return null;
            }

            const lastMessage = conversation.lastMessage || null;
            const groupId = lastMessage ? lastMessage.groupRecipientId : null;

            if (!groupId) {
              console.warn(
                "No groupRecipientId found for conversation ID:",
                conversation._id
              );
              return null;
            }

            const group = await Group.findById(groupId)
              .populate("admins", "id username")
              .populate("members", "id username")
              .exec();

            if (!group) {
              console.warn("Group not found for group ID:", groupId);
              return null;
            }

            return {
              id: group._id.toString(),
              name: group.name,
              lastMessage: lastMessage || null,
              admins: group.admins,
              members: group.members,
              isGroup: true,
            };
          })
        );

        return groupsWithDetails.filter((group) => group !== null);
      } catch (error) {
        console.error("Error fetching group details:", error);
        throw new Error("Failed to fetch group details");
      }
    },
  },
};
  
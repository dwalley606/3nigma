import Group from "../../../models/Group.js";
import User from "../../../models/User.js";
import Conversation from "../../../models/Conversation.js";
import Message from "../../../models/Message.js";

export const groupQueries = {
    getGroupConversations: async (_, { userId }, context) => {
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
            populate: { path: "sender", select: "username email" }, // Populate sender details if needed
          })
          .sort({ "lastMessage.timestamp": -1 })
          .exec();

        return conversations.map((conversation) => {
          if (!conversation) {
            console.warn("Conversation is undefined");
            return null;
          }

          const lastMessage = conversation.lastMessage || null;

          return {
            id: conversation._id ? conversation._id.toString() : null,
            lastMessage: lastMessage
              ? {
                  id: lastMessage._id ? lastMessage._id.toString() : null,
                  content: lastMessage.content || "",
                  sender: {
                    id: lastMessage.sender
                      ? lastMessage.sender._id.toString()
                      : null,
                    username: lastMessage.sender
                      ? lastMessage.sender.username
                      : null,
                  },
                  timestamp: lastMessage.timestamp,
                  groupRecipientId: lastMessage.groupRecipientId, // Include groupRecipientId
                }
              : null,
            createdAt: conversation.createdAt,
          };
        });
      } catch (error) {
        console.error("Error fetching group conversations:", error);
        throw new Error("Failed to fetch group conversations");
      }
    },

    getGroupDetails: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view group details.");
      }
      try {
        // Fetch group conversations for the user
        const conversations = await Conversation.find({
          isGroup: true,
          participants: userId,
        })
          .populate({
            path: "lastMessage",
            populate: { path: "sender", select: "username email" }, // Populate sender details if needed
          })
          .exec();

        // Log the conversations to check if they are being fetched correctly
        console.log("Fetched conversations:", conversations);

        // Fetch group details including admins and members
        const groupsWithDetails = await Promise.all(
          conversations.map(async (conversation) => {
            if (!conversation) {
              console.warn("Conversation is null or undefined:", conversation);
              return null; // Skip this iteration if conversation is invalid
            }

            const lastMessage = conversation.lastMessage || null;
            const groupId = lastMessage ? lastMessage.groupRecipientId : null; // Use groupRecipientId

            if (!groupId) {
              console.warn(
                "No groupRecipientId found for conversation ID:",
                conversation._id
              );
              return null; // Skip if no group ID is found
            }

            // Fetch the group details from the Group model
            const group = await Group.findById(groupId)
              .populate("admins", "id username") // Populate admins with username
              .populate("members", "id username") // Populate members with username
              .exec();

            if (!group) {
              console.warn("Group not found for group ID:", groupId);
              return null; // Skip this iteration if group is not found
            }

            return {
              id: group._id.toString(),
              name: group.name,
              lastMessage: lastMessage || null, // Include lastMessage from the conversation
              admins: group.admins,
              members: group.members,
              isGroup: true, // Set isGroup to true for group conversations
            };
          })
        );

        // Filter out any null results from the mapping
        return groupsWithDetails.filter((group) => group !== null);
      } catch (error) {
        console.error("Error fetching group details:", error);
        throw new Error("Failed to fetch group details");
      }
    },
  },
  
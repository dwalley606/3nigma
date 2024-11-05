import Group from "../../models/Group.js";
import User from "../../models/User.js";
import Conversation from "../../models/Conversation.js";

export const groupResolvers = {
  Query: {
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
  Mutation: {
    createGroup: async (_, { name, memberIds }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to create a group.");
      }
      try {
        // Create a new group
        const newGroup = new Group({
          name,
          members: memberIds,
          admins: [context.user.id], // Automatically assign the creator as an admin
          createdAt: new Date().toISOString(),
        });

        const savedGroup = await newGroup.save();

        // Update each user's groups field
        await User.updateMany(
          { _id: { $in: memberIds } },
          { $addToSet: { groups: savedGroup._id } }
        );

        // Populate the group with member details
        const populatedGroup = await Group.findById(savedGroup._id)
          .populate("members", "username email")
          .exec();

        return {
          id: populatedGroup._id.toString(),
          name: populatedGroup.name,
          members: populatedGroup.members.map((member) => ({
            id: member._id.toString(),
            username: member.username,
          })),
          createdAt: populatedGroup.createdAt,
        };
      } catch (error) {
        console.error("Error creating group:", error);
        throw new Error("Failed to create group");
      }
    },

    addUserToGroup: async (_, { groupId, userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to add a group member.");
      }
      try {
        // Add user to the group
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $addToSet: { members: userId } },
          { new: true }
        ).populate("members", "username email");

        if (!group) {
          throw new Error("Group not found");
        }

        // Update the user's groups field
        await User.findByIdAndUpdate(userId, {
          $addToSet: { groups: groupId },
        });

        return {
          id: group._id.toString(),
          name: group.name,
          members: group.members.map((member) => ({
            id: member._id.toString(),
            username: member.username,
          })),
          createdAt: group.createdAt,
        };
      } catch (error) {
        console.error("Error adding group member:", error);
        throw new Error("Failed to add group member");
      }
    },

    promoteToAdmin: async (_, { groupId, userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to promote a member to admin.");
      }
      try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        // Check if the current user is an admin
        if (!group.admins.includes(context.user.id)) {
          throw new Error("You must be an admin to promote members");
        }

        // Check if the user to be promoted is a member
        if (!group.members.includes(userId)) {
          throw new Error("User is not a member of the group");
        }

        // Check if the user is already an admin
        if (group.admins.includes(userId)) {
          throw new Error("User is already an admin");
        }

        // Promote the user to admin
        group.admins.push(userId);
        await group.save();

        // Populate the group with member and admin details
        const updatedGroup = await Group.findById(groupId)
          .populate("admins", "_id username") // Ensure _id is included
          .populate("members", "_id username"); // Ensure _id is included

        return {
          id: updatedGroup._id.toString(),
          name: updatedGroup.name,
          admins: updatedGroup.admins.map((admin) => ({
            id: admin._id.toString(), // Convert ObjectId to string
            username: admin.username,
          })),
          members: updatedGroup.members.map((member) => ({
            id: member._id.toString(), // Convert ObjectId to string
            username: member.username,
          })),
        };
      } catch (error) {
        console.error("Error promoting member to admin:", error);
        throw new Error("Failed to promote member to admin");
      }
    },

    removeGroupMember: async (_, { groupId, userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to remove a group member.");
      }
      try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        // Check if the user is an admin
        const isAdmin = group.admins.includes(userId);

        // Remove the user from members
        group.members = group.members.filter((memberId) => memberId !== userId);

        if (isAdmin) {
          // Remove the user from admins
          group.admins = group.admins.filter((adminId) => adminId !== userId);

          // Promote another member to admin if no admins left
          if (group.admins.length === 0 && group.members.length > 0) {
            group.admins.push(group.members[0]); // Promote the first member to admin
          }
        }

        await group.save();

        return {
          id: group._id.toString(),
          name: group.name,
          admins: group.admins.map((adminId) => ({
            id: adminId.toString(),
          })),
          members: group.members.map((memberId) => ({
            id: memberId.toString(),
          })),
        };
      } catch (error) {
        console.error("Error removing group member:", error);
        throw new Error("Failed to remove group member");
      }
    },
  },
};

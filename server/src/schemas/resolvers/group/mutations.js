import Group from "../../../models/Group.js";
import User from "../../../models/User.js";
import Conversation from "../../../models/Conversation.js";
import Message from "../../../models/Message.js";

export const groupMutations = {
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

        // Create a new conversation for the group
        const newConversation = new Conversation({
          isGroup: true,
          participants: [context.user.id, ...memberIds],
          lastMessage: null, // Initially, there is no last message
          name: name,
        });

        const savedConversation = await newConversation.save();

        // Create a message indicating that the creator added the members
        const messageContent = `${context.user.username} created a group.`;
        const newMessage = new Message({
          sender: context.user.id, // Set the sender to the creator of the group
          groupRecipientId: savedGroup._id, // Link to the group
          content: messageContent,
          isGroupMessage: true,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        // Update the conversation with the last message and add it to the messages array
        savedConversation.lastMessage = savedMessage._id; // Set the last message
        savedConversation.messages.push(savedMessage._id); // Add the message to the messages array
        await savedConversation.save();

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

        // Create a message indicating that the user has been added
        const messageContent = `${context.user.username} added ${userId} to the group.`;
        const newMessage = new Message({
          sender: context.user.id, // Set the sender to the creator of the group
          groupRecipientId: groupId, // Link to the group
          content: messageContent,
          isGroupMessage: true,
          timestamp: new Date(),
        });

        await newMessage.save();

        // Update the conversation with the last message
        const conversation = await Conversation.findById(group.conversationId);
        conversation.lastMessage = newMessage._id;
        await conversation.save();

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
  };
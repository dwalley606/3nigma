import { IResolvers } from '@graphql-tools/utils';
import Group from "../../../models/Group.js";
import User from "../../../models/User.js";
import Conversation from "../../../models/Conversation.js";
import Message from "../../../models/Message.js";
import { Context } from '../../types'; // Assuming you have a Context type defined

interface CreateGroupArgs {
  name: string;
  memberIds: string[];
}

interface AddUserToGroupArgs {
  groupId: string;
  userId: string;
}

interface PromoteToAdminArgs {
  groupId: string;
  userId: string;
}

interface RemoveGroupMemberArgs {
  groupId: string;
  userId: string;
}

export const groupMutations: IResolvers = {
  Mutation: {
    createGroup: async (
      _: unknown,
      { name, memberIds }: CreateGroupArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to create a group.");
      }
      try {
        const newGroup = new Group({
          name,
          members: memberIds,
          admins: [context.user.id],
          createdAt: new Date().toISOString(),
        });

        const savedGroup = await newGroup.save();

        await User.updateMany(
          { _id: { $in: memberIds } },
          { $addToSet: { groups: savedGroup._id } }
        );

        const newConversation = new Conversation({
          isGroup: true,
          participants: [context.user.id, ...memberIds],
          lastMessage: null,
          name: name,
        });

        const savedConversation = await newConversation.save();

        const messageContent = `${context.user.username} created a group.`;
        const newMessage = new Message({
          sender: context.user.id,
          groupRecipientId: savedGroup._id,
          content: messageContent,
          isGroupMessage: true,
          timestamp: new Date(),
        });

        const savedMessage = await newMessage.save();

        savedConversation.lastMessage = savedMessage._id;
        savedConversation.messages.push(savedMessage._id);
        await savedConversation.save();

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

    addUserToGroup: async (
      _: unknown,
      { groupId, userId }: AddUserToGroupArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to add a group member.");
      }
      try {
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $addToSet: { members: userId } },
          { new: true }
        ).populate("members", "username email");

        if (!group) {
          throw new Error("Group not found");
        }

        await User.findByIdAndUpdate(userId, {
          $addToSet: { groups: groupId },
        });

        const messageContent = `${context.user.username} added ${userId} to the group.`;
        const newMessage = new Message({
          sender: context.user.id,
          groupRecipientId: groupId,
          content: messageContent,
          isGroupMessage: true,
          timestamp: new Date(),
        });

        await newMessage.save();

        const conversation = await Conversation.findById(group.conversationId);
        if (conversation) {
          conversation.lastMessage = newMessage._id;
          await conversation.save();
        }

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

    promoteToAdmin: async (
      _: unknown,
      { groupId, userId }: PromoteToAdminArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to promote a member to admin.");
      }
      try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        if (!group.admins.includes(context.user.id)) {
          throw new Error("You must be an admin to promote members");
        }

        if (!group.members.includes(userId)) {
          throw new Error("User is not a member of the group");
        }

        if (group.admins.includes(userId)) {
          throw new Error("User is already an admin");
        }

        group.admins.push(userId);
        await group.save();

        const updatedGroup = await Group.findById(groupId)
          .populate("admins", "_id username")
          .populate("members", "_id username");

        return {
          id: updatedGroup._id.toString(),
          name: updatedGroup.name,
          admins: updatedGroup.admins.map((admin) => ({
            id: admin._id.toString(),
            username: admin.username,
          })),
          members: updatedGroup.members.map((member) => ({
            id: member._id.toString(),
            username: member.username,
          })),
        };
      } catch (error) {
        console.error("Error promoting member to admin:", error);
        throw new Error("Failed to promote member to admin");
      }
    },

    removeGroupMember: async (
      _: unknown,
      { groupId, userId }: RemoveGroupMemberArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to remove a group member.");
      }
      try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        const isAdmin = group.admins.includes(userId);

        group.members = group.members.filter((memberId) => memberId !== userId);

        if (isAdmin) {
          group.admins = group.admins.filter((adminId) => adminId !== userId);

          if (group.admins.length === 0 && group.members.length > 0) {
            group.admins.push(group.members[0]);
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
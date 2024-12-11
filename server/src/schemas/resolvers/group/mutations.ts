import { IResolvers } from '@graphql-tools/utils';
import Group from "../../../models/Group.js";
import User from "../../../models/User.js";
import Conversation from "../../../models/Conversation.js";
import Message from "../../../models/Message.js";
import { AuthContext } from '../../../utils/auth.js';
import { IUser } from "../../../models/User.js";
import mongoose, { Types } from 'mongoose';

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
      context: AuthContext
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

        if (!savedMessage._id) {
          throw new Error("Failed to save message and generate an ObjectId.");
        }

        savedConversation.lastMessage = savedMessage._id as Types.ObjectId;
        savedConversation.messages.push(savedMessage._id as Types.ObjectId);
        await savedConversation.save();

        const populatedGroup = await Group.findById(savedGroup._id)
          .populate("members", "username email")
          .exec();

        return {
          id: populatedGroup._id.toString(),
          name: populatedGroup.name,
          members: populatedGroup.members.map((member) => {
            if (member instanceof mongoose.Document) {
              const user = member.toObject() as IUser;
              return {
                id: user._id.toString(),
                username: user.username,
              };
            }
            console.warn("Member is not a populated document:", member);
            return null;
          }).filter((member) => member !== null),
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
      context: AuthContext
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
          conversation.lastMessage = newMessage._id as Types.ObjectId;
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
      context: AuthContext
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to promote a member to admin.");
      }
      try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        if (!group.admins.includes(new mongoose.Types.ObjectId(context.user.id))) {
          throw new Error("You must be an admin to promote members");
        }

        if (!group.members.includes(new mongoose.Types.ObjectId(userId))) {
          throw new Error("User is not a member of the group");
        }

        if (group.admins.includes(new mongoose.Types.ObjectId(userId))) {
          throw new Error("User is already an admin");
        }

        group.admins.push(new mongoose.Types.ObjectId(userId));
        await group.save();

        const updatedGroup = await Group.findById(groupId)
          .populate("admins", "username email")
          .populate("members", "username email")
          .exec();

        return {
          id: updatedGroup._id.toString(),
          name: updatedGroup.name,
          admins: updatedGroup.admins.map((admin) => {
            if (admin instanceof mongoose.Document) {
              const user = admin.toObject() as IUser;
              return {
                id: user._id.toString(),
                username: user.username,
              };
            }
            console.warn("Admin is not a populated document:", admin);
            return null;
          }).filter((admin) => admin !== null),
          members: updatedGroup.members.map((member) => {
            if (member instanceof mongoose.Document) {
              const user = member.toObject() as IUser;
              return {
                id: user._id.toString(),
                username: user.username,
              };
            }
            console.warn("Member is not a populated document:", member);
            return null;
          }).filter((member) => member !== null),
        };
      } catch (error) {
        console.error("Error promoting member to admin:", error);
        throw new Error("Failed to promote member to admin");
      }
    },

    removeGroupMember: async (
      _: unknown,
      { groupId, userId }: RemoveGroupMemberArgs,
      context: AuthContext
    ) => {
      if (!context.user) {
        throw new Error("You must be logged in to remove a group member.");
      }
      try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const isAdmin = group.admins.includes(userObjectId);

        group.members = group.members.filter((memberId) => !memberId.equals(userObjectId));

        if (isAdmin) {
          group.admins = group.admins.filter((adminId) => !adminId.equals(userObjectId));

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
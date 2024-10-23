import Group from "../../models/Group.js";
import User from "../../models/User.js";

export const groupResolvers = {
  Query: {
    getGroupMessages: async (_, { groupId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view group messages.");
      }
      try {
        const group = await Group.findById(groupId).populate("messages");
        if (!group) {
          throw new Error("Group not found");
        }
        return group.messages;
      } catch (error) {
        console.error("Error fetching group messages:", error);
        throw new Error("Failed to fetch group messages");
      }
    },
  },
  Mutation: {
    createGroup: async (_, { name, memberIds }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to create a group.");
      }
      try {
        const newGroup = new Group({
          name,
          members: memberIds,
          createdAt: new Date().toISOString(),
        });

        const savedGroup = await newGroup.save();

        // Update each user's groups field
        await User.updateMany(
          { _id: { $in: memberIds } },
          { $addToSet: { groups: savedGroup._id } }
        );

        const populatedGroup = await Group.findById(savedGroup._id)
          .populate("members")
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
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $addToSet: { members: userId } },
          { new: true }
        ).populate("members");

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
    removeGroupMember: async (_, { groupId, userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to remove a group member.");
      }
      try {
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $pull: { members: userId } },
          { new: true }
        ).populate("members");

        if (!group) {
          throw new Error("Group not found");
        }

        // Update the user's groups field
        await User.findByIdAndUpdate(userId, { $pull: { groups: groupId } });

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
        console.error("Error removing group member:", error);
        throw new Error("Failed to remove group member");
      }
    },
  },
};

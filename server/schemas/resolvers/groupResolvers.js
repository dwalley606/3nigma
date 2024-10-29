import Group from "../../models/Group.js";
import User from "../../models/User.js";

export const groupResolvers = {
  Query: {
    // Add any group-related queries here if needed
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

    removeGroupMember: async (_, { groupId, userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to remove a group member.");
      }
      try {
        // Remove user from the group
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $pull: { members: userId } },
          { new: true }
        ).populate("members", "username email");

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

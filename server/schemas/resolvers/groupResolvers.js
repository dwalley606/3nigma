import Group from '../../models/Group.js';

export const groupResolvers = {
  Query: {
    getGroupMessages: async (_, { groupId }) => {
      return await Group.findById(groupId).populate('messages');
    },
  },
  Mutation: {
    createGroup: async (_, { name, memberIds }) => {
      try {
        const newGroup = new Group({
          name,
          members: memberIds,
          createdAt: new Date().toISOString(),
        });

        const savedGroup = await newGroup.save();

        const populatedGroup = await Group.findById(savedGroup._id)
          .populate('members')
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
        console.error('Error creating group:', error);
        throw new Error('Failed to create group');
      }
    },
    addGroupMember: async (_, { groupId, userId }) => {
      try {
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $addToSet: { members: userId } },
          { new: true }
        ).populate('members');

        if (!group) {
          throw new Error('Group not found');
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
        console.error('Error adding group member:', error);
        throw new Error('Failed to add group member');
      }
    },
    removeGroupMember: async (_, { groupId, userId }) => {
      try {
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $pull: { members: userId } },
          { new: true }
        ).populate('members');

        if (!group) {
          throw new Error('Group not found');
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
        console.error('Error removing group member:', error);
        throw new Error('Failed to remove group member');
      }
    },
  },
};
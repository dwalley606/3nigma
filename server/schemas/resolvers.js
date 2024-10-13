// server/schemas/resolvers.js
import User from '../models/User.js'; // Assuming you've created models
import Message from '../models/Message.js';
import Group from '../models/Group.js';
import ContactRequest from '../models/ContactRequest.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    getContacts: async (_, { userId }) => {
      return await User.findById(userId).populate('contacts');
    },

    getMessages: async (_, { senderId, recipientId }) => {
      const messages = await Message.find({
        $or: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      });

      return messages.map((msg) => ({
        id: msg._id.toString(),
        senderId: msg.senderId,
        recipientId: msg.recipientId,
        content: msg.content,
        timestamp: msg.timestamp,
      }));
    },

    getGroupMessages: async (_, { groupId }) => {
      return await Group.findById(groupId).populate('messages');
    },

    getUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) {
          throw new Error('User not found');
        }
        return {
          id: user._id.toString(),
          username: user.username,
          phoneNumber: user.phoneNumber,
          publicKey: user.publicKey,
          // ... other fields ...
        };
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
      }
    },

    getUsers: async () => {
      return await User.find();
    },

    getEncryptionKey: async (_, { userId }) => {
      const user = await User.findById(userId);
      return {
        user: user._id,
        publicKey: user.publicKey,
        privateKey: user.privateKey,
      };
    },
  },

  Mutation: {
    registerUser: async (_, { username, email, password, phoneNumber }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
      });
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

      return { token, user };
    },

    sendMessage: async (_, { senderId, recipientId, content, isGroupMessage }) => {
      const newMessage = new Message({
        senderId,
        recipientId,
        content,
        isGroupMessage,
        timestamp: new Date().toISOString(),
      });
      return await newMessage.save();
    },

    sendContactRequest: async (_, { fromUserId, toUserId }) => {
      try {
        const newRequest = new ContactRequest({
          from: fromUserId,
          to: toUserId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });

        const savedRequest = await newRequest.save();

        const populatedRequest = await ContactRequest.findById(savedRequest._id)
          .populate('from')
          .populate('to')
          .exec();

        return {
          id: populatedRequest._id.toString(),
          from: populatedRequest.from,
          to: populatedRequest.to,
          status: populatedRequest.status,
          createdAt: populatedRequest.createdAt,
        };
      } catch (error) {
        console.error('Error sending contact request:', error);
        throw new Error('Failed to send contact request');
      }
    },

    respondContactRequest: async (_, { requestId, status }) => {
      try {
        const request = await ContactRequest.findById(requestId);

        if (!request) {
          throw new Error('Contact request not found');
        }

        request.status = status;
        const updatedRequest = await request.save();

        if (status === 'accepted') {
          await User.findByIdAndUpdate(request.from, {
            $addToSet: { contacts: request.to },
          });

          await User.findByIdAndUpdate(request.to, {
            $addToSet: { contacts: request.from },
          });
        }

        return {
          id: updatedRequest._id.toString(),
          from: {
            id: updatedRequest.from.toString(),
          },
          to: {
            id: updatedRequest.to.toString(),
          },
          status: updatedRequest.status,
        };
      } catch (error) {
        console.error('Error responding to contact request:', error);
        throw new Error('Failed to respond to contact request');
      }
    },

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

    deleteMessage: async (_, { messageId, forEveryone }) => {
      try {
        if (forEveryone) {
          const deletedMessage = await Message.findByIdAndDelete(messageId);
          if (!deletedMessage) {
            throw new Error('Message not found');
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error deleting message:', error);
        throw new Error('Failed to delete message');
      }
    },
  },
};

export default resolvers;

const User = require("../models/User"); // Assuming you've created models
const Message = require("../models/Message");
const Group = require("../models/Group");
const ContactRequest = require("../models/ContactRequest"); // Import the key generation utility
const { registerUser } = require("../controllers/userController"); // Import the user controller

const resolvers = {
  Query: {
    // Get user's contacts
    getContacts: async (_, { userId }) => {
      return await User.findById(userId).populate("contacts");
    },

    // Fetch a conversation between two users
    getMessages: async (_, { senderId, recipientId }) => {
      const messages = await Message.find({
        $or: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      });
      // Return messages without decrypting
      return messages.map((msg) => ({
        ...msg.toObject(),
        content: msg.content, // Return encrypted content
      }));
    },

    // Fetch group conversation
    getGroupMessages: async (_, { groupId }) => {
      return await Group.findById(groupId).populate("messages");
    },

    // Fetch user details
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },

    getUsers: async () => {
      return await User.find(); // Fetch all users directly from the User model
    },

    // Fetch user's encryption keys
    getEncryptionKey: async (_, { userId }) => {
      const user = await User.findById(userId);
      return {
        user: user._id,
        publicKey: user.publicKey,
        privateKey: user.privateKey, // Should only be returned if this is a client-specific request
      };
    },
  },

  Mutation: {
    // Register a new user
    registerUser: async (_, { username, phoneNumber }) => {
      // Delegate user registration to the userController
      const { user, privateKey } = await registerUser(username, phoneNumber);

      // Return the user and the private key to the client
      // Ensure the private key is transmitted securely
      return {
        user,
        privateKey, // Return the private key to the client
      };
    },

    // Send a direct or group message
    sendMessage: async (
      _,
      { senderId, recipientId, content, isGroupMessage }
    ) => {
      // Assume content is already encrypted
      const newMessage = new Message({
        senderId,
        recipientId,
        content, // Store encrypted content
        isGroupMessage,
        timestamp: new Date().toISOString(),
      });
      return await newMessage.save();
    },

    // Send contact request for secure connection
    sendContactRequest: async (_, { fromUserId, toUserId }) => {
      const request = new ContactRequest({
        from: fromUserId,
        to: toUserId,
        status: "pending",
      });
      return await request.save();
    },

    // Respond to contact request
    respondContactRequest: async (_, { requestId, status }) => {
      const request = await ContactRequest.findById(requestId);
      request.status = status;
      return await request.save();
    },

    // Create a group chat
    createGroup: async (_, { name, memberIds }) => {
      const newGroup = new Group({
        name,
        members: memberIds,
        createdAt: new Date().toISOString(),
      });
      return await newGroup.save();
    },

    // Add member to group
    addGroupMember: async (_, { groupId, userId }) => {
      const group = await Group.findById(groupId);
      group.members.push(userId);
      return await group.save();
    },

    // Remove member from group
    removeGroupMember: async (_, { groupId, userId }) => {
      const group = await Group.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true }
      );
      return group;
    },

    // Delete a message (optionally for everyone)
    deleteMessage: async (_, { messageId, forEveryone }) => {
      if (forEveryone) {
        await Message.findByIdAndDelete(messageId);
        return true;
      }
      return false;
    },
  },
};

module.exports = resolvers;

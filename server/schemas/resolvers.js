const User = require("../models/User"); // Assuming you've created models
const Message = require("../models/Message");
const Group = require("../models/Group");
const ContactRequest = require("../models/ContactRequest");
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

      return messages.map((msg) => ({
        id: msg._id.toString(), // Ensure the ID is correctly mapped
        senderId: msg.senderId,
        recipientId: msg.recipientId,
        content: msg.content,
        timestamp: msg.timestamp,
      }));
    },

    // Fetch group conversation
    getGroupMessages: async (_, { groupId }) => {
      return await Group.findById(groupId).populate("messages");
    },

    // Fetch user details
    getUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) {
          throw new Error("User not found");
        }
        return {
          id: user._id.toString(), // Ensure the ID is correctly mapped
          username: user.username,
          phoneNumber: user.phoneNumber,
          publicKey: user.publicKey,
          // ... other fields ...
        };
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Failed to fetch user");
      }
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
    sendContactRequest: async (_, { fromUserId, toUserId }, { db }) => {
      try {
        // Create a new contact request
        const newRequest = new ContactRequest({
          from: fromUserId,
          to: toUserId,
          status: "pending",
          createdAt: new Date().toISOString(),
        });

        // Save the contact request to the database
        const savedRequest = await newRequest.save();

        // Populate the 'from' and 'to' fields with User data
        const populatedRequest = await savedRequest
          .populate("from to")
          .execPopulate();

        return {
          id: populatedRequest._id.toString(),
          from: populatedRequest.from,
          to: populatedRequest.to,
          status: populatedRequest.status,
          createdAt: populatedRequest.createdAt,
        };
      } catch (error) {
        console.error("Error sending contact request:", error);
        throw new Error("Failed to send contact request");
      }
    },

    // Respond to contact request
    respondContactRequest: async (_, { requestId, status }) => {
      try {
        const request = await ContactRequest.findById(requestId);

        if (!request) {
          throw new Error("Contact request not found");
        }

        request.status = status;
        const updatedRequest = await request.save();

        if (status === "accepted") {
          // Add each user to the other's contact list
          await User.findByIdAndUpdate(request.from, {
            $addToSet: { contacts: request.to },
          });

          await User.findByIdAndUpdate(request.to, {
            $addToSet: { contacts: request.from },
          });
        }

        return {
          id: updatedRequest._id.toString(), // Convert ObjectId to string
          from: {
            id: updatedRequest.from.toString(), // Convert ObjectId to string
            // Add other fields if necessary
          },
          to: {
            id: updatedRequest.to.toString(), // Convert ObjectId to string
            // Add other fields if necessary
          },
          status: updatedRequest.status,
        };
      } catch (error) {
        console.error("Error responding to contact request:", error);
        throw new Error("Failed to respond to contact request");
      }
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

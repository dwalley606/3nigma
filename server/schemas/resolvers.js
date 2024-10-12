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
    sendContactRequest: async (_, { fromUserId, toUserId }) => {
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
      try {
        const newGroup = new Group({
          name,
          members: memberIds,
          createdAt: new Date().toISOString(),
        });
 
        const savedGroup = await newGroup.save();
 
        // Populate the members field
        const populatedGroup = await Group.findById(savedGroup._id)
          .populate('members')
          .exec();
 
        return {
          id: populatedGroup._id.toString(),
          name: populatedGroup.name,
          members: populatedGroup.members.map(member => ({
            id: member._id.toString(), // Ensure ID is a string
            username: member.username,
            // Add other fields if necessary
          })),
          createdAt: populatedGroup.createdAt,
        };
      } catch (error) {
        console.error("Error creating group:", error);
        throw new Error("Failed to create group");
      }
    },

    // Add member to group
    addGroupMember: async (_, { groupId, userId }) => {
      try {
        // Add the user to the group
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
          members: group.members.map(member => ({
            id: member._id.toString(), // Ensure ID is a string
            username: member.username,
            // Add other fields if necessary
          })),
          createdAt: group.createdAt,
        };
      } catch (error) {
        console.error("Error adding group member:", error);
        throw new Error("Failed to add group member");
      }
    },

    // Remove member from group
    removeGroupMember: async (_, { groupId, userId }) => {
      try {
        // Remove the user from the group
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
          members: group.members.map(member => ({
            id: member._id.toString(), // Ensure ID is a string
            username: member.username,
            // Add other fields if necessary
          })),
          createdAt: group.createdAt,
        };
      } catch (error) {
        console.error("Error removing group member:", error);
        throw new Error("Failed to remove group member");
      }
    },

    // Delete a message (optionally for everyone)
    deleteMessage: async (_, { messageId, forEveryone }) => {
      try {
        if (forEveryone) {
          const deletedMessage = await Message.findByIdAndDelete(messageId);
          if (!deletedMessage) {
            throw new Error('Message not found');
          }
          return true;
        }
        // If not deleting for everyone, implement logic for individual deletion
        // For now, return false as a placeholder
        return false;
      } catch (error) {
        console.error("Error deleting message:", error);
        throw new Error("Failed to delete message");
      }
    },
  },
};

module.exports = resolvers;

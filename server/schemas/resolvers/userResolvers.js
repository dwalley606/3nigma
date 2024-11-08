import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import ContactRequest from "../../models/ContactRequest.js";
import Group from "../../models/Group.js";
import bcrypt from "bcrypt";

export const userResolvers = {
  Query: {
    getUserById: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view user details.");
      }
      try {
        const user = await User.findById(id).populate(
          "contacts",
          "username email"
        );
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    getUsers: async (_, __, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view users.");
      }
      try {
        const users = await User.find().select("username email");
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    getContacts: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view contacts.");
      }
      try {
        const user = await User.findById(userId).populate(
          "contacts",
          "username email"
        );
        return user.contacts || [];
      } catch (error) {
        console.error("Error fetching contacts:", error);
        throw new Error("Failed to fetch contacts");
      }
    },
    getContactRequests: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view contact requests.");
      }
      try {
        const incomingRequests = await ContactRequest.find({
          to: userId,
          status: "pending",
        }).populate("from", "username email");

        const outgoingRequests = await ContactRequest.find({
          from: userId,
          status: "pending",
        }).populate("to", "username email");

        const allRequests = [...incomingRequests, ...outgoingRequests];

        return allRequests.map((request) => ({
          id: request.id.toString(),
          from: {
            id: request.from.id.toString(),
            username: request.from.username,
            email: request.from.email,
          },
          status: request.status,
        }));
      } catch (error) {
        console.error("Error fetching contact requests:", error);
        throw new Error("Failed to fetch contact requests");
      }
    },
    getUserGroups: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to view your groups.");
      }
      try {
        const groups = await Group.find({ members: userId })
          .populate("members", "username email")
          .populate("admins", "username email");
        return groups;
      } catch (error) {
        console.error("Error fetching user groups:", error);
        throw new Error("Failed to fetch user groups");
      }
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password, phoneNumber }) => {
      try {
        const newUser = new User({
          username,
          email,
          password,
          phoneNumber,
        });

        const savedUser = await newUser.save();

        return { user: savedUser };
      } catch (error) {
        console.error("Error registering user:", error.message);
        throw new Error("Failed to register user");
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Incorrect password");
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });

        return { token, user };
      } catch (error) {
        console.error("Error during login:", error.message);
        throw new Error("Failed to log in");
      }
    },
    refreshToken: async (_, { refreshToken }) => {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
          expiresIn: "15m",
        });
        return { token: newToken };
      } catch (error) {
        console.error("Error refreshing token:", error.message);
        throw new Error("Invalid or expired refresh token");
      }
    },
    sendContactRequest: async (_, { fromUserId, toUserId }, context) => {
      if (!context.user) {
        throw new Error("You must be logged in to send a contact request.");
      }
      try {
        const newRequest = new ContactRequest({
          from: fromUserId,
          to: toUserId,
          status: "pending",
          createdAt: new Date().toISOString(),
        });

        const savedRequest = await newRequest.save();

        const populatedRequest = await ContactRequest.findById(savedRequest._id)
          .populate("from", "username email")
          .populate("to", "username email");

        return populatedRequest;
      } catch (error) {
        console.error("Error sending contact request:", error);
        throw new Error("Failed to send contact request");
      }
    },
    respondContactRequest: async (_, { requestId, status }, context) => {
      if (!context.user) {
        throw new Error(
          "You must be logged in to respond to a contact request."
        );
      }
      try {
        const request = await ContactRequest.findById(requestId);

        if (!request) {
          throw new Error("Contact request not found");
        }

        request.status = status;
        const updatedRequest = await request.save();

        if (status === "accepted") {
          await User.findByIdAndUpdate(request.from, {
            $addToSet: { contacts: request.to },
          });

          await User.findByIdAndUpdate(request.to, {
            $addToSet: { contacts: request.from },
          });
        }

        return updatedRequest;
      } catch (error) {
        console.error("Error responding to contact request:", error);
        throw new Error("Failed to respond to contact request");
      }
    },
  },
};

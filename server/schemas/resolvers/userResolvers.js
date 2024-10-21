import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import ContactRequest from "../../models/ContactRequest.js"; // Ensure the path is correct

export const userResolvers = {
  Query: {
    getUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id).populate("contacts");
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    getUsers: async () => {
      try {
        const users = await User.find();
        return users; // Ensure this returns an array
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    getContacts: async (_, { userId }) => {
      try {
        const user = await User.findById(userId).populate("contacts");
        return user.contacts || []; // Ensure it returns an array
      } catch (error) {
        console.error("Error fetching contacts:", error);
        throw new Error("Failed to fetch contacts");
      }
    },
    getContactRequests: async (_, { userId }) => {
      try {
        const requests = await ContactRequest.find({
          to: userId,
          status: "pending",
        })
          .populate("from")
          .exec();
        return requests;
      } catch (error) {
        console.error("Error fetching contact requests:", error);
        throw new Error("Failed to fetch contact requests");
      }
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password, phoneNumber }) => {
      try {
        // Create a new user object
        const newUser = new User({
          username,
          email,
          password, // Pass the plain password; it will be hashed by the pre-save middleware
          phoneNumber,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Return the user data
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
        console.log(user);

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
    sendContactRequest: async (_, { fromUserId, toUserId }) => {
      try {
        const newRequest = new ContactRequest({
          from: fromUserId,
          to: toUserId,
          status: "pending",
          createdAt: new Date().toISOString(),
        });

        const savedRequest = await newRequest.save();

        const populatedRequest = await ContactRequest.findById(savedRequest._id)
          .populate("from")
          .populate("to")
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
    respondContactRequest: async (_, { requestId, status }) => {
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
        console.error("Error responding to contact request:", error);
        throw new Error("Failed to respond to contact request");
      }
    },
  },
};

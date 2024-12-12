import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../../models/User.js";
import ContactRequest from "../../../models/ContactRequest.js";
import Conversation from "../../../models/Conversation.js";
import { IResolvers } from '@graphql-tools/utils';

interface RegisterUserArgs {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface RefreshTokenArgs {
  refreshToken: string;
}

interface SendContactRequestArgs {
  fromUserId: string;
  toUserId: string;
}

interface RespondContactRequestArgs {
  requestId: string;
  status: string;
}

export const userMutations: IResolvers = {
  Mutation: {
    registerUser: async (_: unknown, { username, email, password, phoneNumber }: RegisterUserArgs) => {
      try {
        const newUser = new User({ username, email, password, phoneNumber });
        const savedUser = await newUser.save();
        return { user: savedUser };
      } catch (error) {
        console.error("Error registering user:", error.message);
        throw new Error("Failed to register user");
      }
    },
    login: async (_: unknown, { email, password }: LoginArgs) => {
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
    refreshToken: async (_: unknown, { refreshToken }: RefreshTokenArgs) => {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
          expiresIn: "15m",
        });
        return { token: newToken };
      } catch (error) {
        console.error("Error refreshing token:", error.message);
        throw new Error("Invalid or expired refresh token");
      }
    },
    sendContactRequest: async (_: unknown, { fromUserId, toUserId }: SendContactRequestArgs, context: any) => {
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

        return await ContactRequest.findById(savedRequest._id)
          .populate("from", "username email")
          .populate("to", "username email");
      } catch (error) {
        console.error("Error sending contact request:", error);
        throw new Error("Failed to send contact request");
      }
    },
    respondContactRequest: async (_: unknown, { requestId, status }: RespondContactRequestArgs, context: any) => {
      if (!context.user) {
        throw new Error("You must be logged in to respond to a contact request.");
      }
      try {
        const request = await ContactRequest.findById(requestId).populate('from to');
        if (!request) {
          throw new Error("Contact request not found");
        }

        request.status = status as "pending" | "accepted" | "rejected";
        const updatedRequest = await request.save();

        if (status === "accepted") {
          await User.findByIdAndUpdate(request.from._id, {
            $addToSet: { contacts: request.to._id },
          });

          await User.findByIdAndUpdate(request.to._id, {
            $addToSet: { contacts: request.from._id },
          });

          const existingConversation = await Conversation.findOne({
            participants: { $all: [request.from._id, request.to._id] },
            isGroup: false,
          });

          if (!existingConversation) {
            const newConversation = new Conversation({
              participants: [request.from._id, request.to._id],
              isGroup: false,
              messages: [],
            });

            await newConversation.save();
          }
        }

        return updatedRequest;
      } catch (error) {
        console.error("Error responding to contact request:", error);
        throw new Error("Failed to respond to contact request");
      }
    },
  },
};

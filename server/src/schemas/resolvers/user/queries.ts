import User from "../../../models/User.js";
import ContactRequest from "../../../models/ContactRequest.js";
import Group from "../../../models/Group.js";
import Conversation from "../../../models/Conversation.js";
import { IResolvers } from '@graphql-tools/utils';

interface GetUserByIdArgs {
  id: string;
}

interface GetContactsArgs {
  userId: string;
}

interface GetContactRequestsArgs {
  userId: string;
}

interface GetUserGroupsArgs {
  userId: string;
}

export const userQueries: IResolvers = {
  Query: {
    getUserById: async (_: unknown, { id }: GetUserByIdArgs, context: any) => {
      if (!context.user) {
        throw new Error("You must be logged in to view user details.");
      }
      try {
        const user = await User.findById(id).populate("contacts", "username email");
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    getUsers: async (_: unknown, __: unknown, context: any) => {
      if (!context.user) {
        throw new Error("You must be logged in to view users.");
      }
      try {
        const users = await User.find({ _id: { $ne: context.user.id } }).select("username email");
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
    getContacts: async (_: unknown, { userId }: GetContactsArgs, context: any) => {
      if (!context.user) {
        throw new Error("You must be logged in to view contacts.");
      }
      try {
        const user = await User.findById(userId).populate('contacts');
        const conversations = await Conversation.find({
          participants: userId,
          isGroup: false,
        });

        return user.contacts.map(contact => {
          const conversation = conversations.find(conv => conv.participants.includes(contact.id));
          return {
            id: contact.id,
            username: contact.username,
            email: contact.email,
            conversationId: conversation ? conversation.id : null,
          };
        });
      } catch (error) {
        console.error("Error fetching contacts:", error);
        throw new Error("Failed to fetch contacts");
      }
    },
    getContactRequests: async (_: unknown, { userId }: GetContactRequestsArgs, context: any) => {
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

        return [...incomingRequests, ...outgoingRequests].map(request => ({
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
    getUserGroups: async (_: unknown, { userId }: GetUserGroupsArgs, context: any) => {
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
};

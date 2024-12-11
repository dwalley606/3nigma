import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    phoneNumber: String
    groups: [Group]
    publicKey: String!
    lastSeen: String!
    profilePicUrl: String
    contacts: [User!]!
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    timestamp: String!
    isGroupMessage: Boolean!
    groupRecipientId: ID
    userRecipientId: ID
  }

  type Conversation {
    id: ID!
    participants: [User!]!
    messages: [Message!]!
    lastMessage: Message
    isGroup: Boolean!
    name: String
    unreadCount: Int
    groupId: ID
  }

  type Group {
    id: ID!
    name: String!
    members: [User!]!
    admins: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  type ContactRequest {
    id: ID!
    from: User!
    to: User!
    status: String!
    createdAt: String!
  }

  type EncryptionKey {
    id: ID!
    user: User!
    publicKey: String!
    privateKey: String!
  }

  type RegisterUserResponse {
    user: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type GroupDetails {
    id: ID!
    name: String!
    lastMessage: Message
    admins: [User!]!
    members: [User!]!
    isGroup: Boolean!
  }

  type SendMessageResponse {
    success: Boolean!
    message: Message!
  }

  type UserWithConversation {
    id: ID!
    username: String!
    email: String!
    conversationId: ID
  }

  type Query {
    getContacts(userId: ID!): [UserWithConversation!]!
    getConversations(userId: ID!): [Conversation!]!
    getDirectMessages(userId: ID!): [Message!]!
    getGroupMessages(groupId: ID!): [Message!]!
    getUserById(id: ID!): User
    getUsers: [User!]
    getEncryptionKey(userId: ID!): EncryptionKey!
    getContactRequests(userId: ID!): [ContactRequest!]!
    getUserGroups(userId: ID!): [Group]
    getConversation(conversationId: ID!): Conversation!
    getGroupConversations(userId: ID!): [Conversation!]!
    getGroupDetails(userId: ID!): [GroupDetails!]!
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!, phoneNumber: String!): RegisterUserResponse!
    login(email: String!, password: String!): AuthPayload!
    sendDirectMessage(recipientId: ID!, content: String!): SendMessageResponse!
    sendGroupMessage(groupId: ID!, content: String!): SendMessageResponse!
    sendContactRequest(fromUserId: ID!, toUserId: ID!): ContactRequest!
    respondContactRequest(requestId: ID!, status: String!): ContactRequest!
    createGroup(name: String!, memberIds: [ID!]!): Group!
    addUserToGroup(groupId: ID!, userId: ID!): Group!
    removeGroupMember(groupId: ID!, userId: ID!): Group!
    deleteMessage(messageId: ID!, forEveryone: Boolean!): Boolean!
    markMessagesAsRead(conversationId: ID!): Boolean!
    refreshToken(refreshToken: String!): AuthPayload
    promoteToAdmin(groupId: ID!, userId: ID!): Group!
  }
`;

export default typeDefs;

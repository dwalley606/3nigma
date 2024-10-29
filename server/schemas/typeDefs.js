const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    phoneNumber: String!
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

  type Query {
    getContacts(userId: ID!): [User!]!
    getConversations(userId: ID!): [Conversation!]!
    getDirectMessages(userId: ID!): [Message!]!
    getGroupMessages(groupId: ID!): [Message!]!
    getUserById(id: ID!): User
    getUsers: [User!]
    getEncryptionKey(userId: ID!): EncryptionKey!
    getContactRequests(userId: ID!): [ContactRequest!]!
    getUserGroups(userId: ID!): [Group]
    getConversation(userId: ID!, otherUserId: ID!): [Message!]!
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!, phoneNumber: String!): RegisterUserResponse!
    login(email: String!, password: String!): AuthPayload!
    sendDirectMessage(recipientId: ID!, content: String!): Message!
    sendGroupMessage(groupId: ID!, content: String!): Message!
    sendContactRequest(fromUserId: ID!, toUserId: ID!): ContactRequest!
    respondContactRequest(requestId: ID!, status: String!): ContactRequest!   
    createGroup(name: String!, memberIds: [ID!]!): Group!
    addUserToGroup(groupId: ID!, userId: ID!): Group!
    removeGroupMember(groupId: ID!, userId: ID!): Group!
    deleteMessage(messageId: ID!, forEveryone: Boolean!): Boolean!
    markMessagesAsRead(conversationId: ID!): Boolean!
    refreshToken(refreshToken: String!): AuthPayload
  }
`;

export default typeDefs;

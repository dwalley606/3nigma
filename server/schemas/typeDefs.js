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

  type ContactRequest {
    id: ID!
    from: User!
    to: User!
    status: String!
    createdAt: String!
  }
  
  type Message {
    id: ID!
    senderId: ID!
    senderName: String!
    recipientId: ID!
    content: String!
    timestamp: String!
    read: Boolean!
    isGroupMessage: Boolean
    groupName: String
  }

  type Group {
    id: ID!
    name: String!
    members: [User!]!
    admins: [User!]!
    createdAt: String!
    updatedAt: String!
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
    getAllMessages(userId: ID!): [Message!]!
    getDirectMessages(userId: ID!): [Message!]!
    getGroupMessages(userId: ID!): [Message!]!
    getConversation(userId: ID!, otherUserId: ID!): [Message!]!
    getUserById(id: ID!): User
    getUsers: [User!]
    getEncryptionKey(userId: ID!): EncryptionKey!
    getContactRequests(userId: ID!): [ContactRequest!]!
    getUserGroups(userId: ID!): [Group]
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!, phoneNumber: String!): RegisterUserResponse!
    login(email: String!, password: String!): AuthPayload!
    sendMessage(senderId: ID!, recipientId: ID!, content: String!, isGroupMessage: Boolean): Message!
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

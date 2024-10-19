const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    phoneNumber: String!
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
  }

  type Group {
    id: ID!
    name: String!
    members: [User!]!
    messages: [Message!]!
    admins: [User!]!
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
    getMessages(recipientId: ID!): [Message!]!
    getConversation(userId: ID!, otherUserId: ID!): [Message!]!
    getGroupMessages(groupID: ID!): [Message!]!
    getUserById(id: ID!): User
    getUsers: [User!]
    getEncryptionKey(userId: ID!): EncryptionKey!
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!, phoneNumber: String!): RegisterUserResponse!
    login(email: String!, password: String!): AuthPayload!
    sendMessage(senderId: ID!, recipientId: ID!, content: String!, isGroupMessage: Boolean): Message!
    sendContactRequest(fromUserId: ID!, toUserId: ID!): ContactRequest!
    respondContactRequest(requestId: ID!, status: String!): ContactRequest!   
    createGroup(name: String!, memberIds: [ID!]!): Group!
    addGroupMember(groupId: ID!, userId: ID!): Group!
    removeGroupMember(groupId: ID!, userId: ID!): Group!
    deleteMessage(messageId: ID!, forEveryone: Boolean!): Boolean!
    markMessagesAsRead(conversationId: ID!): Boolean!
  }
`;

export default typeDefs;

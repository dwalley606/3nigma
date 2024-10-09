
const typeDefs = `
  type User {
    id: ID!
    username: String!
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
    sender: User!
    recipient: User!
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

  type Query {
    getContacts(userId: ID!): [User!]!
    getMessages(senderId: ID!, recipientId: ID!): [Message!]!
    getGroupMessages(groupID: ID!): [Message!]!
    getUser(id: ID!): User!
    getEncryptionKey(userId: ID!): EncryptionKey!
  }

  type Mutation {
    registerUser(username: String!, phoneNumber: String!, publicKey: String!): User!
    sendMessage(senderId: ID!, recipientId: ID!, content: String!, isGroupMessage: Boolean): Message!
    sendContactRequest(fromUserId: ID!, toUserId: ID!): ContactRequest!
    respondContactRequest(requestId: ID!, status: String!): ContactRequest!   
    createGroup(name: String!, memberIds: [ID!]!): Group!
    addGroupMember(groupId: ID!, userId: ID!): Group!
    removeGroupMember(groupId: ID!, userId: ID!): Group!
    deleteMessage(messageId: ID!, forEveryone: Boolean!): Boolean!

  }
`;

module.exports = typeDefs;

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Message {
    id: ID!
    senderId: ID!
    recipientId: ID!
    content: String!   # Encrypted content
    timestamp: String!
  }

  type Query {
    messages(senderId: ID!, recipientId: ID!): [Message!]!
  }

  type Mutation {
    sendMessage(senderId: ID!, recipientId: ID!, content: String!): Message!
  }
`;

module.exports = typeDefs;

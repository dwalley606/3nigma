import { gql } from "@apollo/client";

export const GET_GROUP_CONVERSATIONS = gql`
  query getGroupConversations($userId: ID!) {
    getConversations(userId: $userId) {
      id
      name
      lastMessage {
        id
        content
        timestamp
        sender {
          id
          username
        }
      }
      messages {
        id
        content
        timestamp
        sender {
          id
          username
        }
      }
      isGroup
    }
  }
`;

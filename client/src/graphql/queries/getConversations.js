import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations($userId: ID!) {
    getConversations(userId: $userId) {
      id
      name 
      participants {
        id
        username
      }
      lastMessage {
        id
        content
        timestamp
        sender {
          id
          username
        }
      }
    }
  }
`;
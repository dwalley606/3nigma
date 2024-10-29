import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query getConversations($userId: ID!) {
    getConversations(userId: $userId) {
      id
      participants {
        id
        username
      }
      messages {
        id
        content
        sender {
          id
          username
        }
        timestamp
      }
      lastMessage {
        id
        content
        sender {
          id
          username
        }
        timestamp
      }
      isGroup
      name
      unreadCount
    }
  }
`; 
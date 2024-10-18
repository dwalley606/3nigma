import { gql } from "@apollo/client";

// GraphQL query to fetch messages for a specific recipient
export const GET_MESSAGES = gql`
  query GetMessages($recipientId: ID!) {
    getMessages(recipientId: $recipientId) {
      id
      senderId
      senderName
      recipientId
      content
      timestamp
      read
      isGroupMessage
    }
  }
`;

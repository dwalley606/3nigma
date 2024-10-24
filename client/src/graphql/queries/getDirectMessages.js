import { gql } from "@apollo/client";

export const GET_DIRECT_MESSAGES = gql`
  query getDirectMessages($userId: ID!) {
    getDirectMessages(userId: $userId) {
      id
      senderId
      senderName
      recipientId
      content
      timestamp
      isGroupMessage
    }
  }
`;

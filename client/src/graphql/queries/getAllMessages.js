import { gql } from "@apollo/client";

export const GET_ALL_MESSAGES = gql`
  query GetAllMessages($userId: ID!) {
    getAllMessages(userId: $userId) {
      id
      senderId
      senderName
      recipientId
      content
      timestamp
      read
      isGroupMessage
      groupName
    }
  }
`;


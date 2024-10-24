import { gql } from "@apollo/client";

export const GET_GROUP_MESSAGES = gql`
  query getGroupMessages($userId: ID!) {
    getGroupMessages(userId: $userId) {
      id
      senderName
      content
      timestamp
      recipientId
      isGroupMessage
      groupName
    }
  }
`;

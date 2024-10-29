import { gql } from "@apollo/client";

export const GET_DIRECT_MESSAGES = gql`
  query getDirectMessages($userId: ID!) {
    getDirectMessages(userId: $userId) {
      id
      content
      sender {
        id
        username
      }
      timestamp
      isGroupMessage
      groupRecipientId
      userRecipientId
    }
  }
`;

// client/src/graphql/queries/getConversation.js
import { gql } from "@apollo/client";

export const GET_CONVERSATION = gql`
  query GetConversation($userId: ID!, $otherUserId: ID!) {
    getConversation(userId: $userId, otherUserId: $otherUserId) {
      id
      content
      sender {
        id
        username
      }
      userRecipientId
      timestamp
      isGroupMessage
    }
  }
`;

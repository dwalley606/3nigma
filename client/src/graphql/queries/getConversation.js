// client/src/graphql/queries/getConversation.js
import { gql } from "@apollo/client";

export const GET_CONVERSATION = gql`
  query GetConversation($conversationId: ID!) {
    getConversation(conversationId: $conversationId) {
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

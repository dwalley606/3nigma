// client/src/graphql/queries/getConversation.js
import { gql } from "@apollo/client";

export const GET_CONVERSATION = gql`
  query GetConversation($conversationId: ID!) {
    getConversation(conversationId: $conversationId) {
      id
      messages {
        id
        content
        sender {
          id
          username
        }
        userRecipientId
        timestamp
        isGroupMessage
        groupRecipientId
      }
      lastMessage {
        id
        content
        sender {
          id
          username
        }
        groupRecipientId
      }
    }
  }
`;

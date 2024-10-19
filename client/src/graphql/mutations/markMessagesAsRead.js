// client/src/graphql/mutations/markMessagesAsRead.js
import { gql } from "@apollo/client";

export const MARK_MESSAGES_AS_READ = gql`
  mutation MarkMessagesAsRead($conversationId: ID!) {
    markMessagesAsRead(conversationId: $conversationId)
  }
`;

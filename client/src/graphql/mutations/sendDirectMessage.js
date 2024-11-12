import { gql } from "@apollo/client";

export const SEND_DIRECT_MESSAGE = gql`
  mutation sendDirectMessage($recipientId: ID!, $content: String!) {
    sendDirectMessage(recipientId: $recipientId, content: $content) {
      success
      message {
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
  }
`;

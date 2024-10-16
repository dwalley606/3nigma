import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $senderId: ID!
    $recipientId: ID!
    $content: String!
    $isGroupMessage: Boolean!
  ) {
    sendMessage(
      senderId: $senderId
      recipientId: $recipientId
      content: $content
      isGroupMessage: $isGroupMessage
    ) {
      id
      content
      timestamp
      senderId
      recipientId
    }
  }
`;

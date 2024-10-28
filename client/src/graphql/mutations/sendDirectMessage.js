import { gql } from "@apollo/client";

export const SEND_DIRECT_MESSAGE = gql`
  mutation SendDirectMessage(
    $senderId: ID!
    $recipientId: ID!
    $content: String!
  ) {
    sendDirectMessage(
      senderId: $senderId
      recipientId: $recipientId
      content: $content
    ) {
      id
      content
      timestamp
      senderId
      senderName
      userRecipientId 
      read
      isGroupMessage
    }
  }
`;


import { gql } from "@apollo/client";

export const SEND_GROUP_MESSAGE = gql`
  mutation SendGroupMessage(
    $senderId: ID!
    $groupId: ID!
    $content: String!
  ) {
    sendGroupMessage(
      senderId: $senderId
      groupId: $groupId
      content: $content
    ) {
      id
      content
      timestamp
      senderId
      senderName
      groupRecipientId
      read
      isGroupMessage
      groupName
    }
  }
`;


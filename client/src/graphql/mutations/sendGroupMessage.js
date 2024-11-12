import { gql } from "@apollo/client";

export const SEND_GROUP_MESSAGE = gql`
  mutation sendGroupMessage($groupId: ID!, $content: String!) {
    sendGroupMessage(groupId: $groupId, content: $content) {
      success
      message {
        id
        content
        sender {
          id
          username
        }
        groupRecipientId
        timestamp
        isGroupMessage
      }
    }
  }
`;

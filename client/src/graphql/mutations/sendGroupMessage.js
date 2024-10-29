import { gql } from "@apollo/client";

export const SEND_GROUP_MESSAGE = gql`
  mutation sendGroupMessage($groupId: ID!, $content: String!) {
    sendGroupMessage(groupId: $groupId, content: $content) {
      id
      content
      sender {
        id
        username
      }
      timestamp
      isGroupMessage
    }
  }
`;

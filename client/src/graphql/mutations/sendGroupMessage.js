import { gql } from '@apollo/client';

export const SEND_GROUP_MESSAGE = gql`
  mutation sendGroupMessage($senderId: ID!, $groupId: ID!, $content: String!) {
    sendGroupMessage(senderId: $senderId, groupId: $groupId, content: $content) {
      id
      content
      sender {
        id
        username
      }
      timestamp
    }
  }
`;


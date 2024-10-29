import { gql } from '@apollo/client';

export const SEND_DIRECT_MESSAGE = gql`
  mutation sendDirectMessage($senderId: ID!, $recipientId: ID!, $content: String!) {
    sendDirectMessage(senderId: $senderId, recipientId: $recipientId, content: $content) {
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


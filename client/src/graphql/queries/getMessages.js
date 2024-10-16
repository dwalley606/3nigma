import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query getMessages($senderId: ID!, $recipientId: ID!) {
    getMessages(senderId: $senderId, recipientId: $recipientId) {
      id
      senderId
      recipientId
      content
      timestamp
      read
      isGroupMessage
    }
  }
`;


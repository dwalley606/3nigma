import { gql } from "@apollo/client";

export const SEND_CONTACT_REQUEST = gql`
  mutation SendContactRequest($fromUserId: ID!, $toUserId: ID!) {
    sendContactRequest(fromUserId: $fromUserId, toUserId: $toUserId) {
      id
      from {
        id
      }
      to {
        id
      }
      status
    }
  }
`;

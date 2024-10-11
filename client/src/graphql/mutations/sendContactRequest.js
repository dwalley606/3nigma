import { gql } from "@apollo/client";

export const SEND_CONTACT_REQUEST_MUTATION = gql`
  mutation SendContactRequest($fromUserId: ID!, $toUserId: ID!) {
    sendContactRequest(fromUserId: $fromUserId, toUserId: $toUserId) {
      id
      from
      to
      status
    }
  }
`;

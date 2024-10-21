// client/src/graphql/queries/getContactRequests.js
import { gql } from "@apollo/client";

export const GET_CONTACT_REQUESTS = gql`
  query getContactRequests($userId: ID!) {
    getContactRequests(userId: $userId) {
      id
      from {
        id
        username
        email
      }
      status
    }
  }
`;

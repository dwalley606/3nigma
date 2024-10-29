import { gql } from '@apollo/client';

export const GET_CONTACTS = gql`
  query getContacts($userId: ID!) {
    getContacts(userId: $userId) {
      id
      username
      email
    }
  }
`;

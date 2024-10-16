import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      username
      email
      phoneNumber
      publicKey
      lastSeen
      profilePicUrl
      contacts {
        id
        username
      }
    }
  }
`;


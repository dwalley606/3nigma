import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    getUserById(id: $id) {
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

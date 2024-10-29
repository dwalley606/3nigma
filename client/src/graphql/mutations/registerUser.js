import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation registerUser($username: String!, $email: String!, $password: String!, $phoneNumber: String!) {
    registerUser(username: $username, email: $email, password: $password, phoneNumber: $phoneNumber) {
      user {
        id
        username
        email
      }
    }
  }
`;

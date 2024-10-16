import { gql } from '@apollo/client';

export const REGISTER_USER_MUTATION = gql`
  mutation registerUser($username: String!, $email: String!, $password: String!, $phoneNumber: String!) {
    registerUser(username: $username, email: $email, password: $password, phoneNumber: $phoneNumber) {
      user {
        _id
        username
        email
        phoneNumber
      }
    }
  }
`;
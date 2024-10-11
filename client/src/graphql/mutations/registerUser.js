import { gql } from "@apollo/client";

// Define the mutation
export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($username: String!, $phoneNumber: String!) {
    registerUser(username: $username, phoneNumber: $phoneNumber) {
      user {
        id
        username
        phoneNumber
        publicKey
      }
      privateKey
    }
  }
`;

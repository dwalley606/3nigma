import { gql } from "@apollo/client";

// Define the mutation
export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
    $phoneNumber: String!
  ) {
    registerUser(
      username: $username
      email: $email
      password: $password
      phoneNumber: $phoneNumber
    ) {
      user {
        id
        username
        email
        phoneNumber
        publicKey
      }
      privateKey
      token
    }
  }
`;

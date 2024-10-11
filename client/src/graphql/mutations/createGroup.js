import { gql } from "@apollo/client";

export const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($name: String!, $memberIds: [ID!]!) {
    createGroup(name: $name, memberIds: $memberIds) {
      id
      name
      members {
        id
        username
      }
    }
  }
`;

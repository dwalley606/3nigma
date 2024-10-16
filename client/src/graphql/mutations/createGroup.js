import { gql } from "@apollo/client";

export const CREATE_GROUP = gql`
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

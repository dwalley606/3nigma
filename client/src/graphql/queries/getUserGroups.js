import { gql } from "@apollo/client";

export const GET_USER_GROUPS = gql`
  query GetUserGroups($userId: ID!) {
    getUserGroups(userId: $userId) {
      id
      name
      members {
        id
        username
      }
      admins {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

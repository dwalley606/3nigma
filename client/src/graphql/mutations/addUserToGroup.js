import { gql } from "@apollo/client";

export const ADD_USER_TO_GROUP = gql`
  mutation AddUserToGroup($groupId: ID!, $userId: ID!) {
    addUserToGroup(groupId: $groupId, userId: $userId) {
      id
      members {
        id
        username
      }
    }
  }
`;

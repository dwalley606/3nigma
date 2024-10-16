import { gql } from "@apollo/client";

export const ADD_GROUP_MEMBER= gql`
  mutation AddGroupMember($groupId: ID!, $userId: ID!) {
    addGroupMember(groupId: $groupId, userId: $userId) {
      id
      members {
        id
        username
      }
    }
  }
`;

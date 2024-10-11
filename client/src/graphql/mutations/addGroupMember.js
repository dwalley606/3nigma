import { gql } from "@apollo/client";

export const ADD_GROUP_MEMBER_MUTATION = gql`
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

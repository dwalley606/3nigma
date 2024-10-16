import { gql } from "@apollo/client";

export const REMOVE_GROUP_MEMBER = gql`
  mutation RemoveGroupMember($groupId: ID!, $userId: ID!) {
    removeGroupMember(groupId: $groupId, userId: $userId) {
      id
      members {
        id
        username
      }
    }
  }
`;

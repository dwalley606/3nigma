import { gql } from "@apollo/client";

export const REMOVE_GROUP_MEMBER_MUTATION = gql`
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

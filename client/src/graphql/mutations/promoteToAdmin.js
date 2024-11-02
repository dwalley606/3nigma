import { gql } from '@apollo/client';

export const PROMOTE_TO_ADMIN = gql`
  mutation PromoteToAdmin($groupId: ID!, $userId: ID!) {
    promoteToAdmin(groupId: $groupId, userId: $userId) {
      id
      name
      admins {
        id
        username
      }
      members {
        id
        username
      }
    }
  }
`;

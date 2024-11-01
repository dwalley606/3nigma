import { gql } from "@apollo/client";

export const GET_GROUP_DETAILS = gql`
  query getGroupDetails($userId: ID!) {
    getGroupDetails(userId: $userId) {
      id
      name
      lastMessage {
        id
        content
        timestamp
        sender {
          id
          username
        }
      }
      admins {
        id
        username
      }
      members {
        id
        username
      }
      isGroup
    }
  }
`;

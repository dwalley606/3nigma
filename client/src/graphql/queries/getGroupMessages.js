import { gql } from "@apollo/client";

export const GET_GROUP_MESSAGES = gql`
  query getGroupMessages($groupId: ID!) {
    getGroupMessages(groupId: $groupId) {
      id
      content
      sender {
        id
        username
      }
      timestamp
      isGroupMessage
      groupRecipientId
    }
  }
`;

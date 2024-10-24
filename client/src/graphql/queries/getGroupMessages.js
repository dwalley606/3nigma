import { gql } from "@apollo/client";

export const GET_GROUP_MESSAGES = gql`
  query getGroupMessages($groupID: ID!) {
    getGroupMessages(groupID: $groupID) {
      id
      senderName
      content
      timestamp
    }
  }
`;

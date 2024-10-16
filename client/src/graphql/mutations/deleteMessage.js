import { gql } from "@apollo/client";

export const DELETE_MESSAGE= gql`
  mutation DeleteMessage($messageId: ID!, $forEveryone: Boolean!) {
    deleteMessage(messageId: $messageId, forEveryone: $forEveryone)
  }
`;

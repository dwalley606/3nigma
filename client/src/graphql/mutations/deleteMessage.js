import { gql } from "@apollo/client";

export const DELETE_MESSAGE_MUTATION = gql`
  mutation DeleteMessage($messageId: ID!, $forEveryone: Boolean!) {
    deleteMessage(messageId: $messageId, forEveryone: $forEveryone)
  }
`;

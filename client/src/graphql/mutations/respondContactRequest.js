import { gql } from "@apollo/client";

export const RESPOND_CONTACT_REQUEST_MUTATION = gql`
  mutation RespondContactRequest($requestId: ID!, $status: String!) {
    respondContactRequest(requestId: $requestId, status: $status) {
      id
      status
    }
  }
`;

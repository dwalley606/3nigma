// client/src/components/Contacts/ContactRequests.jsx
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACT_REQUESTS } from "../../graphql/queries/getContactRequests";
import { RESPOND_CONTACT_REQUEST } from "../../graphql/mutations/respondContactRequest";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";

const ContactRequests = ({ userId }) => {
  const { loading, error, data } = useQuery(GET_CONTACT_REQUESTS, {
    variables: { userId },
  });

  const [respondContactRequest] = useMutation(RESPOND_CONTACT_REQUEST);

  const handleResponse = (requestId, status) => {
    respondContactRequest({
      variables: { requestId, status },
      refetchQueries: [{ query: GET_CONTACT_REQUESTS, variables: { userId } }],
    });
  };

  if (loading) return <Typography>Loading contact requests...</Typography>;
  if (error)
    return <Typography>Error loading requests: {error.message}</Typography>;

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="h5" gutterBottom>
        Contact Requests
      </Typography>
      <List>
        {data.getContactRequests.map((request) => (
          <ListItem key={request.id}>
            <ListItemText
              primary={request.from.username}
              secondary={request.from.email}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleResponse(request.id, "accepted")}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleResponse(request.id, "denied")}
            >
              Deny
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ContactRequests;

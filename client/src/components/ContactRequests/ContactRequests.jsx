// client/src/components/Contacts/ContactRequests.jsx
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACT_REQUESTS } from "../../graphql/queries/getContactRequests";
import { RESPOND_CONTACT_REQUEST } from "../../graphql/mutations/respondContactRequest";
import { useContacts } from "../../context/StoreProvider"; // Import the useContacts hook
import {
  ACCEPT_CONTACT_REQUEST,
  REJECT_CONTACT_REQUEST,
} from "../../context/contacts/contactsActions"; // Import action types
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
  const { dispatch } = useContacts(); // Use the contacts context

  const handleResponse = async (requestId, status) => {
    try {
      const { data } = await respondContactRequest({
        variables: { requestId, status },
        refetchQueries: [
          { query: GET_CONTACT_REQUESTS, variables: { userId } },
        ],
      });

      // Dispatch the action based on the response
      if (status === "accepted") {
        dispatch({
          type: ACCEPT_CONTACT_REQUEST,
          payload: data.respondContactRequest,
        });
      } else {
        dispatch({
          type: REJECT_CONTACT_REQUEST,
          payload: data.respondContactRequest,
        });
      }
    } catch (error) {
      console.error("Error responding to contact request:", error);
    }
  };

  if (loading) return <Typography>Loading contact requests...</Typography>;
  if (error)
    return <Typography>Error loading requests: {error.message}</Typography>;

  // Check if there are any contact requests
  const contactRequests = data.getContactRequests;

  return (
    <Box
      sx={{
        marginBottom: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Contact Requests
      </Typography>
      {contactRequests.length === 0 ? (
        <Typography>No contact requests to respond to.</Typography> // Message when there are no requests
      ) : (
        <List>
          {contactRequests.map((request) => (
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
      )}
    </Box>
  );
};

export default ContactRequests;

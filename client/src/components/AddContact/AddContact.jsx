// client/src/components/Contacts/AddContact.jsx
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "../../graphql/queries/getUsers";
import { SEND_CONTACT_REQUEST } from "../../graphql/mutations/sendContactRequest";
import { useAuth } from "../../context/StoreProvider";
import { useContacts } from "../../context/StoreProvider"; // Import the useContacts hook
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { GET_CONTACT_REQUESTS } from "../../graphql/queries/getContactRequests"; // Import the query

const AddContact = ({ existingContacts }) => {
  const { state } = useAuth();
  const userId = state.user?.id;

  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(GET_USERS);
  const {
    loading: loadingRequests,
    error: errorRequests,
    data: dataRequests,
  } = useQuery(GET_CONTACT_REQUESTS, {
    variables: { userId },
  });
  const [sendContactRequest] = useMutation(SEND_CONTACT_REQUEST);
  const [searchQuery, setSearchQuery] = useState("");
  const { state: contactsState, dispatch } = useContacts(); // Use the contacts context

  if (loadingUsers) return <Typography>Loading users...</Typography>;
  if (errorUsers)
    return <Typography>Error loading users: {errorUsers.message}</Typography>;
  if (loadingRequests)
    return <Typography>Loading contact requests...</Typography>;
  if (errorRequests)
    return (
      <Typography>Error loading requests: {errorRequests.message}</Typography>
    );

  const existingContactIds = new Set(
    existingContacts.map((contact) => contact.id)
  );

  // Ensure requestedContacts is defined
  const requestedContacts = contactsState.requestedContacts || new Set();

  // Get pending requests from the fetched data
  const pendingRequests = dataRequests.getContactRequests.map((request) => {
    return request.from.id; // Get the ID of the user who sent the request
  });

  // Get the IDs of users who have sent requests to the signed-in user
  const incomingRequests = dataRequests.getContactRequests
    .filter((request) => request.to.id === userId) // Assuming the request has a 'to' field
    .map((request) => request.from.id); // Get the ID of the user who sent the request

  // Combine both incoming and outgoing pending requests
  const allPendingRequests = new Set([...pendingRequests, ...incomingRequests]);

  // Filter users based on the search query, exclude added users, existing contacts, and pending requests
  const filteredUsers = dataUsers.getUsers.filter(
    (user) =>
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !existingContactIds.has(user.id) && // Exclude existing contacts
      !requestedContacts.has(user.id) && // Exclude users who have been sent a request
      !allPendingRequests.has(user.id) // Exclude users who have pending requests
  );

  const handleAddContact = async (toUserId) => {
    try {
      await sendContactRequest({
        variables: {
          fromUserId: userId,
          toUserId,
        },
      });
      dispatch({ type: "SEND_CONTACT_REQUEST", payload: toUserId }); // Add to requested contacts
    } catch (error) {
      console.error("Error sending contact request:", error);
    }
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Contact
      </Typography>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <List>
        {filteredUsers.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleAddContact(user.id)}
                disabled={requestedContacts.has(user.id)} // Disable if already requested
              >
                {requestedContacts.has(user.id) ? "Requested" : "Add"}
              </Button>
            }
          >
            <ListItemText primary={user.username} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddContact;

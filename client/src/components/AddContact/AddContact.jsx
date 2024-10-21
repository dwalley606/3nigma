// client/src/components/Contacts/AddContact.jsx
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "../../graphql/queries/getUsers";
import { SEND_CONTACT_REQUEST } from "../../graphql/mutations/sendContactRequest";
import { useAuth } from "../../context/auth/AuthContext";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  TextField,
} from "@mui/material";

const AddContact = ({ existingContacts, requestedUserIds }) => {
  const { state } = useAuth();
  const userId = state.user?.id;

  const { loading, error, data } = useQuery(GET_USERS);
  const [sendContactRequest] = useMutation(SEND_CONTACT_REQUEST);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState(new Set());

  if (loading) return <Typography>Loading users...</Typography>;
  if (error)
    return <Typography>Error loading users: {error.message}</Typography>;

  const existingContactIds = new Set(
    existingContacts.map((contact) => contact.id)
  );

  // Filter users based on the search query, exclude added users, existing contacts, and requested users
  const filteredUsers = data.getUsers.filter(
    (user) =>
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !addedUsers.has(user.id) && // Exclude users who have been added
      !existingContactIds.has(user.id) && // Exclude existing contacts
      !requestedUserIds.has(user.id) // Exclude users who have been sent a request
  );

  const handleAddContact = async (toUserId) => {
    try {
      await sendContactRequest({
        variables: {
          fromUserId: userId,
          toUserId,
        },
      });
      setAddedUsers((prev) => new Set(prev).add(toUserId));
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
                disabled={addedUsers.has(user.id)}
              >
                {addedUsers.has(user.id) ? "Added" : "Add"}
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

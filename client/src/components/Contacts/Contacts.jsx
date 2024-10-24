// client/src/components/Contacts/Contacts.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../../graphql/queries/getContacts";
import AddContact from "../AddContact/AddContact";
import ContactRequests from "./ContactRequests";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

const Contacts = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Contacts: state.user", state.user); // Log the user state

    if (!state.user) {
      navigate('/login');
    }
  }, [state.user, navigate]);

  const {
    loading: contactsLoading,
    error: contactsError,
    data: contactsData,
  } = useQuery(GET_CONTACTS, {
    variables: { userId: state.user.id },
    skip: !state.user,
  });

  const [showAddContact, setShowAddContact] = useState(false);

  if (contactsLoading) return <Typography>Loading...</Typography>;
  if (contactsError)
    return (
      <Typography>Error loading contacts: {contactsError.message}</Typography>
    );

  const contacts = contactsData?.getContacts || [];

  return (
    <Box sx={{ padding: 2 }}>
      <ContactRequests userId={state.user.id} />
      {contacts.length === 0 ? (
        <Typography>No Current Contacts</Typography>
      ) : (
        <List>
          {contacts.map((contact) => (
            <ListItem key={contact.id}>
              <ListItemText
                primary={contact.username}
                secondary={contact.email}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAddContact(!showAddContact)}
      >
        {showAddContact ? "Hide Add Contact" : "Add Contact"}
      </Button>
      {showAddContact && (
        <AddContact
          existingContacts={contacts}
          requestedUserIds={new Set()} // Adjust as needed
        />
      )}
    </Box>
  );
};

export default Contacts;

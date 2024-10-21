// client/src/components/Contacts/Contacts.jsx
import { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../../graphql/queries/getContacts";
import { GET_CONTACT_REQUESTS } from "../../graphql/queries/getContactRequests";
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
  const {
    loading: contactsLoading,
    error: contactsError,
    data: contactsData,
  } = useQuery(GET_CONTACTS, {
    variables: { userId: state.user.id },
    skip: !state.user,
  });

  const {
    loading: requestsLoading,
    error: requestsError,
    data: requestsData,
  } = useQuery(GET_CONTACT_REQUESTS, {
    variables: { userId: state.user.id },
    skip: !state.user,
  });

  const [showAddContact, setShowAddContact] = useState(false);

  if (contactsLoading || requestsLoading)
    return <Typography>Loading...</Typography>;
  if (contactsError)
    return (
      <Typography>Error loading contacts: {contactsError.message}</Typography>
    );
  if (requestsError)
    return (
      <Typography>Error loading requests: {requestsError.message}</Typography>
    );

  const contacts = contactsData?.getContacts || [];
  const contactRequests = requestsData?.getContactRequests || [];

  // Extract the IDs of users to whom contact requests have been sent
  const requestedUserIds = new Set(
    contactRequests.map((request) => request.to.id)
  );

  return (
    <Box sx={{ padding: 2 }}>
      {contactRequests.length > 0 && <ContactRequests userId={state.user.id} />}
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
          requestedUserIds={requestedUserIds}
        />
      )}
    </Box>
  );
};

export default Contacts;

// client/src/components/Contacts/Contacts.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useView } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../graphql/queries/getContacts";
import AddContact from "../components/AddContact/AddContact";
import ContactRequests from "../components/ContactRequests/ContactRequests";
import BottomNav from "../components/BottomNav/BottomNav";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import { SET_CHAT_ACTIVE, SET_CURRENT_CONVERSATION, SET_RECIPIENT_ID } from "../context/view/viewActions";

const Contacts = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const { dispatch: viewDispatch } = useView();

  useEffect(() => {
    console.log("Contacts: state.user", state.user); // Log the user state

    if (!state.user) {
      navigate("/login");
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

  const handleMessageClick = (recipientId) => {
    // Find the existing conversation with the recipient
    const existingConversation = contactsData.getContacts.find(contact => contact.id === recipientId)?.conversationId;

    // Log the recipientId and existingConversation
    console.log("Recipient ID:", recipientId);
    console.log("Existing Conversation ID:", existingConversation);

    viewDispatch({ type: SET_CHAT_ACTIVE, payload: true });
    viewDispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: { conversationId: existingConversation || null, isGroupMessage: false },
    });
    viewDispatch({ type: SET_RECIPIENT_ID, payload: recipientId });

    // Log the dispatched actions
    console.log("Dispatched SET_CHAT_ACTIVE with payload:", true);
    console.log("Dispatched SET_CURRENT_CONVERSATION with payload:", { conversationId: existingConversation || null, isGroupMessage: false });
    console.log("Dispatched SET_RECIPIENT_ID with payload:", recipientId);

    navigate('/dashboard');
  };

  if (contactsLoading) return <Typography>Loading...</Typography>;
  if (contactsError)
    return (
      <Typography>Error loading contacts: {contactsError.message}</Typography>
    );

  const contacts = contactsData?.getContacts || [];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', 
      }}
    >
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '80vh', // Adjust to fit within the remaining space
          overflow: 'auto',
          width: '100%',
          maxWidth: '600px',
          boxShadow: 3, // Optional: add some shadow for better visibility
          backgroundColor: 'background.paper', // Optional: set a background color
        }}
      >
        <ContactRequests userId={state.user.id} />
        {contacts.length === 0 ? (
          <Typography>No Current Contacts</Typography>
        ) : (
          <List>
            {contacts.map((contact) => (
              <ListItem
                key={contact.id}
                secondaryAction={
                  <IconButton
                    color="secondary"
                    edge="end"
                    onClick={() => handleMessageClick(contact.id)}
                    aria-label="message"
                  >
                    <MessageIcon />
                  </IconButton>
                }
              >
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
        <BottomNav />
      </Box>
    </Box>
  );
};

export default Contacts;

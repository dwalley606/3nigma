// client/src/components/Chat/Chat.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import MessageInput from "../MessageInput/MessageInput";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/system';

const Chat = () => {
  const { state } = useAuth();
  const { otherUserId } = useParams();

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { userId: state.user.id, otherUserId },
    skip: !state.user || !otherUserId,
  });

  if (loading) return <p>Loading conversation...</p>;
  if (error) return <p>Error loading conversation: {error.message}</p>;

  const messages = data?.getConversation || [];

  // Styled components for messages
  const MessageListItem = styled(ListItem)(({ theme, isSender }) => ({
    justifyContent: isSender ? 'flex-end' : 'flex-start',
    display: 'flex',
    padding: theme.spacing(1),
  }));

  const MessageBubble = styled('div')(({ theme, isSender }) => ({
    maxWidth: '60%',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isSender ? theme.palette.primary.main : theme.palette.grey[300],
    color: isSender ? theme.palette.primary.contrastText : theme.palette.text.primary,
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <List sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        {messages.map((message) => (
          <MessageListItem key={message.id} isSender={message.senderId === state.user.id}>
            <MessageBubble isSender={message.senderId === state.user.id}>
              <ListItemText primary={message.content} />
            </MessageBubble>
          </MessageListItem>
        ))}
      </List>
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        width: '100%', 
        backgroundColor: 'white', 
        padding: 1,
        display: 'flex', 
        alignItems: 'center' // Center items vertically
      }}>        <MessageInput recipientId={otherUserId} />
      </Box>
    </Box>
  );
};

export default Chat;

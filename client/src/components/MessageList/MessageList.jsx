import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const MessageList = ({ groupedMessages, onMessageClick }) => {
  return (
    <Box className="message-list" sx={{ padding: 2 }}>
      {Object.entries(groupedMessages).map(([otherUserId, { messages, senderName }]) => {
        const lastMessage = messages[messages.length - 1];
        return (
          <Paper 
            key={otherUserId} 
            onClick={() => onMessageClick(otherUserId)}
            sx={{ 
              padding: 2, 
              marginBottom: 2, 
              cursor: 'pointer', 
              '&:hover': { backgroundColor: 'grey.100' } 
            }}
          >
            <Typography variant="h6" component="h3">
              {senderName || "Unknown User"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {lastMessage.content}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default MessageList;

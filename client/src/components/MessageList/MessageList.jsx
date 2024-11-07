import { List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = ({ groupedMessages, onMessageClick }) => {
  return (
    <List>
      {groupedMessages.map((conversation) => {
        // Check if conversation and its properties are defined
        if (!conversation || !conversation.lastMessage) {
          return null; // Skip this iteration if data is not valid
        }

        const { lastMessage, isGroup } = conversation;

        return (
          <ListItem
            key={conversation.id}
            button
            onClick={() => onMessageClick(conversation.id, isGroup)}
          >
            <ListItemText
              primary={lastMessage.content}
              secondary={
                isGroup
                  ? `Group: ${lastMessage.sender.username}` // Display group name or sender for group messages
                  : `From: ${lastMessage.sender.username}` // Display sender for direct messages
              }
            />
            <Typography variant="caption">
              {new Date(parseInt(lastMessage.timestamp, 10)).toLocaleString(
                undefined,
                {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MessageList;

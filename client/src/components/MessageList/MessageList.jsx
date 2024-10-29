import { List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = ({ groupedMessages, onMessageClick }) => {
  return (
    <List>
      {groupedMessages.map((conversation) => {
        // Check if conversation and its properties are defined
        if (!conversation || !conversation.lastMessage) {
          return null; // Skip this iteration if data is not valid
        }

        const { lastMessage } = conversation;

        return (
          <ListItem
            key={conversation.id}
            button
            onClick={() =>
              onMessageClick(conversation.id, conversation.isGroup)
            }
          >
            <ListItemText
              primary={lastMessage.content}
              secondary={lastMessage.sender.username}
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

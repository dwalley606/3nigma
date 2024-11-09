import { List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = ({ groupedMessages, onMessageClick }) => {
  return (
    <List>
      {groupedMessages.map((conversation) => {
        if (!conversation || !conversation.lastMessage) {
          return null; // Skip this iteration if data is not valid
        }

        const { lastMessage, isGroup, name, participants } = conversation;

        // Determine display name
        const displayName = isGroup
          ? name || participants.map(p => p.username).join(', ') // Fallback to participant names if name is not available
          : participants.find(p => p.id !== lastMessage.sender.id)?.username;

        return (
          <ListItem
            key={conversation.id}
            button
            onClick={() => onMessageClick(conversation.id, isGroup)}
          >
            <ListItemText
              primary={
                <Typography variant="h6" component="span">
                  {displayName}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" component="span">
                    {lastMessage.content}
                  </Typography>
                  <Typography variant="caption" component="div" sx={{ marginTop: 0.5 }}>
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
                </>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default MessageList;

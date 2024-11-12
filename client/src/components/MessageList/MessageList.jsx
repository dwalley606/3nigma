import { List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = ({ groupedMessages, onMessageClick }) => {
  const handleClick = (conversation) => {
    const { id, isGroup, recipientId } = conversation;
    onMessageClick(id, isGroup, recipientId);
  };

  return (
    <List>
      {groupedMessages.map((conversation) => {
        if (!conversation || !conversation.lastMessage) {
          return null; // Skip this iteration if data is not valid
        }

        const { lastMessage, name, participants } = conversation;

        // Use the group name if available, otherwise determine the other user's name
        const displayName = name || participants.find(p => p.id !== lastMessage.sender.id)?.username;

        return (
          <ListItem
            key={conversation.id}
            button
            onClick={() => handleClick(conversation)}
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

import { List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = ({ groupedMessages, onMessageClick }) => {
  return (
    <List>
      {groupedMessages.map(({ name, mostRecentMessage, messages }, index) => {
        const key = mostRecentMessage.isGroupMessage
          ? mostRecentMessage.groupRecipientId
          : mostRecentMessage.senderId;

        return (
          <ListItem
            key={key} // Use the actual ID as the key
            button
            onClick={() =>
              onMessageClick(key, mostRecentMessage.isGroupMessage)
            }
          >
            <ListItemText
              primary={name}
              secondary={mostRecentMessage.content}
            />
            <Typography variant="caption">
              {new Date(
                parseInt(mostRecentMessage.timestamp, 10)
              ).toLocaleString(undefined, {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  );
};

export default MessageList;

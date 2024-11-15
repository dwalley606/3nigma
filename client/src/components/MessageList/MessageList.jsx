import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useAuth } from "../../context/StoreProvider"; // Import useAuth to access the signed-in user

const MessageList = ({ groupedMessages, onMessageClick, refetch }) => {
  const { state: authState } = useAuth(); // Get the signed-in user's state
  const signedInUserId = authState.user?.id; // Get the signed-in user's ID

  return (
    <List>
<<<<<<< Updated upstream
      {groupedMessages.map((conversation) => {
        if (!conversation || !conversation.lastMessage) {
          return null; // Skip this iteration if data is not valid
        }

        const { lastMessage, name, participants, isGroup, groupId } =
          conversation; // Destructure isGroup and groupId

        // Use the group name if available, otherwise determine the other user's name
        const displayName =
          name ||
          participants.find((p) => p.id !== lastMessage.sender.id)?.username;

        // Determine recipientId based on whether it's a group or direct message
        const recipientId = isGroup
          ? null
          : participants.find((p) => p.id !== signedInUserId)?.id; // Exclude the signed-in user

        return (
          <ListItem
            key={conversation.id}
            button
            onClick={() => {
              onMessageClick(
                conversation.id,
                isGroup,
                recipientId,
                groupId // Pass groupId
              ); // Call the onMessageClick function
              refetch(); // Call refetch to get the latest messages for the selected group
            }} // Pass groupId and recipientId
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
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ marginTop: 0.5 }}
                  >
                    {new Date(
                      parseInt(lastMessage.timestamp, 10)
                    ).toLocaleString(undefined, {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </>
              }
            />
          </ListItem>
        );
      })}
=======
      {groupedMessages.map(({ name, mostRecentMessage }, index) => (
        <ListItem
          key={index}
          button
          onClick={() =>
            onMessageClick(
              mostRecentMessage.isGroupMessage
                ? mostRecentMessage.recipientId.toString()
                : mostRecentMessage.senderId.toString(),
              mostRecentMessage.isGroupMessage
            )
          }
        >
          <ListItemText primary={name} secondary={mostRecentMessage.content} />
          <Typography variant="caption">
            {new Date(parseInt(mostRecentMessage.timestamp, 10)).toLocaleString(
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
      ))}
>>>>>>> Stashed changes
    </List>
  );
};

export default MessageList;

import { Typography, Box } from "@mui/material";
import { useAuth } from "../../context/StoreProvider";
import Message from "../Message/Message";

const GroupChat = ({ conversation, onBack }) => {
  const { state: authState } = useAuth();

  if (!conversation) {
    return <Typography>Please select a group to view messages.</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {conversation.messages.length === 0 ? (
          <Typography>No messages in this group yet.</Typography>
        ) : (
          conversation.messages.map((message) => {
            if (!message.sender) {
              console.warn("Message sender is undefined:", message);
              return null; // Skip rendering if sender is undefined
            }

            return (
              <Message
                key={message.id}
                message={message}
                isOwner={message.sender.id === authState.user.id}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default GroupChat;

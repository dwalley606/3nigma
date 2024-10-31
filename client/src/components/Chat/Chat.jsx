// client/src/components/Chat/Chat.jsx
import { Typography, Box } from "@mui/material";
import { useAuth } from "../../context/StoreProvider";
import MessageInput from "../MessageInput/MessageInput";
import Message from "../Message/Message";

const Chat = ({ conversation, onBack }) => {
  const { state: authState } = useAuth();

  if (!conversation) {
    return <Typography>Please select a user to view messages.</Typography>;
  }

  const handleSendMessage = (newMessage) => {
    // Handle sending messages
    console.log("Sending message:", newMessage);
    // You might want to update the conversation state in the parent component
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {conversation.messages.length === 0 ? (
          <Typography>No messages in this conversation yet.</Typography>
        ) : (
          conversation.messages.map((message) => {
            // Defensive check for sender
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
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
          padding: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <MessageInput
          recipientId={conversation.id}
          onSendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default Chat;

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_DIRECT_MESSAGE } from "../../graphql/mutations/sendDirectMessage";
import { SEND_GROUP_MESSAGE } from "../../graphql/mutations/sendGroupMessage";
import { useAuth } from "../../context/StoreProvider";
import { useMessages } from "../../context/StoreProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const MessageInput = ({ recipientId, isGroupMessage, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const { state: authState } = useAuth();
  const { dispatch } = useMessages();
  const [sendDirectMessage] = useMutation(SEND_DIRECT_MESSAGE);
  const [sendGroupMessage] = useMutation(SEND_GROUP_MESSAGE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: authState.user.id,
      content: message,
      timestamp: new Date().toISOString(),
    };

    onSendMessage(newMessage);
    dispatch({ type: "ADD_MESSAGE", payload: newMessage });

    try {
      if (isGroupMessage) {
        console.log("Sending group message:", {
          senderId: authState.user.id,
          groupId: recipientId,
          content: message,
        });
        await sendGroupMessage({
          variables: {
            senderId: authState.user.id,
            groupId: recipientId,
            content: message,
          },
        });
      } else {
        console.log("Sending direct message:", {
          senderId: authState.user.id,
          recipientId,
          content: message,
        });
        await sendDirectMessage({
          variables: {
            senderId: authState.user.id,
            recipientId,
            content: message,
          },
        });
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        height: "10vh",
        position: "fixed",
        bottom: 0,
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: 1,
      }}
    >
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        multiline
        minRows={1}
        maxRows={4}
        variant="filled"
        fullWidth
        sx={{ marginRight: 1 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_GROUP_MESSAGE } from "../../graphql/mutations/sendGroupMessage";
import { SEND_DIRECT_MESSAGE } from "../../graphql/mutations/sendDirectMessage";
import { useAuth } from "../../context/StoreProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const MessageInput = ({ recipientId, isGroupMessage, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const { state: authState } = useAuth();
  const [sendGroupMessage] = useMutation(SEND_GROUP_MESSAGE);
  const [sendDirectMessage] = useMutation(SEND_DIRECT_MESSAGE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      if (isGroupMessage) {
        const { data } = await sendGroupMessage({
          variables: {
            groupId: recipientId,
            content: message,
          },
        });
        onSendMessage(data.sendGroupMessage);
      } else {
        const { data } = await sendDirectMessage({
          variables: {
            recipientId: recipientId,
            content: message,
          },
        });
        onSendMessage(data.sendDirectMessage);
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

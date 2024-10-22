import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations/sendMessage";
import { useAuth } from "../../context/auth/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const MessageInput = ({ recipientId, isGroupMessage }) => {
  const [message, setMessage] = useState("");
  const { state } = useAuth();
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      await sendMessage({
        variables: {
          senderId: state.user.id,
          recipientId,
          content: message,
          isGroupMessage: false,
        },
      });
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", alignItems: "center", width: "100%" }}
    >
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        multiline
        minRows={1}
        maxRows={10}
        variant="filled"
        fullWidth
        style={{ marginRight: "10px" }}
      />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>
    </form>
  );
};

export default MessageInput;

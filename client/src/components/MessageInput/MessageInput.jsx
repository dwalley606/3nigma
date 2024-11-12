import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_GROUP_MESSAGE } from "../../graphql/mutations/sendGroupMessage";
import { SEND_DIRECT_MESSAGE } from "../../graphql/mutations/sendDirectMessage";
import { useAuth, useMessages } from "../../context/StoreProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { SET_SHOULD_REFETCH } from "../../context/view/viewActions";

const MessageInput = ({
  recipientId,
  isGroupMessage,
  groupId,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");
  const { state: authState } = useAuth();
  const [sendGroupMessage] = useMutation(SEND_GROUP_MESSAGE);
  const [sendDirectMessage] = useMutation(SEND_DIRECT_MESSAGE);
  const { dispatch } = useMessages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      let response;
      if (isGroupMessage) {
        response = await sendGroupMessage({
          variables: { groupId, content: message },
        });
      } else {
        response = await sendDirectMessage({
          variables: { recipientId, content: message },
        });
      }

      if (response && response.data) {
        const success = isGroupMessage
          ? response.data.sendGroupMessage.success
          : response.data.sendDirectMessage.success;

        if (success) {
          dispatch({ type: SET_SHOULD_REFETCH, payload: true });
        }
      } else {
        console.error("Unexpected response structure:", response);
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

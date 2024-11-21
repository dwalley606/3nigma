import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_GROUP_MESSAGE } from "../../graphql/mutations/sendGroupMessage";
import { SEND_DIRECT_MESSAGE } from "../../graphql/mutations/sendDirectMessage";
import { useAuth, useMessages } from "../../context/StoreProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { SET_SHOULD_REFETCH } from "../../context/view/viewActions";
import { ADD_MESSAGE } from "../../context/message/messageActions";
import { GET_CONVERSATIONS } from "../../graphql/queries/getConversations";

const MessageInput = ({
  conversationId,
  recipientId,
  isGroupMessage,
  groupId,
  onSendMessage,
}) => {
  const [message, setMessage] = useState("");
  const { state: authState } = useAuth();
  const [sendGroupMessage] = useMutation(SEND_GROUP_MESSAGE);
  const [sendDirectMessage] = useMutation(SEND_DIRECT_MESSAGE, {
    update(cache, { data }) {
      const existingConversations = cache.readQuery({
        query: GET_CONVERSATIONS,
        variables: { userId: authState.user.id },
      });

      if (existingConversations) {
        const updatedConversations = existingConversations.getConversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: data.sendDirectMessage.message
            };
          }
          return conv;
        });

        cache.writeQuery({
          query: GET_CONVERSATIONS,
          variables: { userId: authState.user.id },
          data: {
            getConversations: updatedConversations
          }
        });
      }
    }
  });
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
        const newMessage = isGroupMessage
          ? response.data.sendGroupMessage.message
          : response.data.sendDirectMessage.message;

        dispatch({
          type: ADD_MESSAGE,
          payload: {
            conversationId,
            message: newMessage
          }
        });
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: 'sticky',
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: 1,
        zIndex: 1,
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
        sx={{
          marginRight: 1,
          '& .MuiInputBase-root': {
            borderRadius: '10px',
            padding: '10px',
          },
          '& .MuiInputBase-input::placeholder': {
            lineHeight: 'normal',
          },
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;

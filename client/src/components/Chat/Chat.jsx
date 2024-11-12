// client/src/components/Chat/Chat.jsx
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import Message from "../Message/Message";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth } from "../../context/StoreProvider";
import { useMessages } from "../../context/StoreProvider";
import { SET_MESSAGES } from "../../context/message/messageActions";

const Chat = ({ conversationId }) => {
  console.log("Chat component mounted with conversationId:", conversationId);

  const { state: authState } = useAuth();
  const { state: messageState, dispatch } = useMessages();
  const userId = authState.user?.id;

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
    skip: !conversationId, // Ensure the query only runs if conversationId is valid
  });

  useEffect(() => {
    if (data && data.getConversation) {
      const conversation = data.getConversation;
      const messages = conversation.messages;

      // Dispatch action to update messages in global state
      dispatch({
        type: SET_MESSAGES,
        payload: { conversationId, messages },
      });
    } else {
      console.log("No conversation data available");
    }
  }, [data, dispatch, conversationId]);

  // Use messages from global state
  const messages = messageState.conversations?.[conversationId]?.messages || [];

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error fetching messages: {error.message}</Typography>;

  if (!messages || messages.length === 0) {
    return <Typography>No conversation found.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        height: "80vh",
        overflowY: "auto",
        padding: 2,
      }}
    >
      {messages.map((message) => {
        const isOwner = message.sender.id === userId;
        return <Message key={message.id} message={message} isOwner={isOwner} />;
      })}
    </Box>
  );
};

export default Chat;

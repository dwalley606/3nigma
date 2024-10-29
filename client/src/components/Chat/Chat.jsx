// client/src/components/Chat/Chat.jsx
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useMessages } from "../../context/message/MessageContext"; // Import the useMessages hook
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import { Typography, Box } from "@mui/material";
import MessageInput from "../MessageInput/MessageInput";
import Message from "../Message/Message";
import { useEffect } from "react";

const Chat = () => {
  const { state: authState } = useAuth();
  const { state: messageState, dispatch } = useMessages(); // Use the message context
  const { otherUserId } = useParams(); // Extract otherUserId from URL

  console.log("Rendering Chat with otherUserId:", otherUserId); // Debugging log

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { userId: authState.user.id, otherUserId },
    skip: !authState.user || !otherUserId,
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_MESSAGES", payload: data.getConversation });
    }
  }, [data, dispatch]);

  if (!otherUserId) {
    return <Typography>Please select a user to view messages.</Typography>;
  }

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error loading messages: {error.message}</Typography>;

  const handleSendMessage = (newMessage) => {
    dispatch({ type: "ADD_MESSAGE", payload: newMessage });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {messageState.messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isOwner={message.senderId === authState.user.id}
          />
        ))}
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
          recipientId={otherUserId}
          onSendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default Chat;

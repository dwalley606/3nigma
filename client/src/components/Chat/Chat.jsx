// client/src/components/Chat/Chat.jsx
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import { Typography, Box } from "@mui/material";
import MessageInput from "../MessageInput/MessageInput";
import Message from "../Message/Message";

const Chat = () => {
  const { state } = useAuth();
  const { otherUserId } = useParams(); // Extract otherUserId from URL
  const location = useLocation();
  const senderName = location.state?.senderName || "Unknown User";

  console.log("Rendering Chat with otherUserId:", otherUserId); // Debugging log

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { userId: state.user.id, otherUserId },
    skip: !state.user || !otherUserId,
  });

  if (!otherUserId) {
    return <Typography>Please select a user to view messages.</Typography>;
  }

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error loading messages: {error.message}</Typography>;

  const messages = data?.getConversation || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isOwner={message.senderId === state.user.id}
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
        <MessageInput recipientId={otherUserId} />
      </Box>
    </Box>
  );
};

export default Chat;

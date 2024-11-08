// client/src/components/Chat/Chat.jsx
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import MessageInput from "../MessageInput/MessageInput";
import Message from "../Message/Message";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth } from "../../context/StoreProvider";

const Chat = ({ conversationId }) => {
  const { state: authState } = useAuth();
  const userId = authState.user?.id;

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { conversationId }, // Pass the conversationId directly
  });

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error fetching messages: {error.message}</Typography>;

  const messages = data.getConversation;

  if (!messages || messages.length === 0) {
    return <Typography>No conversation found.</Typography>;
  }

  const handleSendMessage = (newMessage) => {
    // Logic to handle new message (e.g., update local state or context)
  };

  return (
    <Box sx={{ padding: 2 }}>
      {messages.map((message) => {
        const isOwner = message.sender.id === userId;
        return <Message key={message.id} message={message} isOwner={isOwner} />;
      })}
    </Box>
  );
};

export default Chat;

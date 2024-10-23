import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_MESSAGES } from "../../graphql/queries/getMessages";
import MessageList from "../MessageList/MessageList";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Dashboard = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { recipientId: state.user.id },
    skip: !state.user,
  });

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error) return <Typography>Error fetching messages: {error.message}</Typography>;

  // Group messages by senderId and include senderName
  const groupedMessages = data.getMessages.reduce((acc, message) => {
    const otherUserId =
      message.senderId === state.user.id
        ? message.recipientId
        : message.senderId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = {
        messages: [],
        senderName: message.senderName || "Unknown User", // Ensure senderName is set
      };
    }
    acc[otherUserId].messages.push(message);
    return acc;
  }, {});

  // console.log("Grouped Messages:", groupedMessages); // Debugging line

  return (
    <Box sx={{ padding: 2 }}>
      <MessageList
        groupedMessages={groupedMessages}
        onMessageClick={(otherUserId) => {
          const senderName = groupedMessages[otherUserId]?.senderName || "Unknown User";
          navigate(`/chat/${otherUserId}`, { state: { senderName } });
        }}
      />
    </Box>
  );
};

export default Dashboard;

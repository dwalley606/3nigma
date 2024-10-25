import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ALL_MESSAGES } from "../../graphql/queries/getAllMessages";
import MessageList from "../MessageList/MessageList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Dashboard = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  // Ensure userId is available
  const userId = state.user?.id;

  const { loading, error, data } = useQuery(GET_ALL_MESSAGES, {
    variables: { userId },
    skip: !userId, // Skip query if userId is not available
  });

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return (
      <Typography>Error fetching messages: {error.message}</Typography>
    );

  // Group messages by senderId or groupId and include senderName or groupName
  const groupedMessages = data.getAllMessages.reduce((acc, message) => {
    const key = message.isGroupMessage ? message.recipientId : message.senderId;
    const name = message.isGroupMessage
      ? message.groupName // Use groupName for group messages
      : message.senderName;

    if (!acc[key]) {
      acc[key] = {
        messages: [],
        name: name || "Unknown",
        mostRecentMessage: message,
      };
    }

    acc[key].messages.push(message);

    // Update the most recent message if the current message is newer
    if (
      new Date(message.timestamp) >
      new Date(acc[key].mostRecentMessage.timestamp)
    ) {
      acc[key].mostRecentMessage = message;
    }

    return acc;
  }, {});

  // Convert groupedMessages to an array and sort by name and timestamp
  const sortedMessages = Object.values(groupedMessages).sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return (
      new Date(b.mostRecentMessage.timestamp) -
      new Date(a.mostRecentMessage.timestamp)
    );
  });

  return (
    <Box sx={{ padding: 2 }}>
      <MessageList
        groupedMessages={sortedMessages}
        onMessageClick={(key, isGroupMessage) => {
          if (isGroupMessage) {
            navigate(`/groupChat/${key}`); // Use the correct groupId
          } else {
            const senderName = groupedMessages[key]?.name || "Unknown User";
            navigate(`/chat/${key}`, { state: { senderName } });
          }
        }}
      />
    </Box>
  );
};

export default Dashboard;

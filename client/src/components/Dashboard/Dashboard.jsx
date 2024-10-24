import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_MESSAGES } from "../../graphql/queries/getMessages";
import MessageList from "../MessageList/MessageList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Dashboard = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { recipientId: state.user.id },
    skip: !state.user,
  });

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error fetching messages: {error.message}</Typography>;

  // Group messages by senderId or groupId and include senderName or groupName
  const groupedMessages = data.getMessages.reduce((acc, message) => {
    const key = message.isGroupMessage ? message.recipientId : message.senderId;
    const name = message.isGroupMessage
      ? message.groupName
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

  return (
    <Box sx={{ padding: 2 }}>
      <MessageList
        groupedMessages={groupedMessages}
        onMessageClick={(key, isGroupMessage) => {
          if (isGroupMessage) {
            navigate(`/groupChat/${key}`);
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

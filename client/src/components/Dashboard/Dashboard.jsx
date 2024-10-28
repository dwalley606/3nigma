import { useAuth } from "../../context/auth/AuthContext";
import { useMessages } from "../../context/message/MessageContext";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ALL_MESSAGES } from "../../graphql/queries/getAllMessages";
import MessageList from "../MessageList/MessageList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect } from "react";

const Dashboard = () => {
  const { state: authState } = useAuth();
  const { state: messageState, dispatch } = useMessages();
  const navigate = useNavigate();

  const userId = authState.user?.id;

  const { loading, error, data, refetch } = useQuery(GET_ALL_MESSAGES, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      console.log("Fetched data:", data.getAllMessages); // Debugging log
      dispatch({ type: "SET_MESSAGES", payload: data.getAllMessages });
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error fetching messages: {error.message}</Typography>;

  const groupedMessages = messageState.messages.reduce((acc, message) => {
    const key = message.isGroupMessage
      ? message.groupRecipientId
      : message.senderId;
    if (!key) return acc;

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

    // Convert timestamps to numbers for comparison
    const currentTimestamp = Number(message.timestamp);
    const mostRecentTimestamp = Number(acc[key].mostRecentMessage.timestamp);

    if (currentTimestamp > mostRecentTimestamp) {
      acc[key].mostRecentMessage = message;
    }

    return acc;
  }, {});

  console.log("Grouped messages:", groupedMessages);

  const sortedMessages = Object.values(groupedMessages).sort((a, b) => {
    return (
      new Date(b.mostRecentMessage.timestamp) -
      new Date(a.mostRecentMessage.timestamp)
    );
  });

  console.log("Sorted messages:", sortedMessages);

  return (
    <Box sx={{ padding: 2 }}>
      <MessageList
        groupedMessages={sortedMessages}
        onMessageClick={(key, isGroupMessage) => {
          const stringKey = key.toString();
          if (isGroupMessage) {
            navigate(`/groupChat/${stringKey}`);
          } else {
            const otherUserId = stringKey;
            const senderName =
              groupedMessages[stringKey]?.name || "Unknown User";
            navigate(`/chat/${otherUserId}`, { state: { senderName } });
          }
        }}
      />
    </Box>
  );
};

export default Dashboard;

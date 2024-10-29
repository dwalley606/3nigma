import { useAuth } from "../../context/auth/AuthContext";
import { useMessages } from "../../context/message/MessageContext";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_CONVERSATIONS } from "../../graphql/queries/getConversations";
import MessageList from "../MessageList/MessageList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect } from "react";

const Dashboard = () => {
  const { state: authState } = useAuth();
  const { dispatch } = useMessages();
  const navigate = useNavigate();

  const userId = authState.user?.id;

  const { loading, error, data, refetch } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      console.log("Fetched conversations:", data.getConversations); // Debugging log
      dispatch({ type: "SET_MESSAGES", payload: data.getConversations });
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  if (loading) return <Typography>Loading conversations...</Typography>;
  if (error)
    return (
      <Typography>Error fetching conversations: {error.message}</Typography>
    );

  const sortedConversations = [...data.getConversations].sort((a, b) => {
    const lastMessageA = a.lastMessage ? new Date(a.lastMessage.timestamp) : 0;
    const lastMessageB = b.lastMessage ? new Date(b.lastMessage.timestamp) : 0;
    return lastMessageB - lastMessageA; // Sort by descending timestamp
  });

  return (
    <Box sx={{ padding: 2 }}>
      <MessageList
        groupedMessages={sortedConversations}
        onMessageClick={(conversationId, isGroup) => {
          if (isGroup) {
            navigate(`/groupChat/${conversationId}`);
          } else {
            const otherUserId = conversationId;
            const senderName =
              sortedConversations.find((conv) => conv.id === conversationId)
                ?.participants[0]?.username || "Unknown User";
            navigate(`/chat/${otherUserId}`, { state: { senderName } });
          }
        }}
      />
    </Box>
  );
};

export default Dashboard;

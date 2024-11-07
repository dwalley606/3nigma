import { useAuth } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries/getConversations";
import MessageList from "../components/MessageList/MessageList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate, Outlet } from "react-router-dom";

const Dashboard = () => {
  const { state: authState } = useAuth();
  const userId = authState.user?.id;
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
  });

  if (loading) return <Typography>Loading conversations...</Typography>;
  if (error)
    return (
      <Typography>Error fetching conversations: {error.message}</Typography>
    );

  const sortedConversations = [...data.getConversations]
    .sort((a, b) => {
      const lastMessageA = a.lastMessage
        ? new Date(a.lastMessage.timestamp)
        : 0;
      const lastMessageB = b.lastMessage
        ? new Date(b.lastMessage.timestamp)
        : 0;
      return lastMessageB - lastMessageA;
    })
    .reverse();

    return (
        <Box sx={{ padding: 2 }}>
          <MessageList
            groupedMessages={sortedConversations}
            onMessageClick={(conversationId) => {
              navigate(`/dashboard/chat/${conversationId}`);
            }}
          />
          <Outlet /> {/* This renders the child route, such as Chat */}
        </Box>
      );
    };

export default Dashboard;
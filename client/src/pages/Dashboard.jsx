import { useAuth } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries/getConversations";
import MessageList from "../components/MessageList/MessageList";
import Chat from "../components/Chat/Chat";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useView } from "../context/StoreProvider";

const Dashboard = () => {
  const { state: authState } = useAuth();
  const userId = authState.user?.id;

  const { state: viewState, dispatch } = useView();
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const { loading, error, data } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (viewState.isChatActive) {
      setSelectedConversationId(selectedConversationId);
    } else {
      setSelectedConversationId(null);
    }
  }, [viewState.isChatActive, selectedConversationId]);

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

  const handleMessageClick = (conversationId) => {
    setSelectedConversationId(conversationId);
    dispatch({ type: "SET_CHAT_ACTIVE", payload: true });
  };

  return (
    <Box sx={{ padding: 2 }}>
      {selectedConversationId ? (
        <Chat conversationId={selectedConversationId} />
      ) : (
        <MessageList
          groupedMessages={sortedConversations}
          onMessageClick={handleMessageClick}
        />
      )}
    </Box>
  );
};

export default Dashboard;

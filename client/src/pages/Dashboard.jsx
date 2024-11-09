import { useAuth } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries/getConversations";
import MessageList from "../components/MessageList/MessageList";
import Chat from "../components/Chat/Chat";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useView } from "../context/StoreProvider";
import { SET_CHAT_ACTIVE, SET_CURRENT_CONVERSATION } from "../context/view/viewActions";

const Dashboard = () => {
  const { state: authState } = useAuth();
  const userId = authState.user?.id;

  const { state: viewState, dispatch } = useView();

  const { loading, error, data } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (!viewState.isChatActive) {
      dispatch({
        type: SET_CURRENT_CONVERSATION,
        payload: { conversationId: null, isGroupMessage: false },
      });
    }
  }, [viewState.isChatActive, dispatch]);

  if (loading) return <Typography>Loading conversations...</Typography>;
  if (error)
    return (
      <Typography>Error fetching conversations: {error.message}</Typography>
    );

  const sortedConversations = [...data.getConversations].sort((a, b) => {
    const lastMessageA = a.lastMessage ? new Date(a.lastMessage.timestamp) : 0;
    const lastMessageB = b.lastMessage ? new Date(b.lastMessage.timestamp) : 0;
    return lastMessageB - lastMessageA; // Sort by most recent message first
  });

  const handleMessageClick = (conversationId, isGroup) => {
    dispatch({ type: SET_CHAT_ACTIVE, payload: true });
    dispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: { conversationId, isGroupMessage: isGroup },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        overflow: "hidden",
        marginTop: "10vh",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        {viewState.currentConversationId ? (
          <Chat conversationId={viewState.currentConversationId} />
        ) : (
          <MessageList
            groupedMessages={sortedConversations}
            onMessageClick={handleMessageClick}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;

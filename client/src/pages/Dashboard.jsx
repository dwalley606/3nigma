import { useAuth } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries/getConversations";
import MessageList from "../components/MessageList/MessageList";
import Chat from "../components/Chat/Chat";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useView } from "../context/StoreProvider";
import { SET_CHAT_ACTIVE, SET_CURRENT_CONVERSATION, SET_SHOULD_REFETCH, SET_RECIPIENT_ID } from "../context/StoreProvider";

const Dashboard = () => {
  const { state: viewState, dispatch: viewDispatch } = useView();
  const { state: authState, dispatch: authDispatch } = useAuth();

  console.log("User object:", authState.user);

  const userId = authState.user.id;

  if (!userId) {
    console.warn("User ID is undefined. Check if the user is logged in and the AuthContext is set up correctly.");
  }

  const { loading, error, data, refetch } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (viewState.shouldRefetch) {
      refetch();
      viewDispatch({ type: SET_SHOULD_REFETCH, payload: false }); // Reset the refetch trigger
    }
  }, [viewState.shouldRefetch, refetch, viewDispatch]);

  useEffect(() => {
    if (!viewState.isChatActive) {
      viewDispatch({
        type: SET_CURRENT_CONVERSATION,
        payload: { conversationId: null, isGroupMessage: false },
      });
    }
  }, [viewState.isChatActive, viewDispatch]);

  if (loading) return <Typography>Loading conversations...</Typography>;
  if (error)
    return (
      <Typography>Error fetching conversations: {error.message}</Typography>
    );

  const sortedConversations = data?.getConversations
    ? [...data.getConversations].sort((a, b) => {
        const lastMessageA = a.lastMessage ? new Date(a.lastMessage.timestamp) : 0;
        const lastMessageB = b.lastMessage ? new Date(b.lastMessage.timestamp) : 0;
        return lastMessageB - lastMessageA; // Sort by most recent message first
      })
    : [];

  const handleMessageClick = (conversationId, isGroup, recipientId) => {
    viewDispatch({ type: SET_CHAT_ACTIVE, payload: true });
    viewDispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: { conversationId, isGroupMessage: isGroup },
    });
    viewDispatch({ type: SET_RECIPIENT_ID, payload: recipientId }); // Set the recipient ID
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
            onMessageClick={(conversationId, isGroup, recipientId) => 
              handleMessageClick(conversationId, isGroup, recipientId)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;

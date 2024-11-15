import { useAuth } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries/getConversations";
import MessageList from "../components/MessageList/MessageList";
import Chat from "../components/Chat/Chat";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { useView } from "../context/StoreProvider";
import {
  SET_CHAT_ACTIVE,
  SET_CURRENT_CONVERSATION,
  SET_SHOULD_REFETCH,
  SET_RECIPIENT_ID,
  SET_GROUP_ID,
} from "../context/view/viewActions";

const Dashboard = () => {
  const { state: viewState, dispatch: viewDispatch } = useView();
  const { state: authState } = useAuth();

  const userId = authState.user.id;

  const { loading, error, data, refetch } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (!viewState.isChatActive) {
      refetch();
      viewDispatch({
        type: SET_CURRENT_CONVERSATION,
        payload: { conversationId: null, isGroupMessage: false },
      });
    }
  }, [viewState.isChatActive, viewDispatch, refetch]);

  const handleMessageClick = (
    conversationId,
    isGroup,
    recipientId,
    groupId
  ) => {
    viewDispatch({ type: SET_CHAT_ACTIVE, payload: true });
    viewDispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: { conversationId, isGroupMessage: isGroup },
    });

    if (isGroup) {
      viewDispatch({ type: SET_GROUP_ID, payload: groupId });
    } else {
      viewDispatch({ type: SET_RECIPIENT_ID, payload: recipientId });
    }
  };

  if (loading) return <Typography>Loading conversations...</Typography>;
  if (error)
    return (
      <Typography>Error fetching conversations: {error.message}</Typography>
    );

  // Pass the raw data to MessageList for sorting
  const conversations = data?.getConversations || [];

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
        {viewState.isChatActive ? ( // Use isChatActive to determine which component to show
          <Chat conversationId={viewState.currentConversationId} />
        ) : (
          <MessageList
            groupedMessages={conversations} // Pass raw conversations
            onMessageClick={(conversationId, isGroup, recipientId, groupId) =>
              handleMessageClick(conversationId, isGroup, recipientId, groupId)
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;

import { useAuth } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries/getConversations";
import { GET_CONVERSATION } from "../graphql/queries/getConversation";
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

  const {
    loading,
    error,
    data,
    refetch: refetchConversations,
  } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
  });

  const { refetch: refetchConversation } = useQuery(GET_CONVERSATION, {
    variables: { conversationId: viewState.currentConversationId },
    skip: !viewState.currentConversationId,
  });

  useEffect(() => {
    if (viewState.shouldRefetch) {
      refetchConversations();
      viewDispatch({ type: SET_SHOULD_REFETCH, payload: false }); // Reset the refetch trigger
    }
  }, [viewState.shouldRefetch, refetchConversations, viewDispatch]);

  useEffect(() => {
    if (!viewState.isChatActive) {
      viewDispatch({
        type: SET_CURRENT_CONVERSATION,
        payload: { conversationId: null, isGroupMessage: false },
      });
    }
  }, [viewState.isChatActive, viewDispatch]);

  useEffect(() => {
    if (viewState.currentConversationId && !viewState.isChatActive) {
      refetchConversations(); // Only refetch when navigating back to MessageList
    }
  }, [
    viewState.currentConversationId,
    viewState.isChatActive,
    refetchConversations,
  ]);

  const handleMessageClick = (
    conversationId,
    isGroup,
    recipientId,
    groupId
  ) => {
    console.log("Current viewState before clicking:", viewState); // Log the current viewState

    viewDispatch({ type: SET_CHAT_ACTIVE, payload: true });
    viewDispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: { conversationId, isGroupMessage: isGroup },
    });

    if (isGroup) {
      viewDispatch({ type: SET_GROUP_ID, payload: groupId }); // Set the group ID
    } else {
      viewDispatch({ type: SET_RECIPIENT_ID, payload: recipientId }); // Set the recipient ID
    }

    refetchConversation();

    console.log("Updated viewState after clicking:", {
      currentConversationId: conversationId,
      isGroupMessage: isGroup,
      recipientId: isGroup ? null : recipientId,
      groupId: isGroup ? groupId : null,
    }); // Log the updated viewState
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
            refetch={refetchConversations}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;

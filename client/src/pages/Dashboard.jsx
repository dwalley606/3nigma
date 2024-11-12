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
} from "../context/view/viewActions";

const Dashboard = () => {
  const { state: viewState, dispatch: viewDispatch } = useView();
  const { state: authState } = useAuth();

  const userId = authState.user.id;

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

  // Pass the raw data to MessageList for sorting
  const conversations = data?.getConversations || [];

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

    // Conditionally set the recipient ID based on whether it's a group or direct message
    const idToSet = isGroup ? groupId : recipientId;
    viewDispatch({ type: SET_RECIPIENT_ID, payload: idToSet });

    console.log("Updated viewState after clicking:", {
      currentConversationId: conversationId,
      isGroupMessage: isGroup,
      recipientId: idToSet,
    }); // Log the updated viewState
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

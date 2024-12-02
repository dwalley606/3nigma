import { useEffect } from "react";
import { useAuth } from "../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../graphql/queries/getConversations";
import MessageList from "../components/MessageList/MessageList";
import Chat from "../components/Chat/Chat";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useView } from "../context/StoreProvider";
import {
  SET_CHAT_ACTIVE,
  SET_CURRENT_CONVERSATION,
  SET_RECIPIENT_ID,
  SET_GROUP_ID,
  SET_CONVERSATIONS,
} from "../context/view/viewActions";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Dashboard = () => {
  const { state: viewState, dispatch: viewDispatch } = useView();
  const { state: authState } = useAuth();
  const theme = useTheme();
  const isTabletOrLarger = useMediaQuery(theme.breakpoints.up('sm'));

  const userId = authState.user.id;

  const { loading, error, data, refetch } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data) {
      const sortedConversations = [...data.getConversations].sort((a, b) => {
        const aTimestamp = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
        const bTimestamp = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
        return bTimestamp - aTimestamp;
      });
      viewDispatch({ type: SET_CONVERSATIONS, payload: sortedConversations });
    }
  }, [data, viewDispatch]);

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

  const handleSendMessage = (newMessage) => {
    const updatedConversations = viewState.conversations.map((conv) => {
      if (conv.id === viewState.currentConversationId) {
        return {
          ...conv,
          lastMessage: newMessage,
        };
      }
      return conv;
    });

    const sortedConversations = updatedConversations.sort((a, b) => {
      const aTimestamp = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const bTimestamp = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return bTimestamp - aTimestamp;
    });

    viewDispatch({ type: SET_CONVERSATIONS, payload: sortedConversations });
  };

  if (loading) return <Typography>Loading conversations...</Typography>;
  if (error)
    return (
      <Typography>Error fetching conversations: {error.message}</Typography>
    );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isTabletOrLarger ? 'row' : 'column',
        height: isTabletOrLarger ? '80vh' : (viewState.isChatActive ? '90vh' : '80vh'),
        overflow: 'hidden',
      }}
    >
      {(!viewState.isChatActive || isTabletOrLarger) && (
        <Box
          sx={{
            flex: isTabletOrLarger ? '1 1 33%' : '1 1 100%',
            overflowY: 'auto',
            padding: 2,
          }}
        >
          <MessageList
            groupedMessages={viewState.conversations}
            onMessageClick={handleMessageClick}
          />
        </Box>
      )}
      {(viewState.isChatActive || isTabletOrLarger) && (
        <Box
          sx={{
            flex: isTabletOrLarger ? '2 1 67%' : '1 1 100%',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: 2,
          }}
        >
          <Chat
            conversationId={viewState.currentConversationId}
            onSendMessage={handleSendMessage}
          />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;

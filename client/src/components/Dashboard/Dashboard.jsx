import { useAuth } from "../../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATIONS } from "../../graphql/queries/getConversations";
import MessageList from "../MessageList/MessageList";
import Chat from "../Chat/Chat";
import GroupChat from "../GroupChat/GroupChat";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { useView } from "../../context/StoreProvider";
import { SET_CHAT_ACTIVE } from "../../context/view/viewActions";
import BottomNav from "../BottomNav/BottomNav";

const Dashboard = () => {
  const { state: authState } = useAuth();
  const userId = authState.user?.id;
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { state: viewState, dispatch } = useView();

  const { loading, error, data, refetch } = useQuery(GET_CONVERSATIONS, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data) {
      // console.log("Fetched conversations:", data.getConversations);
    }
  }, [data]);

  useEffect(() => {
    console.log("Selected Conversation:", selectedConversation);
    dispatch({ type: SET_CHAT_ACTIVE, payload: !!selectedConversation });
    console.log("isChatActive:", viewState.isChatActive);
  }, [selectedConversation, dispatch, viewState.isChatActive]);

  useEffect(() => {
    if (!viewState.isChatActive) {
      setSelectedConversation(null);
      refetch(); // Refetch conversations when returning to the dashboard
    }
  }, [viewState.isChatActive, refetch]);

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
    .reverse(); // Reverse the sorted array

  return (
    <Box sx={{ padding: 2 }}>
      {!selectedConversation ? (
        <MessageList
          groupedMessages={sortedConversations}
          onMessageClick={(conversationId, isGroup) => {
            const conversation = sortedConversations.find(
              (conv) => conv.id === conversationId
            );
            setSelectedConversation({ ...conversation, isGroup });
          }}
        />
      ) : selectedConversation.isGroup ? (
        <GroupChat
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      ) : (
        <Chat
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      )}

      {!viewState.isChatActive && <BottomNav />}
    </Box>
  );
};

export default Dashboard;

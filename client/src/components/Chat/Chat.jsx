// client/src/components/Chat/Chat.jsx
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import Message from "../Message/Message";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth } from "../../context/StoreProvider";
import { useMessages } from "../../context/StoreProvider";
import { SET_MESSAGES } from "../../context/message/messageActions";
import { useView } from "../../context/StoreProvider";
import MessageInput from "../MessageInput/MessageInput";

const Chat = ({ conversationId }) => {
  console.log("Chat component mounted with conversationId:", conversationId);

  const { state: authState } = useAuth();
  const { state: messageState, dispatch } = useMessages();
  const { state: viewState } = useView();
  const userId = authState.user?.id;

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
    skip: !conversationId,
    onCompleted: (data) => {
      if (data?.getConversation) {
        dispatch({
          type: SET_MESSAGES,
          payload: {
            conversationId,
            messages: data.getConversation.messages
          }
        });
      }
    }
  });

  // Use messages from context
  const messages = messageState.conversations?.[conversationId]?.messages || [];

  // If no conversationId, show empty chat
  if (!conversationId) {
    return (
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        height: "80vh",
        overflowY: "auto",
        padding: 2,
      }}>
        <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
          Start a new conversation
        </Typography>
      </Box>
    );
  }

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error) return <Typography>Error fetching messages: {error.message}</Typography>;

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      overflowY: "auto",
    }}>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((message) => {
          const isOwner = message.sender.id === userId;
          return <Message key={message.id} message={message} isOwner={isOwner} />;
        })}
      </Box>
      <MessageInput
        conversationId={conversationId}
        recipientId={viewState.recipientId}
        isGroupMessage={viewState.isGroupMessage}
        groupId={viewState.groupId}
      />
    </Box>
  );
};

export default Chat;

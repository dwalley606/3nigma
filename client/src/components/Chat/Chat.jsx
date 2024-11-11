// client/src/components/Chat/Chat.jsx
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import Message from "../Message/Message";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAuth, useView } from "../../context/StoreProvider";
import { SET_RECIPIENT_ID } from "../../context/view/viewActions";

const Chat = ({ conversationId }) => {
  console.log("Chat component mounted");

  const { state: authState } = useAuth();
  const { state: viewState, dispatch } = useView();
  const userId = authState.user?.id;

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
  });

  console.log("Fetched data:", data);

  useEffect(() => {
    console.log("useEffect triggered");
    if (data && data.getConversation) {
      const conversation = data.getConversation;
      console.log("Is group:", conversation.isGroup);
      console.log("Participants:", conversation.participants);

      const isGroup = conversation.isGroup;
      let recipientId;

      if (isGroup) {
        recipientId = conversation.lastMessage?.groupRecipientId;
      } else {
        recipientId = conversation.participants?.find(
          (participant) => participant.id !== userId
        )?.id;
      }

      console.log("Calculated recipient ID:", recipientId);

      if (viewState.recipientId !== recipientId) {
        console.log("Current view state before setting recipient ID:", viewState);

        dispatch({
          type: SET_RECIPIENT_ID,
          payload: recipientId,
        });

        console.log("Updated recipient ID:", recipientId);
      }
    }
  }, [data, dispatch, conversationId, viewState, userId]);

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error fetching messages: {error.message}</Typography>;

  const conversation = data.getConversation;

  if (!conversation || !conversation.messages || conversation.messages.length === 0) {
    return <Typography>No conversation found.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        height: "80vh",
        overflowY: "auto",
        padding: 2,
      }}
    >
      {conversation.messages.map((message) => {
        const isOwner = message.sender.id === userId;
        return (
          <Message
            key={message.id}
            message={message}
            isOwner={isOwner}
          />
        );
      })}
    </Box>
  );
};

export default Chat;

import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_GROUP_MESSAGES } from "../../graphql/queries/getGroupMessages";
import { Typography, Box } from "@mui/material";
import { useAuth } from "../../context/auth/AuthContext";
import { useMessages } from "../../context/message/MessageContext"; // Import the useMessages hook
import { useEffect } from "react";

import MessageInput from "../MessageInput/MessageInput";
import Message from "../Message/Message";

const GroupChat = () => {
  const { state: authState } = useAuth();
  const { state: messageState, dispatch } = useMessages(); // Use the message context
  const { groupId } = useParams(); // Extract groupId from URL

  console.log("Rendering GroupChat with groupId:", groupId); // Debugging log

  const { loading, error, data } = useQuery(GET_GROUP_MESSAGES, {
    variables: { groupId }, // Ensure the variable name matches the query
    skip: !groupId,
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_MESSAGES", payload: data.getGroupMessages });
    }
  }, [data, dispatch]);

  if (!groupId) {
    return <Typography>Please select a group to view messages.</Typography>;
  }

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error loading messages: {error.message}</Typography>;

  const handleSendMessage = (newMessage) => {
    dispatch({ type: "ADD_MESSAGE", payload: newMessage });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {messageState.messages.length === 0 ? (
          <Typography>No messages in this group yet.</Typography>
        ) : (
          messageState.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwner={message.senderId === authState.user.id}
            />
          ))
        )}
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
          padding: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <MessageInput
          recipientId={groupId}
          isGroupMessage={true}
          onSendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default GroupChat;

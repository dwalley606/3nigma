import { useQuery } from "@apollo/client";
import { GET_GROUP_MESSAGES } from "../../graphql/queries/getGroupMessages";
import { Typography, Box, Button } from "@mui/material";
import { useAuth } from "../../context/auth/AuthContext";

import MessageInput from "../MessageInput/MessageInput";
import Message from "../Message/Message";

const GroupChat = ({ groupId }) => {
  const { state } = useAuth();
  const { loading, error, data } = useQuery(GET_GROUP_MESSAGES, {
    variables: { groupID: groupId },
    skip: !groupId,
  });

  if (!groupId) {
    return <Typography>Please select a group to view messages.</Typography>;
  }

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error loading messages: {error.message}</Typography>;

  const messages = data?.getGroupMessages || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {messages.length === 0 ? (
          <Typography>No messages in this group yet.</Typography>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwner={message.senderId === state.user.id}
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
        <MessageInput recipientId={groupId} isGroupMessage={true} />
      </Box>
    </Box>
  );
};

export default GroupChat;

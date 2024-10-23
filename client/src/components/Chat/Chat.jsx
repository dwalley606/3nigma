// client/src/components/Chat/Chat.jsx
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import { GET_GROUP_MESSAGES } from "../../graphql/queries/getGroupMessages";
import MessageInput from "../MessageInput/MessageInput";
import Message from "../Message/Message";
import Box from "@mui/material/Box";
import List from "@mui/material/List";

const Chat = ({ groupId }) => {
  const { state } = useAuth();
  const { otherUserId } = useParams();

  const { loading, error, data } = useQuery(
    groupId ? GET_GROUP_MESSAGES : GET_CONVERSATION,
    {
      variables: groupId ? { groupId } : { userId: state.user.id, otherUserId },
      skip: !state.user || (!otherUserId && !groupId),
    }
  );

  if (loading) return <p>Loading conversation...</p>;
  if (error) return <p>Error loading conversation: {error.message}</p>;

  const messages = data?.getConversation || data?.getGroupMessages || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <List sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isOwner={message.senderId === state.user.id}
          />
        ))}
      </List>
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
        <MessageInput recipientId={groupId || otherUserId} />
      </Box>
    </Box>
  );
};

export default Chat;

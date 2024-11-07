// client/src/components/Chat/Chat.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import { useMessages } from "../../context/StoreProvider";
import Message from "../Message/Message";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MessageInput from "../MessageInput/MessageInput";

const Chat = () => {
  const { conversationId } = useParams();
  const { dispatch } = useMessages();

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
    onCompleted: (data) => {
      dispatch({ type: "SET_MESSAGES", payload: data.getConversation.messages });
    },
  });

  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error fetching messages: {error.message}</Typography>;

  const conversation = data.getConversation;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        {conversation.messages.length === 0 ? (
          <Typography>No messages in this conversation yet.</Typography>
        ) : (
          conversation.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwner={message.senderId === conversation.userId}
            />
          ))
        )}
      </Box>
      <MessageInput
        recipientId={conversationId}
        isGroupMessage={conversation.isGroup}
        onSendMessage={(newMessage) => {
          dispatch({ type: "ADD_MESSAGE", payload: newMessage });
        }}
      />
    </Box>
  );
};

export default Chat;

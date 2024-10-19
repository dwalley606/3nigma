// client/src/components/Chat/Chat.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import { MARK_MESSAGES_AS_READ } from "../../graphql/mutations/markMessagesAsRead";
import "./Chat.css";

const Chat = () => {
  const { state } = useAuth();
  const { otherUserId } = useParams();

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { userId: state.user.id, otherUserId },
    skip: !state.user || !otherUserId,
  });

  const [markMessagesAsRead] = useMutation(MARK_MESSAGES_AS_READ);

  useEffect(() => {
    if (data && data.getConversation) {
      // Mark messages as read when the conversation is loaded
      markMessagesAsRead({ variables: { conversationId: otherUserId } });
    }
  }, [data, markMessagesAsRead, otherUserId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching conversation: {error.message}</p>;

  return (
    <div className="chat">
      {data.getConversation.map((message) => (
        <div
          key={message.id}
          className={`message ${
            message.senderId === state.user.id ? "sent" : "received"
          }`}
        >
          <div className="message-content">{message.content}</div>
          <div className="message-timestamp">
            {new Date(parseInt(message.timestamp, 10)).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;

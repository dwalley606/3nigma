// client/src/components/Chat/Chat.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import "./Chat.css";

const Chat = () => {
  const { state } = useAuth();
  const { otherUserId } = useParams(); // Extract otherUserId from URL

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { userId: state.user.id, otherUserId },
    skip: !state.user || !otherUserId, // Skip query if user or otherUserId is not available
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching conversation: {error.message}</p>;

  return (
    <div className="chat">
      {data.getConversation.map((message) => {
        // Format the timestamp for each message
        const formattedTimestamp = new Date(
          parseInt(message.timestamp, 10)
        ).toLocaleString();

        return (
          <div
            key={message.id}
            className={`message ${
              message.senderId === state.user.id ? "sent" : "received"
            }`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">{formattedTimestamp}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Chat;

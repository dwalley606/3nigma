// client/src/components/Chat/Chat.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../graphql/queries/getConversation";
import MessageInput from "../MessageInput/MessageInput";
import "./Chat.css";

const Chat = () => {
  const { state } = useAuth();
  const { otherUserId } = useParams();

  const { loading, error, data } = useQuery(GET_CONVERSATION, {
    variables: { userId: state.user.id, otherUserId },
    skip: !state.user || !otherUserId,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching conversation: {error.message}</p>;

  // Determine if this is a group message
  const isGroupMessage = false; // Set this based on your application's logic

  return (
    <div className="chat">
      {data.getConversation.map((message) => {
        const formattedTimestamp = new Date(
          parseInt(message.timestamp, 10)
        ).toLocaleString();

        return (
          <div
            key={message.id}
            className={`chatMessage ${
              message.senderId === state.user.id ? "sent" : "received"
            }`}
          >
            <div className="chatMessage-content">{message.content}</div>
            <div className="chatMessage-timestamp">{formattedTimestamp}</div>
          </div>
        );
      })}
      <div className="messageInputContainer">
        <MessageInput recipientId={otherUserId} isGroupMessage={isGroupMessage} />
      </div>
    </div>
  );
};

export default Chat;

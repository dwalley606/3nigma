// src/components/Message/Message.jsx
import PropTypes from "prop-types";
import "./Message.css";

const Message = ({ message }) => {
  return (
    <div className={`message ${message.read ? "read" : "unread"}`}>
      <div className="message-header">
        <span className="sender">{message.senderName}</span>
        <span className="timestamp">
          {new Date(message.timestamp).toLocaleString()}
        </span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
    senderName: PropTypes.string.isRequired,
    recipientId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    read: PropTypes.bool.isRequired,
    isGroupMessage: PropTypes.bool,
  }).isRequired,
};

export default Message;

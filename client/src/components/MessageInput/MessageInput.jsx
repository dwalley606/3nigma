import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../../graphql/mutations/sendMessage';
import { useAuth } from '../../context/AuthContext';

const MessageInput = ({ recipientId, isGroupMessage }) => {
  const [message, setMessage] = useState('');
  const { state } = useAuth();
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      await sendMessage({
        variables: {
          senderId: state.user.id,
          recipientId,
          content: message,
          isGroupMessage,
        },
      });
      setMessage(''); // Clear the input field after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ flex: 1, padding: '10px', fontSize: '16px' }}
      />
      <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;

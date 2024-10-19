import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { GET_MESSAGES } from "../graphql/queries/getMessages.js";
import Message from "../components/Message/Message";

const Dashboard = () => {
  const { state } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { recipientId: state.user.id },
    skip: !state.user,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching messages: {error.message}</p>;

  // Log the messages to verify data
  console.log("Fetched messages:", data.getMessages);

  // Group messages by senderId and get the most recent message from each sender
  const recentMessages = Object.values(
    data.getMessages.reduce((acc, message) => {
      const otherUserId =
        message.senderId === state.user.id
          ? message.recipientId
          : message.senderId;
      if (
        !acc[otherUserId] ||
        new Date(message.timestamp) > new Date(acc[otherUserId].timestamp)
      ) {
        acc[otherUserId] = message;
      }
      return acc;
    }, {})
  );

  // Sort the recent messages by timestamp
  const sortedRecentMessages = recentMessages.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Handle message click to navigate to the chat component
  const handleMessageClick = (otherUserId) => {
    navigate(`/chat/${otherUserId}`); // Use navigate instead of history.push
  };

  return (
    <div className="dashboard">
      <h2>Recent Conversations</h2>
      <div className="message-list">
        {sortedRecentMessages.map((message) => {
          const otherUserId =
            message.senderId === state.user.id
              ? message.recipientId
              : message.senderId;
          return (
            <div
              className="dash-bubble"
              key={message.id}
              onClick={() => handleMessageClick(otherUserId)}
            >
              <Message message={message} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

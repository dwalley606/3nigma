import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_MESSAGES } from "../graphql/queries/getMessages.js";
import Message from "../components/Message/Message";

const Dashboard = () => {
  const { state } = useAuth();

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { recipientId: state.user.id },
    skip: !state.user,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching messages: {error.message}</p>;

  // Log the messages to verify data
  console.log("Fetched messages:", data.getMessages);

  // Create a new array and sort it by timestamp
  const sortedMessages = [...data.getMessages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="dashboard">
      <h2>Recent Messages</h2>
      <div className="message-list">
        {sortedMessages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

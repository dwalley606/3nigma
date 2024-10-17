import { useEffect, useState } from "react";

const Dashboard = () => {
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    // Simulate fetching recent chats from an API or database
    const fetchRecentChats = async () => {
      // This is just a placeholder for actual data fetching logic
      const chats = [
        { id: 1, name: "Chat with Alice", lastMessage: "Hey, how are you?" },
        { id: 2, name: "Chat with Bob", lastMessage: "See you tomorrow!" },
        {
          id: 3,
          name: "Chat with Charlie",
          lastMessage: "Thanks for the update.",
        },
      ];
      setRecentChats(chats);
    };

    fetchRecentChats();
  }, []);

  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
      <h3>Recent Chats</h3>
      <ul>
        {recentChats.map((chat) => (
          <li key={chat.id}>
            <strong>{chat.name}</strong>: {chat.lastMessage}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

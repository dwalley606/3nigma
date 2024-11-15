<<<<<<< Updated upstream
// import { useAuth } from "../../context/StoreProvider";
// import { useQuery } from "@apollo/client";
// import { GET_CONVERSATIONS } from "../../graphql/queries/getConversations";
// import MessageList from "../MessageList/MessageList";
// import Chat from "../Chat/Chat";
// import GroupChat from "../GroupChat/GroupChat";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import { useState, useEffect } from "react";
// import { useView } from "../../context/StoreProvider";
// import { SET_CHAT_ACTIVE } from "../../context/view/viewActions";
// import BottomNav from "../BottomNav/BottomNav";
// import MessageInput from "../MessageInput/MessageInput";

// const Dashboard = () => {
//   const { state: authState } = useAuth();
//   const userId = authState.user?.id;
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const { state: viewState, dispatch } = useView();
=======
import { useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_ALL_MESSAGES } from "../../graphql/queries/getAllMessages";
import MessageList from "../MessageList/MessageList";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chat from "../Chat/Chat";
import GroupChat from "../GroupChat/GroupChat";

const Dashboard = () => {
  const { state } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
>>>>>>> Stashed changes

//   const { loading, error, data, refetch } = useQuery(GET_CONVERSATIONS, {
//     variables: { userId },
//     skip: !userId,
//   });

//   useEffect(() => {
//     if (data) {
//       // console.log("Fetched conversations:", data.getConversations);
//     }
//   }, [data]);

<<<<<<< Updated upstream
//   useEffect(() => {
//     console.log("Selected Conversation:", selectedConversation);
//     dispatch({ type: SET_CHAT_ACTIVE, payload: !!selectedConversation });
//     console.log("isChatActive:", viewState.isChatActive);
//   }, [selectedConversation, dispatch, viewState.isChatActive]);

//   useEffect(() => {
//     if (!viewState.isChatActive) {
//       setSelectedConversation(null);
//       refetch(); // Refetch conversations when returning to the dashboard
//     }
//   }, [viewState.isChatActive, refetch]);
=======
  if (loading) return <Typography>Loading messages...</Typography>;
  if (error)
    return <Typography>Error fetching messages: {error.message}</Typography>;

  // Group messages by senderId or groupId and include senderName or groupName
  const groupedMessages = data.getAllMessages.reduce((acc, message) => {
    const key = message.isGroupMessage
      ? message.recipientId.toString() // Convert to string
      : message.senderId.toString(); // Convert to string
    const name = message.isGroupMessage
      ? message.groupName // Use groupName for group messages
      : message.senderName;
>>>>>>> Stashed changes

//   if (loading) return <Typography>Loading conversations...</Typography>;
//   if (error)
//     return (
//       <Typography>Error fetching conversations: {error.message}</Typography>
//     );

//   const sortedConversations = [...data.getConversations]
//     .sort((a, b) => {
//       const lastMessageA = a.lastMessage
//         ? new Date(a.lastMessage.timestamp)
//         : 0;
//       const lastMessageB = b.lastMessage
//         ? new Date(b.lastMessage.timestamp)
//         : 0;
//       return lastMessageB - lastMessageA;
//     })
//     .reverse(); // Reverse the sorted array

//   return (
//     <Box sx={{ padding: 2 }}>
//       {!selectedConversation ? (
//         <MessageList
//           groupedMessages={sortedConversations}
//           onMessageClick={(conversationId, isGroup) => {
//             const conversation = sortedConversations.find(
//               (conv) => conv.id === conversationId
//             );
//             setSelectedConversation({ ...conversation, isGroup });
//           }}
//         />
//       ) : selectedConversation.isGroup ? (
//         <GroupChat
//           conversation={selectedConversation}
//           onBack={() => setSelectedConversation(null)}
//         />
//       ) : (
//         <Chat
//           conversation={selectedConversation}
//           onBack={() => setSelectedConversation(null)}
//         />
//       )}

//       {selectedConversation && (
//         <MessageInput
//           recipientId={selectedConversation.id}
//           isGroupMessage={selectedConversation.isGroup}
//           onSendMessage={(newMessage) => {
//             // Handle sending the message
//             console.log("Message sent:", newMessage);
//             // Dispatch the message to the global state
//             dispatch({ type: "ADD_MESSAGE", payload: newMessage });
//           }}
//         />
//       )}

<<<<<<< Updated upstream
//       {!viewState.isChatActive && <BottomNav />}
//     </Box>
//   );
// };

// export default Dashboard;
=======
  console.log("Grouped Messages:", groupedMessages); // Debugging log

  // Convert groupedMessages to an array and sort by name and timestamp
  const sortedMessages = Object.values(groupedMessages).sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return (
      new Date(b.mostRecentMessage.timestamp) -
      new Date(a.mostRecentMessage.timestamp)
    );
  });

  return (
    <Box sx={{ padding: 2 }}>
      <MessageList
        groupedMessages={sortedMessages}
        onMessageClick={(key, isGroupMessage) => {
          const selected = groupedMessages[key];
          if (selected) {
            setSelectedChat({
              id: key,
              isGroupMessage,
              name: selected.name,
            });
          } else {
            console.error(`No message group found for key: ${key}`);
          }
        }}
      />
      {selectedChat &&
        (selectedChat.isGroupMessage ? (
          <GroupChat groupId={selectedChat.id} />
        ) : (
          <Chat otherUserId={selectedChat.id} />
        ))}
    </Box>
  );
};

export default Dashboard;
>>>>>>> Stashed changes

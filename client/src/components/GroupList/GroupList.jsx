// src/components/GroupList/GroupList.jsx
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../context/auth/AuthContext";
import { GET_USER_GROUPS } from "../../graphql/queries/getUserGroups";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddUserToGroup from "../AddUserToGroup/AddUserToGroup";
import Chat from "../Chat/Chat";

const GroupList = () => {
  const { state } = useAuth();
  const { loading, error, data } = useQuery(GET_USER_GROUPS, {
    variables: { userId: state.user.id },
  });

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  if (loading) return <Typography>Loading groups...</Typography>;
  if (error)
    return <Typography>Error loading groups: {error.message}</Typography>;

  const groups = data?.getUserGroups || [];

  const handleGroupClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowAddUser(false); // Hide add user component when opening chat
  };

  const handleAddUserClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowAddUser(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Your Groups</Typography>
      <List>
        {groups.map((group) => (
          <ListItem
            key={group.id}
            sx={{ display: "flex", justifyContent: "space-between" }}
            onClick={() => handleGroupClick(group.id)}
          >
            <ListItemText
              primary={group.name}
              secondary={
                <>
                  <Typography variant="body2">
                    Admins:{" "}
                    {group.admins.map((admin) => admin.username).join(", ")}
                  </Typography>
                  <Typography variant="body2">
                    {group.mostRecentMessage?.content || "No messages yet"}
                  </Typography>
                </>
              }
            />
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the group click
                handleAddUserClick(group.id);
              }}
            >
              <AddIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      {selectedGroupId && !showAddUser && <Chat groupId={selectedGroupId} />}
      {showAddUser && <AddUserToGroup groupId={selectedGroupId} />}
    </Box>
  );
};

export default GroupList;

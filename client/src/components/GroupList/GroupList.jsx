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
import { useNavigate } from "react-router-dom";

const GroupList = () => {
  const { state: authState } = useAuth();
  const { loading, error, data } = useQuery(GET_USER_GROUPS, {
    variables: { userId: authState.user.id },
  });

  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  if (loading) return <Typography>Loading groups...</Typography>;
  if (error)
    return <Typography>Error loading groups: {error.message}</Typography>;

  const groups = data?.getUserGroups || [];
  console.log("Groups data:", groups); // Debugging log

  const handleGroupClick = (groupId) => {
    console.log("Clicked groupId:", groupId); // Log the clicked groupId
    navigate(`/groupChat/${groupId}`); // Navigate to GroupChat with groupId
  };

  const handleAddUserClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowAddUser((prev) => !prev); // Toggle the visibility of AddUserToGroup
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Your Groups</Typography>
      <List>
        {groups.map((group) => (
          <ListItem key={group.id} button>
            <ListItemText
              primary={group.name}
              onClick={() => handleGroupClick(group.id)}
            />
            <Typography variant="caption">ID: {group.id}</Typography>
            <IconButton
              edge="end"
              aria-label="add user"
              onClick={() => handleAddUserClick(group.id)}
            >
              <AddIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      {showAddUser && <AddUserToGroup groupId={selectedGroupId} />}
    </Box>
  );
};

export default GroupList;

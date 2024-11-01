import React, { useState } from "react";
import { Box, Button, Typography, List, ListItem } from "@mui/material";
import LeaveGroup from "../LeaveGroup/LeaveGroup"; // Import LeaveGroup component
import { useAuth } from "../../context/StoreProvider"; // Import useAuth to get userId

const GroupOptions = ({
  group,
  onClose,
  onAddUser,
  onLeaveGroup,
  activeAction,
  onGroupLeft, // Callback to notify when the group is left
}) => {
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false); // State to manage LeaveGroup dialog
  const { state: authState } = useAuth(); // Get userId from auth state

  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true); // Open LeaveGroup dialog
  };

  return (
    <Box
      sx={{
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: 1,
      }}
    >
      <Typography variant="h6">Group Options for {group.name}</Typography>
      <Typography variant="subtitle1">Admins:</Typography>
      <List>
        {group.admins.map((admin) => (
          <ListItem key={admin.id}>
            <Typography>{admin.username}</Typography>
          </ListItem>
        ))}
      </List>
      <Typography variant="subtitle1">Members:</Typography>
      <List>
        {group.members.map((member) => (
          <ListItem key={member.id}>
            <Typography>{member.username}</Typography>
          </ListItem>
        ))}
      </List>

      <Button variant="contained" color="primary" onClick={onAddUser}>
        Add User
      </Button>
      <Button variant="contained" color="error" onClick={handleLeaveGroup}>
        Leave Group
      </Button>
      <Button variant="outlined" onClick={onClose}>
        Close
      </Button>

      {/* Render LeaveGroup dialog */}
      {isLeaveGroupOpen && (
        <LeaveGroup
          groupName={group.name}
          groupId={group.id}
          userId={authState.user.id} // Pass userId to LeaveGroup
          onClose={() => {
            setIsLeaveGroupOpen(false);
            onClose(); // Close GroupOptions after leaving
            onGroupLeft(); // Notify GroupList to refresh
          }}
        />
      )}
    </Box>
  );
};

export default GroupOptions;

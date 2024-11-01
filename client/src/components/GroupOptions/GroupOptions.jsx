import React, { useState } from "react";
import { Box, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useView } from "../../context/StoreProvider"; // Import useView to access global state

const GroupOptions = ({ groupId, admins, members }) => {
  const { dispatch } = useView();
  const [isOptionsVisible, setOptionsVisible] = useState(false);

  const toggleOptionsVisibility = () => {
    setOptionsVisible(!isOptionsVisible);
  };

  const handleAddGroupMember = () => {
    // Logic to add a group member
    console.log(`Add member to group with ID: ${groupId}`);
  };

  const handleLeaveGroup = () => {
    // Logic to leave the group
    console.log(`Leave group with ID: ${groupId}`);
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
      <Typography variant="h6" onClick={toggleOptionsVisibility} sx={{ cursor: "pointer" }}>
        Group Options
      </Typography>
      {isOptionsVisible && (
        <>
          <Typography variant="subtitle1">Admins</Typography>
          <List>
            {admins.map((admin) => (
              <ListItem key={admin.id}>
                <ListItemText primary={admin.name} />
              </ListItem>
            ))}
          </List>
          <Typography variant="subtitle1">Members</Typography>
          <List>
            {members.map((member) => (
              <ListItem key={member.id}>
                <ListItemText primary={member.name} />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}
          >
            <Button variant="contained" color="primary" onClick={handleAddGroupMember}>
              Add Group Member
            </Button>
            <Button variant="contained" color="secondary" onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default GroupOptions;

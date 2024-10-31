import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useView } from "../../context/StoreProvider"; // Import useView to access global state
import { setViewComponent } from "../../context/view/viewActions"; // Import action to change view

const GroupOptions = ({ groupId }) => {
  const { dispatch } = useView();

  const handleEditGroup = () => {
    // Logic to edit the group (e.g., open a modal or navigate to an edit page)
    console.log(`Edit group with ID: ${groupId}`);
  };

  const handleLeaveGroup = () => {
    // Logic to leave the group
    console.log(`Leave group with ID: ${groupId}`);
  };

  const handleDeleteGroup = () => {
    // Logic to delete the group
    console.log(`Delete group with ID: ${groupId}`);
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
      <Typography variant="h6">Group Options</Typography>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}
      >
        <Button variant="contained" color="primary" onClick={handleEditGroup}>
          Edit Group
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLeaveGroup}
        >
          Leave Group
        </Button>
        <Button variant="contained" color="error" onClick={handleDeleteGroup}>
          Delete Group
        </Button>
      </Box>
    </Box>
  );
};

export default GroupOptions;

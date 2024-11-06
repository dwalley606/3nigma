import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LeaveGroup from "../LeaveGroup/LeaveGroup"; // Import LeaveGroup component
import { useAuth } from "../../context/StoreProvider"; // Import useAuth to get userId
import { useMutation } from "@apollo/client";
import { PROMOTE_TO_ADMIN } from "../../graphql/mutations/promoteToAdmin";

const GroupOptions = ({
  group,
  onClose,
  onAddUser,
  onLeaveGroup,
  activeAction,
  onGroupLeft, // Callback to notify when the group is left
}) => {
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false); // State to manage LeaveGroup dialog
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // State to manage error dialog
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const { state: authState } = useAuth(); // Get userId from auth state
  const [promoteToAdmin, { loading }] = useMutation(PROMOTE_TO_ADMIN, {
    onCompleted: (data) => {
      console.log("Promotion successful:", data);
    },
    onError: (error) => {
      console.error("Error promoting to admin:", error);
      setErrorMessage(error.message); // Set error message
      setErrorDialogOpen(true); // Open error dialog
    },
  });

  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true); // Open LeaveGroup dialog
  };

  const handlePromote = (userId) => {
    promoteToAdmin({ variables: { groupId: group.id, userId } });
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false); // Close error dialog
  };

  // Check if the current user is an admin
  const isAdmin = group.admins.some((admin) => admin.id === authState.user.id);

  return (
    <Box
      sx={{
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: 1,
        height: "80vh", // Set a specific height for the Box
        display: "flex",
        flexDirection: "column", // Use flexbox to arrange children vertically
      }}
    >
      <Typography
        variant="h5" // Increase font size
        sx={{ textAlign: "center", marginBottom: 2 }} // Center title
      >
        Group Options for {group.name}
      </Typography>
      <Typography
        variant="h6"
        sx={{ textAlign: "left", fontSize: "1.2rem", marginBottom: 1 }} // Align left and increase font size
      >
        Admins:
      </Typography>
      <List sx={{ overflowY: "auto", flexGrow: 1, marginBottom: 2 }}>
        {" "}
        {/* Allow scrolling for the List */}
        {group.admins.map((admin) => (
          <ListItem key={admin.id} sx={{ justifyContent: "center" }}>
            <Typography sx={{ fontSize: "1.1rem" }}>
              {admin.username}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Typography
        variant="h6"
        sx={{ textAlign: "left", fontSize: "1.2rem", marginBottom: 1 }} // Align left and increase font size
      >
        Members:
      </Typography>
      <List sx={{ overflowY: "auto", flexGrow: 1, marginBottom: 2 }}>
        {" "}
        {/* Allow scrolling for the List */}
        {group.members.map((member) => (
          <ListItem key={member.id} sx={{ justifyContent: "center" }}>
            <Typography sx={{ fontSize: "1.1rem" }}>
              {member.username}
            </Typography>
            {/* Conditionally render the Promote to Admin button */}
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePromote(member.id)}
                disabled={loading}
                sx={{ marginLeft: 2 }} // Add some margin for spacing
              >
                Promote to Admin
              </Button>
            )}
          </ListItem>
        ))}
      </List>

      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        sx={{ marginTop: "auto", marginBottom: 2 }} // Push buttons to the bottom
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onAddUser}
          sx={{ fontSize: "1rem" }}
        >
          Add User
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleLeaveGroup}
          sx={{ fontSize: "1rem" }}
        >
          Leave Group
        </Button>
        <Button variant="outlined" onClick={onClose} sx={{ fontSize: "1rem" }}>
          Close
        </Button>
      </Stack>

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

      {/* Error Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-description">
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupOptions;

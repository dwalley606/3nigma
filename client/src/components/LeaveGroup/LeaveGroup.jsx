import React from "react";
import { useMutation } from "@apollo/client";
import { REMOVE_GROUP_MEMBER } from "../../graphql/mutations/removeGroupMember"; // Import your mutation
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const LeaveGroup = ({ groupName, groupId, userId, onClose }) => {
  const [open, setOpen] = React.useState(true);

  const [removeGroupMember] = useMutation(REMOVE_GROUP_MEMBER, {
    onCompleted: () => {
      // Optionally handle successful removal, e.g., show a success message or redirect
      onClose(); // Close the dialog and return to GroupList
    },
    onError: (error) => {
      console.error("Error leaving group:", error);
      // Optionally handle error, e.g., show an error message
    },
  });

  const handleLeaveGroup = () => {
    removeGroupMember({ variables: { groupId, userId } });
  };

  const handleCancel = () => {
    setOpen(false);
    onClose(); // Close the dialog and return to GroupList
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Leave Group</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to leave the group "{groupName}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLeaveGroup} color="secondary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveGroup;

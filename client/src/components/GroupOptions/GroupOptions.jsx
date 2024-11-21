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
import LeaveGroup from "../LeaveGroup/LeaveGroup";
import { useAuth } from "../../context/StoreProvider";
import { useMutation } from "@apollo/client";
import { PROMOTE_TO_ADMIN } from "../../graphql/mutations/promoteToAdmin";

const GroupOptions = ({
  group,
  onClose,
  onAddUser,
  onGroupLeft,
}) => {
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { state: authState } = useAuth();
  const [promoteToAdmin, { loading }] = useMutation(PROMOTE_TO_ADMIN, {
    onCompleted: (data) => {
      console.log("Promotion successful:", data);
    },
    onError: (error) => {
      console.error("Error promoting to admin:", error);
      setErrorMessage(error.message);
      setErrorDialogOpen(true);
    },
  });

  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  const handlePromote = (userId) => {
    promoteToAdmin({ variables: { groupId: group.id, userId } });
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const isAdmin = group.admins.some((admin) => admin.id === authState.user.id);

  return (
    <Box
      sx={{
        padding: 2,
        marginTop: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h5"
        sx={{ textAlign: "center", marginBottom: 2 }}
      >
        Group Options for {group.name}
      </Typography>
      <Typography
        variant="h6"
        sx={{ textAlign: "left", fontSize: "1.2rem", marginBottom: 1 }}
      >
        Admins:
      </Typography>
      <List sx={{ overflowY: "auto", flexGrow: 1, marginBottom: 2 }}>
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
        sx={{ textAlign: "left", fontSize: "1.2rem", marginBottom: 1 }}
      >
        Members:
      </Typography>
      <List sx={{ overflowY: "auto", flexGrow: 1, marginBottom: 2 }}>
        {group.members.map((member) => (
          <ListItem key={member.id} sx={{ justifyContent: "center" }}>
            <Typography sx={{ fontSize: "1.1rem" }}>
              {member.username}
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePromote(member.id)}
                disabled={loading}
                sx={{ marginLeft: 2 }}
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
        sx={{ marginTop: "auto", marginBottom: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => onAddUser(group.members)}
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

      {isLeaveGroupOpen && (
        <LeaveGroup
          groupName={group.name}
          groupId={group.id}
          userId={authState.user.id}
          onClose={() => {
            setIsLeaveGroupOpen(false);
            onClose();
            onGroupLeft();
          }}
        />
      )}

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

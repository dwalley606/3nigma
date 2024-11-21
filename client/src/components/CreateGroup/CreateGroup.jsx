import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACTS } from "../../graphql/queries/getContacts";
import { CREATE_GROUP } from "../../graphql/mutations/createGroup";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useAuth } from "../../context/StoreProvider";
import { useGroups } from "../../context/StoreProvider";

const CreateGroup = ({ onGroupCreated = () => {} }) => {
  const { state } = useAuth();
  const userId = state.user?.id;

  const { loading, error, data } = useQuery(GET_CONTACTS, {
    variables: { userId },
  });
  const [createGroup] = useMutation(CREATE_GROUP, {
    onCompleted: (createGroupData) => {
      dispatch({ type: "ADD_GROUP", payload: createGroupData.createGroup });
      onGroupCreated();
    },
  });
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const { dispatch } = useGroups();

  if (loading) return <Typography>Loading contacts...</Typography>;
  if (error)
    return <Typography>Error loading contacts: {error.message}</Typography>;

  const handleToggleMember = (memberId) => {
    setSelectedMembers((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(memberId)) {
        newSelected.delete(memberId);
      } else {
        newSelected.add(memberId);
      }
      return newSelected;
    });
  };

  const handleSubmit = async () => {
    try {
      const memberIds = Array.from(selectedMembers);
      await createGroup({
        variables: {
          name: groupName,
          memberIds: memberIds,
        },
      });
      setOpenDialog(true);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    onGroupCreated();
  };

  return (
    <Box sx={{ marginTop: 2, padding: 2, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Create New Group
      </Typography>
      <TextField
        label="Group Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        sx={{ border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <Typography variant="h6" gutterBottom>
        Select Contacts
      </Typography>
      <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {data.getContacts.map((contact) => (
          <ListItem
            key={contact.id}
            button
            onClick={() => handleToggleMember(contact.id)}
            selected={selectedMembers.has(contact.id)}
          >
            <ListItemText
              primary={contact.username}
              secondary={contact.email}
            />
            <Button
              variant="contained"
              color={selectedMembers.has(contact.id) ? "primary" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleMember(contact.id);
              }}
              sx={{ marginLeft: 2 }}
            >
              {selectedMembers.has(contact.id) ? "Remove" : "Add"}
            </Button>
          </ListItem>
        ))}
      </List>
      <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Group
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCloseDialog}>
          Close
        </Button>
      </Stack>

      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Group Created</DialogTitle>
        <DialogContent>
          <Typography>Your group has been created successfully!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateGroup;

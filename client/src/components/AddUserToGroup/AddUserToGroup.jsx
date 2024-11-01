// src/components/AddUserToGroup/AddUserToGroup.jsx
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER_TO_GROUP } from "../../graphql/mutations/addUserToGroup";
import { GET_USERS } from "../../graphql/queries/getUsers";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const AddUserToGroup = ({ groupId, onUserAdded }) => {
  const [addUserToGroup] = useMutation(ADD_USER_TO_GROUP);
  const { loading, error, data } = useQuery(GET_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleUserSelect = (user) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleAddUsers = async () => {
    try {
      await Promise.all(
        selectedUsers.map((user) =>
          addUserToGroup({
            variables: { groupId, userId: user.id },
          })
        )
      );
      console.log("Users added to group");
      onUserAdded();
    } catch (error) {
      console.error("Error adding users to group:", error);
    }
  };

  const handleUnselectUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id)); // Remove user from selected users
  };

  if (loading) return <Typography>Loading users...</Typography>;
  if (error)
    return <Typography>Error loading users: {error.message}</Typography>;

  // Filter out selected users from the available users list
  const filteredUsers = data.getUsers
    .filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) => !selectedUsers.some((u) => u.id === user.id)); // Exclude selected users

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Add User to Group</Typography>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Typography variant="subtitle1">Selected Users:</Typography>
      <List>
        {selectedUsers.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.username} secondary={user.email} />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleUnselectUser(user)}
            >
              Unselect
            </Button>
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1">Available Users:</Typography>
      <List>
        {filteredUsers.map((user) => (
          <ListItem
            key={user.id}
            button
            onClick={() => handleUserSelect(user)}
            selected={selectedUsers.some((u) => u.id === user.id)}
          >
            <ListItemText primary={user.username} secondary={user.email} />
            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the ListItem's onClick
                handleUserSelect(user); // Select the user when the button is clicked
              }}
            >
              Add
            </Button>
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddUsers}
        disabled={selectedUsers.length === 0}
      >
        Add Selected Users
      </Button>
    </Box>
  );
};

export default AddUserToGroup;

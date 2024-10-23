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

const AddUserToGroup = ({ groupId }) => {
  const [addUserToGroup] = useMutation(ADD_USER_TO_GROUP);
  const { loading, error, data } = useQuery(GET_USERS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = async (userId) => {
    try {
      await addUserToGroup({
        variables: { groupId, userId },
      });
      console.log("User added to group");
    } catch (error) {
      console.error("Error adding user to group:", error);
    }
  };

  if (loading) return <Typography>Loading users...</Typography>;
  if (error)
    return <Typography>Error loading users: {error.message}</Typography>;

  const filteredUsers = data.getUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <List>
        {filteredUsers.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleAddUser(user.id)}
              >
                Add
              </Button>
            }
          >
            <ListItemText primary={user.username} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AddUserToGroup;

// src/components/GroupList/GroupList.jsx
import { useState, useEffect } from "react";
import { useGroups } from "../../context/StoreProvider";
import { useAuth } from "../../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_GROUP_DETAILS } from "../../graphql/queries/getGroupDetails";
import { setGroups } from "../../context/groups/groupActions";
import { removeGroup } from "../../context/groups/groupActions";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import GroupOptions from "../GroupOptions/GroupOptions";
import AddUserToGroup from "../AddUserToGroup/AddUserToGroup";

const GroupList = () => {
  const { state: groupState, dispatch } = useGroups();
  const { state: authState } = useAuth();
  const { loading, error, data, refetch } = useQuery(GET_GROUP_DETAILS, {
    variables: { userId: authState.user.id },
    fetchPolicy: "network-only",
  });

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGroupOptionsOpen, setIsGroupOptionsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  useEffect(() => {
    if (data && data.getGroupDetails) {
      dispatch(setGroups(data.getGroupDetails));
    }
  }, [data, dispatch]);

  useEffect(() => {
    refetch(); // Refetch groups when the component mounts
  }, [refetch]);

  if (loading) return <Typography>Loading groups...</Typography>;
  if (error)
    return <Typography>Error loading groups: {error.message}</Typography>;

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setIsGroupOptionsOpen(true);
  };

  const handleCloseGroupOptions = () => {
    setIsGroupOptionsOpen(false);
    setSelectedGroup(null);
    setIsAddUserOpen(false);
  };

  const handleAddUserClick = () => {
    setIsAddUserOpen(true);
    setIsGroupOptionsOpen(false);
  };

  const handleUserAdded = () => {
    setIsAddUserOpen(false);
    setIsGroupOptionsOpen(true);
  };

  const handleGroupLeft = (groupId) => {
    dispatch(removeGroup(groupId));
  };

  return (
    <Box sx={{ 
      padding: 2,
      width: '100%',
      maxWidth: 600,
    }}>
      {!isGroupOptionsOpen && !isAddUserOpen ? (
        <>
          <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
            Your Groups
          </Typography>
          <List>
            {groupState.groups.map((group) => (
              <ListItem
                key={group.id}
                onClick={() => handleGroupClick(group)}
                button
                sx={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <ListItemText
                  primary={group.name}
                  secondary={
                    group.lastMessage ? (
                      <Typography variant="body2" color="textSecondary">
                        {group.lastMessage.content}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        No messages yet
                      </Typography>
                    )
                  }
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGroupClick(group);
                  }}
                  sx={{ marginLeft: 'auto' }}
                >
                  Options
                </Button>
              </ListItem>
            ))}
          </List>
        </>
      ) : isGroupOptionsOpen && selectedGroup ? (
        <GroupOptions
          group={selectedGroup}
          onClose={handleCloseGroupOptions}
          onAddUser={handleAddUserClick}
          onGroupLeft={handleGroupLeft}
        />
      ) : isAddUserOpen && selectedGroup ? (
        <AddUserToGroup
          groupId={selectedGroup.id}
          onUserAdded={handleUserAdded}
          existingMembers={selectedGroup.members}
        />
      ) : null}
    </Box>
  );
};

export default GroupList;

// src/components/GroupList/GroupList.jsx
import React, { useState } from "react";
import { useGroups } from "../../context/StoreProvider";
import { useAuth } from "../../context/StoreProvider";
import { useQuery } from "@apollo/client";
import { GET_GROUP_DETAILS } from "../../graphql/queries/getGroupDetails";
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
  const { state: groupState, actions } = useGroups();
  const { state: authState } = useAuth();
  const { loading, error, data } = useQuery(GET_GROUP_DETAILS, {
    variables: { userId: authState.user.id },
    fetchPolicy: "network-only",
  });

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGroupOptionsOpen, setIsGroupOptionsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  if (loading) return <Typography>Loading groups...</Typography>;
  if (error)
    return <Typography>Error loading groups: {error.message}</Typography>;

  const groups = data?.getGroupDetails || [];

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
    actions.removeGroup(groupId);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {!isGroupOptionsOpen && !isAddUserOpen ? (
        <>
          <Typography variant="h6">Your Groups</Typography>
          <List>
            {groupState.groups.map((group) => (
              <ListItem
                key={group.id}
                onClick={() => handleGroupClick(group)}
                button
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
                />
                <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupClick(group);
                    }}
                  >
                    Options
                  </Button>
                </Stack>
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
        />
      ) : null}
    </Box>
  );
};

export default GroupList;

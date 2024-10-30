// src/components/GroupList/GroupList.jsx
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "../../context/auth/AuthContext";
import { useView } from "../../context/view/ViewContext";
import { GET_GROUP_CONVERSATIONS } from "../../graphql/queries/getGroupConversations";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import GroupChat from "../GroupChat/GroupChat";
import AddUserToGroup from "../AddUserToGroup/AddUserToGroup";
import LeaveGroup from "../LeaveGroup/LeaveGroup";
import {
  setGroupChatActive,
  setCurrentGroup,
} from "../../context/view/viewActions";

const GroupList = () => {
  const { state: authState } = useAuth();
  const { state: viewState, dispatch } = useView();
  const { loading, error, data } = useQuery(GET_GROUP_CONVERSATIONS, {
    variables: { userId: authState.user.id },
    fetchPolicy: "network-only",
  });

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  if (loading) return <Typography>Loading groups...</Typography>;
  if (error)
    return <Typography>Error loading groups: {error.message}</Typography>;

  const groups = data?.getConversations.filter((convo) => convo.isGroup) || [];

  const handleStartChat = (group) => {
    dispatch(setCurrentGroup(group));
    dispatch(setGroupChatActive(true));
  };

  const handleAddUser = (group) => {
    setSelectedGroupId(group.id);
    setIsAddingUser(true);
  };

  const handleLeaveGroup = (group) => {
    dispatch(setCurrentGroup(group));
    // Navigate to LeaveGroup component
  };

  const handleBackToGroups = () => {
    setIsAddingUser(false);
    setSelectedGroupId(null);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {viewState.isChatActive ? (
        <Box>
          <Button onClick={() => dispatch(setGroupChatActive(false))}>
            Back to Groups
          </Button>
          <GroupChat conversation={viewState.currentGroup} />
        </Box>
      ) : (
        <>
          <Typography variant="h6">Your Groups</Typography>
          <List>
            {groups.map((group) => (
              <ListItem key={group.id}>
                <ListItemText
                  primary={group.name}
                  secondary={
                    group.lastMessage ? (
                      <div>
                        <Typography variant="body2" color="textSecondary">
                          {group.lastMessage.content}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(
                            parseInt(group.lastMessage.timestamp)
                          ).toLocaleString()}
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        No messages yet
                      </Typography>
                    )
                  }
                />
                <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                  <Button onClick={() => handleStartChat(group)}>Chat</Button>
                  <Button onClick={() => handleAddUser(group)}>
                    Add Member
                  </Button>
                  <Button onClick={() => handleLeaveGroup(group)}>
                    Leave Group
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
          {isAddingUser && (
            <AddUserToGroup
              groupId={selectedGroupId}
              onBack={handleBackToGroups}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default GroupList;

// src/components/GroupList/GroupList.jsx
import { useQuery } from "@apollo/client";
import { useAuth } from "../../context/StoreProvider";
import { useView } from "../../context/StoreProvider";
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
import GroupOptions from "../GroupOptions/GroupOptions";
import {
  setGroupChatActive,
  setCurrentGroup,
  setViewComponent,
} from "../../context/view/viewActions";

const GroupList = () => {
  const { state: authState } = useAuth();
  const { state: viewState, dispatch } = useView();
  const { loading, error, data } = useQuery(GET_GROUP_CONVERSATIONS, {
    variables: { userId: authState.user.id },
    fetchPolicy: "network-only",
  });

  if (loading) return <Typography>Loading groups...</Typography>;
  if (error)
    return <Typography>Error loading groups: {error.message}</Typography>;

  const groups = data?.getConversations.filter((convo) => convo.isGroup) || [];

  const handleGroupClick = (group) => {
    dispatch(setCurrentGroup(group));
    dispatch(setViewComponent("GroupOptions"));
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
              <ListItem key={group.id} onClick={() => handleGroupClick(group)}>
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
                  <Button onClick={() => handleGroupClick(group)}>
                    Options
                  </Button>
                </Stack>
              </ListItem>
            ))}
          </List>
          {viewState.currentViewComponent === "GroupOptions" && (
            <GroupOptions groupId={viewState.currentGroup.id} />
          )}
        </>
      )}
    </Box>
  );
};

export default GroupList;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GroupList from "../components/GroupList/GroupList";
import CreateGroup from "../components/CreateGroup/CreateGroup";
import AddUserToGroup from "../components/AddUserToGroup/AddUserToGroup";
import GroupOptions from "../components/GroupOptions/GroupOptions";
import Box from "@mui/material/Box";

const Groups = () => {
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState("list");
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (location.state?.showCreateGroup) {
      setActiveComponent("create");
    }
  }, [location.state]);

  const handleCreateGroup = () => {
    setActiveComponent("create");
  };

  const handleAddUser = (group) => {
    setSelectedGroup(group);
    setActiveComponent("addUser");
  };

  const handleGroupOptions = (group) => {
    setSelectedGroup(group);
    setActiveComponent("options");
  };

  const handleBackToList = () => {
    setActiveComponent("list");
    setSelectedGroup(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Full viewport height
      }}
    >
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '80vh', // Adjust to fit within the remaining space
          overflowY: 'auto',
          width: '100%',
          maxWidth: '600px',
          boxShadow: 3, // Optional: add some shadow for better visibility
          backgroundColor: 'background.paper', // Optional: set a background color
        }}
      >
        {activeComponent === "list" && (
          <GroupList
            onCreateGroup={handleCreateGroup}
            onGroupOptions={handleGroupOptions}
          />
        )}
        {activeComponent === "create" && (
          <CreateGroup onGroupCreated={handleBackToList} />
        )}
        {activeComponent === "addUser" && selectedGroup && (
          <AddUserToGroup
            groupId={selectedGroup.id}
            onUserAdded={handleBackToList}
          />
        )}
        {activeComponent === "options" && selectedGroup && (
          <GroupOptions
            group={selectedGroup}
            onClose={handleBackToList}
            onAddUser={() => handleAddUser(selectedGroup)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Groups;

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import GroupList from "../components/GroupList/GroupList";
import Box from "@mui/material/Box";

const Groups = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: "10vh",
        padding: 2,
        height: "80vh",
        overflowY: "auto",
      }}
    >
      {location.pathname === "/groups/create-group" ? null : <GroupList />}
      <Outlet />
    </Box>
  );
};

export default Groups;

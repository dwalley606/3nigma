import React from "react";
import { Outlet, useLocation } from "react-router-dom"; // Import Outlet
import GroupList from "../components/GroupList/GroupList"; // Import the GroupList component

const Groups = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname === "/groups/create-group" ? null : <GroupList />}{" "}
      {/* Render GroupList only if not on create group page */}
      <Outlet />{" "}
      {/* This will render the CreateGroup component when the path matches */}
    </div>
  );
};

export default Groups;

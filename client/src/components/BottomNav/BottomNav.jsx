import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import ContactsIcon from "@mui/icons-material/Contacts";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useView } from "../../context/StoreProvider"; // Import your context hook

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { state: viewState } = useView(); // Access the view state
  const isTabletOrLarger = useMediaQuery(theme.breakpoints.up('sm')); // Determine if screen is tablet or larger

  const [value, setValue] = React.useState(location.pathname);

  const handleNavigationChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  // Determine the actions based on the current location
  const actions = (() => {
    switch (location.pathname) {
      case "/dashboard":
        return [
          <BottomNavigationAction
            key="groups"
            label="Groups"
            value="/groups"
            icon={<GroupsIcon sx={{ fontSize: 30 }} />}
            sx={{ "& .MuiBottomNavigationAction-label": { fontSize: 14 } }}
          />,
          <BottomNavigationAction
            key="contacts"
            label="Contacts"
            value="/contacts"
            icon={<ContactsIcon sx={{ fontSize: 30 }} />}
            sx={{ "& .MuiBottomNavigationAction-label": { fontSize: 14 } }}
          />,
        ];
      case "/contacts":
        return [
          <BottomNavigationAction
            key="dashboard"
            label="Dashboard"
            value="/dashboard"
            icon={<DashboardIcon sx={{ fontSize: 30 }} />}
            sx={{ "& .MuiBottomNavigationAction-label": { fontSize: 14 } }}
          />,
          <BottomNavigationAction
            key="groups"
            label="Groups"
            value="/groups"
            icon={<GroupsIcon sx={{ fontSize: 30 }} />}
            sx={{ "& .MuiBottomNavigationAction-label": { fontSize: 14 } }}
          />,
        ];
      case "/groups":
        return [
          <BottomNavigationAction
            key="dashboard"
            label="Dashboard"
            value="/dashboard"
            icon={<DashboardIcon sx={{ fontSize: 30 }} />}
            sx={{ "& .MuiBottomNavigationAction-label": { fontSize: 14 } }}
          />,
          <BottomNavigationAction
            key="create-group"
            label="Create Group"
            value="/groups/create-group"
            icon={<AddIcon sx={{ fontSize: 30 }} />}
            sx={{ "& .MuiBottomNavigationAction-label": { fontSize: 14 } }}
          />,
          <BottomNavigationAction
            key="contacts"
            label="Contacts"
            value="/contacts"
            icon={<ContactsIcon sx={{ fontSize: 30 }} />}
            sx={{ "& .MuiBottomNavigationAction-label": { fontSize: 14 } }}
          />,
        ];
      default:
        return [];
    }
  })();

  // Conditionally render BottomNav based on isChatActive and screen size
  if (!isTabletOrLarger && viewState.isChatActive) {
    return null; // Dismount BottomNav when chat is active on smaller screens
  }

  return (
    <BottomNavigation
      value={value}
      onChange={handleNavigationChange}
      showLabels
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "10vh",
        backgroundColor: theme.palette.primary.main,
        zIndex: 1000,
        alignItems: "center",
      }}
    >
      {actions}
    </BottomNavigation>
  );
};

export default BottomNav;

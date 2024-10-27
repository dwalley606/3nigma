// src/components/NavBar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import "./NavBar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/"); // Redirect to Home page
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  // Determine the title based on the current location
  const getTitle = () => {
    if (location.pathname.startsWith("/chat")) {
      const senderName = location.state?.senderName || "Unknown User";
      return `${senderName}`;
    }
    if (location.pathname.startsWith("/groupChat")) {
      return "Group Chat";
    }
    if (location.pathname === "/groups") return "Groups";
    if (location.pathname === "/settings") return "Settings";
    if (location.pathname === "/contacts") return "Contacts";
    return "3NIGMA"; // Default title
  };

  // Determine if the back arrow should be displayed
  const shouldShowBackArrow = () => {
    return (
      location.pathname.startsWith("/chat") ||
      location.pathname.startsWith("/groupChat") || // Include groupChat path
      location.pathname === "/groups" ||
      location.pathname === "/settings" ||
      location.pathname === "/contacts"
    );
  };

  return (
    <nav className="navbar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {shouldShowBackArrow() && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="back"
                onClick={handleBackToDashboard}
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {getTitle()}
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {state.user ? (
                  [
                    <MenuItem
                      key="settings"
                      onClick={() => handleNavigation("/settings")}
                    >
                      Settings
                    </MenuItem>,
                    <MenuItem
                      key="groups"
                      onClick={() => handleNavigation("/groups")}
                    >
                      Groups
                    </MenuItem>,
                    <MenuItem
                      key="contacts"
                      onClick={() => handleNavigation("/contacts")}
                    >
                      Contacts
                    </MenuItem>,
                    <MenuItem key="logout" onClick={handleLogout}>
                      Logout
                    </MenuItem>,
                  ]
                ) : (
                  <MenuItem onClick={() => handleNavigation("/login")}>
                    Login
                  </MenuItem>
                )}
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </nav>
  );
};

export default Navbar;

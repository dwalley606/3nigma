// src/components/NavBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/StoreProvider";
import { useView } from "../../context/StoreProvider";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { SET_CHAT_ACTIVE, SET_SHOULD_REFETCH } from "../../context/view/viewActions";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const { state, dispatch: authDispatch } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { state: viewState, dispatch: viewDispatch } = useView();
  const theme = useTheme();
  const isTabletOrLarger = useMediaQuery(theme.breakpoints.up('sm'));

  console.log("isChatActive in NavBar:", viewState.isChatActive);

  const handleLogout = () => {
    authDispatch({ type: "LOGOUT" });
  };

  const handleBackToDashboard = () => {
    viewDispatch({ type: SET_CHAT_ACTIVE, payload: false });
    viewDispatch({ type: SET_SHOULD_REFETCH, payload: true });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    setAnchorEl(null);
    navigate(path);
  };

  return (
    <nav
      className="navbar"
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            height: "10vh",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <Toolbar sx={{ height: "100%" }}>
            {viewState.isChatActive && !isTabletOrLarger && (
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
              3NIGMA
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
                  <>
                    <MenuItem onClick={() => handleNavigation("/login")}>
                      Login
                    </MenuItem>
                    <MenuItem
                      key="signup"
                      onClick={() => handleNavigation("/signup")}
                    >
                      Sign Up
                    </MenuItem>
                  </>
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

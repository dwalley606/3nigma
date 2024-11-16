import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import BottomNav from "./components/BottomNav/BottomNav";
import { useAuth, useView } from "./context/StoreProvider";
import { loggedIn, refreshToken } from "./utils/auth";
import cyberpunkTheme from "./theme/cyberpunkTheme";
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import { useTheme } from '@mui/material/styles';

function App() {
  const { state: authState, dispatch } = useAuth();
  const { state: viewState } = useView();
  const location = useLocation();
  const theme = useTheme();
  const isTabletOrLarger = useMediaQuery(theme.breakpoints.up('sm')); // Determine if screen is tablet or larger

  React.useEffect(() => {
    const checkToken = async () => {
      const token = authState.authToken;
      if (!loggedIn(token)) {
        try {
          await refreshToken(dispatch);
        } catch (error) {
          console.error("Token refresh failed:", error);
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    checkToken();
  }, [authState.authToken, dispatch]);

  // Define the routes where BottomNav should be displayed
  const showBottomNav = isTabletOrLarger || (["/dashboard", "/groups", "/contacts"].includes(location.pathname) && !viewState.isChatActive);

  return (
    <ThemeProvider theme={cyberpunkTheme}>
      <CssBaseline />
      <NavBar />
      <Outlet
        style={{
          marginTop: "10vh",
          height: "80vh",
          overflow: "auto", // Optional: Add overflow if needed
        }}
      />
      {showBottomNav && <BottomNav />}
    </ThemeProvider>
  );
}

export default App;

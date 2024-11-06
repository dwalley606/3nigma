import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import BottomNav from "./components/BottomNav/BottomNav"; // Import BottomNav
import { useAuth } from "./context/StoreProvider";
import { loggedIn, refreshToken } from "./utils/auth";
import cyberpunkTheme from "./theme/cyberpunkTheme"; // Import your theme

function App() {
  const { state, dispatch } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    const checkToken = async () => {
      const token = state.authToken;
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
  }, [state.authToken, dispatch]);

  // Define the routes where BottomNav should be displayed
  const showBottomNav = ["/dashboard", "/groups", "/contacts"].includes(
    location.pathname
  );

  return (
    <ThemeProvider theme={cyberpunkTheme}>
      <CssBaseline />
      <NavBar />
      <div
        style={{
          marginTop: "10vh",
          paddingBottom: showBottomNav ? "10vh" : "0",
        }}
      >
        <Outlet />
      </div>
      {showBottomNav && <BottomNav />} {/* Conditionally render BottomNav */}
    </ThemeProvider>
  );
}

export default App;

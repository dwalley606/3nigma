import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import BottomNav from "./components/BottomNav/BottomNav";
import MessageInput from "./components/MessageInput/MessageInput";
import { useAuth, useView } from "./context/StoreProvider";
import { loggedIn, refreshToken } from "./utils/auth";
import cyberpunkTheme from "./theme/cyberpunkTheme";

function App() {
  const { state: authState, dispatch } = useAuth();
  const { state: viewState } = useView();
  const location = useLocation();

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
  const showBottomNav = ["/dashboard", "/groups", "/contacts"].includes(
    location.pathname
  );

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
      {viewState.isChatActive ? (
        <MessageInput
          recipientId={viewState.recipientId}
          isGroupMessage={viewState.isGroupMessage}
          onSendMessage={(newMessage) => {
            console.log("Message sent:", newMessage);
            dispatch({ type: "ADD_MESSAGE", payload: newMessage });
          }}
        />
      ) : (
        showBottomNav && <BottomNav />
      )}
    </ThemeProvider>
  );
}

export default App;

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from "./components/NavBar/NavBar";
import { useAuth } from "./context/auth/AuthContext.jsx";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { loggedIn, refreshToken } from './utils/auth';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

function App() {
  const { state, dispatch } = useAuth();

  useEffect(() => {
    const checkToken = async () => {
      const token = state.authToken;
      if (!loggedIn(token)) {
        try {
          await refreshToken(dispatch);
        } catch (error) {
          console.error("Token refresh failed:", error);
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    checkToken();
  }, [state.authToken, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Outlet /> {/* Render child routes */}
    </ThemeProvider>
  );
}

export default App;

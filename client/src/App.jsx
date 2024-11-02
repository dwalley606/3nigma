import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import { useAuth } from './context/StoreProvider';
import { loggedIn, refreshToken } from './utils/auth';
import cyberpunkTheme from './theme/cyberpunkTheme'; // Import your theme

function App() {
  const { state, dispatch } = useAuth();

  React.useEffect(() => {
    const checkToken = async () => {
      const token = state.authToken;
      if (!loggedIn(token)) {
        try {
          await refreshToken(dispatch);
        } catch (error) {
          console.error('Token refresh failed:', error);
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    checkToken();
  }, [state.authToken, dispatch]);

  return (
    <ThemeProvider theme={cyberpunkTheme}>
      <CssBaseline />
      <NavBar />
      <div style={{ marginTop: '10vh' }}>
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;

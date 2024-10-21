import React from 'react';
import { Outlet } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import NavBar from "./components/NavBar/NavBar";
import { setContext } from "@apollo/client/link/context";
import { AuthProvider } from "./context/auth/AuthContext.jsx";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color
    },
    secondary: {
      main: '#dc004e', // Example secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  // Add more customizations as needed
});

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div>
            <main>
              <NavBar />
              <Outlet />
            </main>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

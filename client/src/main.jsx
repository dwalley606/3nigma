import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./App.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import Groups from "./pages/Groups";
import Contacts from "./pages/Contacts";
import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./components/Chat/Chat";
import AddUserToGroup from "./components/AddUserToGroup/AddUserToGroup";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import CreateGroup from "./components/CreateGroup/CreateGroup";
import { StoreProvider } from "./context/StoreProvider";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

// Apollo Client setup
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URI,
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    error: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "chat/:conversationId",
            element: <Chat />,
          },
        ],
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "groups",
        element: (
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "add-user",
            element: (
              <ProtectedRoute>
                <AddUserToGroup />
              </ProtectedRoute>
            ),
          },
          {
            path: "create-group",
            element: (
              <ProtectedRoute>
                <CreateGroup />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "contacts",
        element: (
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </ApolloProvider>
);

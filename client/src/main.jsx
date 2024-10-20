import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import App from "./App.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Groups from "./pages/Groups";
import Contacts from "./pages/Contacts";
import Error from "./pages/Error";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Chat from "./components/Chat/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    error: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "groups",
        element: <Groups />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "chat/:otherUserId",
        element: <Chat />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

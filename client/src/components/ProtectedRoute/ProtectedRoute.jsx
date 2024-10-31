// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/StoreProvider";

const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();

  console.log("ProtectedRoute: state.user", state.user); // Log the user state

  if (!state.user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

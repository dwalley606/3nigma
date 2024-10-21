import { createContext, useReducer, useContext, useEffect } from "react";
import authReducer from "./authReducer"; // Import the reducer from authReducer.js
import { LOGIN, LOGOUT, UPDATE_USER, REFRESH_TOKEN, SET_ERROR, CLEAR_ERROR } from "./authActions"; // Import action types

const initialState = {
  authToken: localStorage.getItem("authToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null, // Include error in the initial state
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem("authToken", state.authToken);
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.authToken, state.user]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

import { createContext, useReducer, useEffect } from "react";
import authReducer from "./authReducer";
import { LOGIN, LOGOUT, UPDATE_USER, REFRESH_TOKEN, SET_ERROR, CLEAR_ERROR } from "./authActions";

const initialState = {
  authToken: localStorage.getItem("authToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
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

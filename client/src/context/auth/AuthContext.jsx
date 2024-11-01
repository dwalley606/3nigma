import { createContext, useReducer, useEffect } from "react";
import authReducer from "./authReducer";

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

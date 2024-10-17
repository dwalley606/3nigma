import { createContext, useReducer, useContext, useEffect } from "react";

const initialState = {
  authToken: localStorage.getItem("authToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authToken: action.payload.token,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        authToken: null,
        user: null,
      };
    default:
      return state;
  }
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

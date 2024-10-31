import React, { createContext, useReducer, useContext, useEffect } from "react";
import authReducer from "./auth/authReducer";
import messageReducer from "./message/messageReducer";
import viewReducer from "./view/viewReducer";
import {
  LOGIN,
  LOGOUT,
  UPDATE_USER,
  REFRESH_TOKEN,
  SET_ERROR as SET_AUTH_ERROR,
  CLEAR_ERROR as CLEAR_AUTH_ERROR,
} from "./auth/authActions";
import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  SET_MESSAGES,
  SET_ERROR as SET_MESSAGE_ERROR,
  CLEAR_ERROR as CLEAR_MESSAGE_ERROR,
} from "./message/messageActions";

// Initial states
const initialAuthState = {
  authToken: localStorage.getItem("authToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
};

const initialMessageState = {
  messages: [],
  error: null,
};

const initialViewState = {
  isChatActive: false,
  currentGroup: null,
  currentViewComponent: null,
  setGroupChatActive: null,
};

// Combine initial states
const initialState = {
  auth: initialAuthState,
  message: initialMessageState,
  view: initialViewState,
};

// Combine reducers
const rootReducer = ({ auth, message, view }, action) => ({
  auth: authReducer(auth, action),
  message: messageReducer(message, action),
  view: viewReducer(view, action),
});

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    localStorage.setItem("authToken", state.auth.authToken);
    localStorage.setItem("user", JSON.stringify(state.auth.user));
  }, [state.auth.authToken, state.auth.user]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hooks to use the StoreContext
export const useStore = () => {
  return useContext(StoreContext);
};

export const useAuth = () => {
  const { state, dispatch } = useStore();
  return { state: state.auth, dispatch };
};

export const useMessages = () => {
  const { state, dispatch } = useStore();
  return { state: state.message, dispatch };
};

export const useView = () => {
  const { state, dispatch } = useStore();
  return { state: state.view, dispatch };
};

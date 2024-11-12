import React, { createContext, useReducer, useContext, useEffect } from "react";
import authReducer from "./auth/authReducer";
import messageReducer from "./message/messageReducer";
import viewReducer from "./view/viewReducer";
import groupReducer from "./groups/groupReducer";
import contactsReducer from "./contacts/contactsReducer";

// Initial states
const initialAuthState = {
  authToken: localStorage.getItem("authToken") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
};

const initialMessageState = {
  messages: [],
  error: null,
  conversations: {},
};

const initialViewState = {
  isChatActive: false,
  currentConversationId: null,
  isGroupMessage: false,
  isGroupOptionsOpen: false,
  isAddingUser: false,
  isLeavingGroup: false,
  recipientId: null,
  shouldRefetch: false,
};

const initialGroupState = {
  groups: [],
};

const initialContactsState = {
  contacts: [],
  contactRequests: [],
};

// Combine initial states
const initialState = {
  auth: initialAuthState,
  message: initialMessageState,
  view: initialViewState,
  group: initialGroupState,
  contacts: initialContactsState,
};

// Combine reducers
const rootReducer = ({ auth, message, view, group, contacts }, action) => ({
  auth: authReducer(auth, action),
  message: messageReducer(message, action),
  view: viewReducer(view, action),
  group: groupReducer(group, action),
  contacts: contactsReducer(contacts, action),
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

export const useGroups = () => {
  const { state, dispatch } = useStore();
  return { state: state.group, dispatch };
};

export const useContacts = () => {
  const { state, dispatch } = useStore();
  return { state: state.contacts, dispatch };
};

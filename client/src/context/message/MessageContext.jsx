// src/context/message/MessageContext.jsx
import { createContext, useReducer, useContext } from "react";
import messageReducer from "./messageReducer"; // Import the reducer
import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  SET_MESSAGES,
  SET_ERROR,
  CLEAR_ERROR,
} from "./messageActions"; // Import action types

const initialState = {
  messages: [],
  error: null,
};

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook to use the MessageContext
export const useMessages = () => {
  return useContext(MessageContext);
};

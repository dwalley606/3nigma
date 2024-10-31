// src/context/message/MessageContext.jsx
import { createContext, useReducer } from "react";
import messageReducer from "./messageReducer";
import { ADD_MESSAGE, REMOVE_MESSAGE, SET_MESSAGES, SET_ERROR, CLEAR_ERROR } from "./messageActions";

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

// src/context/message/messageActions.js
export const ADD_MESSAGE = "ADD_MESSAGE";
export const REMOVE_MESSAGE = "REMOVE_MESSAGE";
export const SET_MESSAGES = "SET_MESSAGES";
export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const removeMessage = (messageId) => ({
  type: REMOVE_MESSAGE,
  payload: messageId,
});

export const setMessages = (messages) => ({
  type: SET_MESSAGES,
  payload: messages,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

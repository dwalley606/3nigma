// src/context/message/messageReducer.js
import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  SET_MESSAGES,
  SET_ERROR,
  CLEAR_ERROR,
} from "./messageActions";

const initialState = {
  messages: [],
  error: null,
  conversations: {},
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.conversationId]: {
            ...state.conversations[action.payload.conversationId],
            messages: action.payload.messages,
          },
        },
      };
    case ADD_MESSAGE: {
      const { conversationId, message } = action.payload;
      const existingMessages = state.conversations[conversationId]?.messages || [];
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...state.conversations[conversationId] || {},
            messages: [...existingMessages, message],
          },
        },
      };
    }
    case REMOVE_MESSAGE:
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.conversationId]: {
            ...state.conversations[action.payload.conversationId],
            messages: state.conversations[action.payload.conversationId].messages.filter((msg) => msg.id !== action.payload.messageId),
          },
        },
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default messageReducer;

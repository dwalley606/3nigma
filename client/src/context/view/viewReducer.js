import {
  SET_CHAT_ACTIVE,
  SET_GROUP_CHAT_ACTIVE,
  SET_CURRENT_GROUP,
} from "./viewActions";

const initialState = {
  isChatActive: false,
  currentGroup: null,
};

// Reducer function
const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT_ACTIVE:
      return { ...state, isChatActive: action.payload };
    case SET_GROUP_CHAT_ACTIVE:
      return { ...state, isChatActive: action.payload };
    case SET_CURRENT_GROUP:
      return { ...state, currentGroup: action.payload };
    default:
      return state;
  }
};

export default viewReducer;

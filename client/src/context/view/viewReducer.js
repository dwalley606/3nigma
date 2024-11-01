import {
  SET_CHAT_ACTIVE,
  SET_GROUP_CHAT_ACTIVE,
  SET_CURRENT_GROUP,
  SET_GROUP_OPTIONS_OPEN,
  SET_GROUP_OPTIONS_CLOSED,
  SET_ADD_USER,
  SET_LEAVE_GROUP,
} from "./viewActions";

const initialState = {
  isChatActive: false,
  currentGroup: null,
  isGroupOptionsOpen: false,
  isAddingUser: false,
  isLeavingGroup: false,
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
    case SET_GROUP_OPTIONS_OPEN:
      return {
        ...state,
        isGroupOptionsOpen: true,
        currentGroup: action.payload,
      };
    case SET_GROUP_OPTIONS_CLOSED:
      return { ...state, isGroupOptionsOpen: false, currentGroup: null };
    case SET_ADD_USER:
      return { ...state, isAddingUser: true };
    case SET_LEAVE_GROUP:
      return { ...state, isLeavingGroup: true };
    default:
      return state;
  }
};

export default viewReducer;

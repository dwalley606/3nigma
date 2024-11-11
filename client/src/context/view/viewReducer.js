import {
  SET_CHAT_ACTIVE,
  SET_GROUP_CHAT_ACTIVE,
  SET_CURRENT_CONVERSATION,
  SET_GROUP_OPTIONS_OPEN,
  SET_GROUP_OPTIONS_CLOSED,
  SET_ADD_USER,
  SET_LEAVE_GROUP,
  SET_RECIPIENT_ID,
} from "./viewActions";

const initialState = {
  isChatActive: false,
  currentConversationId: null,
  isGroupMessage: false,
  isGroupOptionsOpen: false,
  isAddingUser: false,
  isLeavingGroup: false,
  recipientId: null,
};

// Reducer function
const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT_ACTIVE:
      return { ...state, isChatActive: action.payload };
    case SET_GROUP_CHAT_ACTIVE:
      return { ...state, isChatActive: action.payload };
    case SET_CURRENT_CONVERSATION:
      return {
        ...state,
        currentConversationId: action.payload.conversationId,
        isGroupMessage: action.payload.isGroupMessage,
      };
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
    case SET_RECIPIENT_ID:
      return { ...state, recipientId: action.payload };
    default:
      return state;
  }
};

export default viewReducer;

// Define action types
export const SET_CHAT_ACTIVE = "SET_CHAT_ACTIVE";

// Reducer function
const viewReducer = (state, action) => {
  switch (action.type) {
    case SET_CHAT_ACTIVE:
      return { ...state, isChatActive: action.payload };
    default:
      return state;
  }
};

export default viewReducer;

// Define action types
export const SET_CHAT_ACTIVE = "SET_CHAT_ACTIVE";

// Action creators
export const setChatActive = (isActive) => ({
  type: SET_CHAT_ACTIVE,
  payload: isActive,
});
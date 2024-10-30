// Define action types
export const SET_CHAT_ACTIVE = "SET_CHAT_ACTIVE";
export const SET_GROUP_CHAT_ACTIVE = "SET_GROUP_CHAT_ACTIVE";
export const SET_CURRENT_GROUP = "SET_CURRENT_GROUP";
// Action creators
export const setChatActive = (isActive) => ({
  type: SET_CHAT_ACTIVE,
  payload: isActive,
});

export const setGroupChatActive = (isActive) => ({
  type: SET_GROUP_CHAT_ACTIVE,
  payload: isActive,
});

export const setCurrentGroup = (group) => ({
  type: SET_CURRENT_GROUP,
  payload: group,
});

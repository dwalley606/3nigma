// Define action types
export const SET_CHAT_ACTIVE = "SET_CHAT_ACTIVE";
export const SET_GROUP_CHAT_ACTIVE = "SET_GROUP_CHAT_ACTIVE";
export const SET_CURRENT_GROUP = "SET_CURRENT_GROUP";
export const SET_VIEW_COMPONENT = "SET_VIEW_COMPONENT";
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

// New action creator for setting the current view component
export const setViewComponent = (component) => ({
  type: SET_VIEW_COMPONENT,
  payload: component,
});

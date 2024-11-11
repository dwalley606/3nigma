// Define action types
export const SET_CHAT_ACTIVE = "SET_CHAT_ACTIVE";
export const SET_GROUP_CHAT_ACTIVE = "SET_GROUP_CHAT_ACTIVE";
export const SET_VIEW_COMPONENT = "SET_VIEW_COMPONENT";
export const SET_GROUP_OPTIONS_OPEN = "SET_GROUP_OPTIONS_OPEN";
export const SET_GROUP_OPTIONS_CLOSED = "SET_GROUP_OPTIONS_CLOSED";
export const SET_ADD_USER = "SET_ADD_USER";
export const SET_LEAVE_GROUP = "SET_LEAVE_GROUP";
export const SET_CURRENT_CONVERSATION = "SET_CURRENT_CONVERSATION";
export const SET_RECIPIENT_ID = "SET_RECIPIENT_ID";

// Action creators
export const setGroupOptionsOpen = (group) => ({
  type: SET_GROUP_OPTIONS_OPEN,
  payload: group,
});

export const setGroupOptionsClosed = () => ({
  type: SET_GROUP_OPTIONS_CLOSED,
});

export const setAddUser = () => ({
  type: SET_ADD_USER,
});

export const setLeaveGroup = () => ({
  type: SET_LEAVE_GROUP,
});

export const setCurrentConversation = (conversationId, isGroupMessage) => ({
  type: SET_CURRENT_CONVERSATION,
  payload: { conversationId, isGroupMessage },
});

export const setRecipientId = (recipientId) => ({
  type: SET_RECIPIENT_ID,
  payload: recipientId,
});

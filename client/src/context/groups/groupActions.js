export const ADD_GROUP = "ADD_GROUP";
export const REMOVE_GROUP = "REMOVE_GROUP";
export const SET_GROUPS = "SET_GROUPS";

export const addGroup = (group) => ({
  type: ADD_GROUP,
  payload: group,
});

export const removeGroup = (groupId) => ({
  type: REMOVE_GROUP,
  payload: groupId,
});

export const setGroups = (groups) => ({
  type: SET_GROUPS,
  payload: groups,
});

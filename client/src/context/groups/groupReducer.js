import { ADD_GROUP, REMOVE_GROUP, SET_GROUPS } from "./groupActions";

const initialState = {
  groups: [],
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_GROUP:
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };
    case REMOVE_GROUP:
      return {
        ...state,
        groups: state.groups.filter((group) => group.id !== action.payload),
      };
    case SET_GROUPS:
      return {
        ...state,
        groups: action.payload,
      };
    default:
      return state;
  }
};

export default groupReducer;

import {
    LOGIN,
    LOGOUT,
    UPDATE_USER,
    REFRESH_TOKEN,
    SET_ERROR,
    CLEAR_ERROR,
  } from "./authActions";
  
  const initialState = {
    authToken: localStorage.getItem("authToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    error: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN:
        return {
          ...state,
          authToken: action.payload.token,
          user: action.payload.user,
        };
      case LOGOUT:
        return {
          ...state,
          authToken: null,
          user: null,
        };
      case UPDATE_USER:
        return {
          ...state,
          user: { ...state.user, ...action.payload },
        };
      case REFRESH_TOKEN:
        return {
          ...state,
          authToken: action.payload.token,
        };
      case SET_ERROR:
        return {
          ...state,
          error: action.payload,
        };
      case CLEAR_ERROR:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const UPDATE_USER = "UPDATE_USER";
export const REFRESH_TOKEN = "REFRESH_TOKEN";
export const SET_ERROR = "SET_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const login = (token, user) => ({
  type: LOGIN,
  payload: { token, user },
});

export const logout = () => ({
  type: LOGOUT,
});

export const updateUser = (userData) => ({
  type: UPDATE_USER,
  payload: userData,
});

export const refreshToken = (token) => ({
  type: REFRESH_TOKEN,
  payload: { token },
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});
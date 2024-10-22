// client/src/utils/auth.js

export const getProfile = async (token) => {
  const { default: jwtDecode } = await import('jwt-decode');
  return jwtDecode(token);
};

export const loggedIn = async (token) => {
  const { default: jwtDecode } = await import('jwt-decode');
  return !!token && !isTokenExpired(token, jwtDecode);
};

export const isTokenExpired = async (token) => {
  try {
    const { default: jwtDecode } = await import('jwt-decode');
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem("id_token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const setToken = (idToken, dispatch) => {
  localStorage.setItem("id_token", idToken);
  dispatch({ type: 'SET_TOKEN', payload: idToken });
};

export const login = (idToken, refreshToken, dispatch) => {
  setToken(idToken, dispatch);
  localStorage.setItem("refresh_token", refreshToken);
  window.location.assign("/");
};

export const logout = (dispatch) => {
  localStorage.removeItem("id_token");
  localStorage.removeItem("refresh_token");
  dispatch({ type: 'LOGOUT' });
  window.location.assign("/login");
};

export const refreshToken = async (dispatch) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($refreshToken: String!) {
            refreshToken(refreshToken: $refreshToken) {
              token
            }
          }
        `,
        variables: { refreshToken: getRefreshToken() },
      }),
    });
    const data = await response.json();
    if (data.data && data.data.refreshToken) {
      setToken(data.data.refreshToken.token, dispatch);
      return data.data.refreshToken.token;
    }
    throw new Error(data.errors ? data.errors[0].message : 'Failed to refresh token');
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logout(dispatch);
  }
};

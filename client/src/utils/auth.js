import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import jwtDecode from "jwt-decode";

class AuthService {
  constructor() {
    this.authContext = useContext(AuthContext);
  }

  getProfile() {
    return jwtDecode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    this.authContext.setAuthToken(idToken); // Update context
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    this.authContext.setAuthToken(null); // Update context
    window.location.assign("/");
  }
}

export default new AuthService();

// client/src/pages/Login.jsx
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER} from "../graphql/mutations/loginUser";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login({
        variables: { email, password },
      });

      if (response.data && response.data.login) {
        const { token, user } = response.data.login;
        console.log("Login successful:", token, user);

        // Store the token in localStorage
        localStorage.setItem("id_token", token);

        // Optionally, redirect the user or update the UI
        // e.g., navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleFormSubmit} className="login-form">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p>Error logging in: {error.message}</p>}
      </form>
    </div>
  );
};

export default LoginPage;

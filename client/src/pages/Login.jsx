// client/src/pages/Login.jsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations/loginUser";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const { dispatch } = useAuth(); // Use the dispatch function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      console.log("Login successful:", data);

      // Dispatch the LOGIN action to update the context state
      dispatch({
        type: "LOGIN",
        payload: {
          token: data.login.token,
          user: data.login.user,
        },
      });

      // Store the token in local storage
      localStorage.setItem("authToken", data.login.token);
      localStorage.setItem("user", JSON.stringify(data.login.user));

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;

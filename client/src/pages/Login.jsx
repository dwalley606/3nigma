// client/src/pages/Login.jsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations/loginUser";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      console.log("Login successful:", data);
      localStorage.setItem("authToken", data.login.token);
      // Redirect or update UI as needed
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

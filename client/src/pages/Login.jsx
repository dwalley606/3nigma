// client/src/pages/Login.jsx
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER_MUTATION } from "../graphql/mutations/loginUser";
import Auth from "../utils/auth";

function Login() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_USER_MUTATION);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = data.login.token;
      Auth.login(token);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div>
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleFormSubmit} className="login-form">
        <label htmlFor="email">Email address:</label>
        <input
          placeholder="youremail@test.com"
          name="email"
          type="email"
          id="email"
          onChange={handleChange}
          value={formState.email}
        />

        <label htmlFor="password">Password:</label>
        <input
          placeholder="******"
          name="password"
          type="password"
          id="password"
          onChange={handleChange}
          value={formState.password}
        />

        {error && (
          <div>
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        )}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Login;

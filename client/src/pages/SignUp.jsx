import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom"; // Updated import
import { REGISTER_USER_MUTATION } from "../graphql/mutations/registerUser";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); // Updated hook
  const [registerUser, { data, loading, error }] = useMutation(
    REGISTER_USER_MUTATION
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await registerUser({
        variables: { username, email, password, phoneNumber },
      });
      console.log("User registered:", response.data.registerUser);
      setShowAlert(true); // Show the alert
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate("/login"); // Updated navigation
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

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

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {error && <p>Error signing up: {error.message}</p>}
      </form>

      {showAlert && (
        <div className="alert">
          <p>Registration successful! Please log in.</p>
          <button onClick={handleAlertClose}>OK</button>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;

import React from "react";
import { Link } from "react-router-dom";

const AuthLinks = ({ user, onLogout }) => {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      {user ? (
        <>
          <li>Logged in as: {user.username}</li>
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default AuthLinks;

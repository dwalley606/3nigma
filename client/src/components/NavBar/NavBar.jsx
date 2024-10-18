// src/components/NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/"); // Redirect to Home page
  };

  return (
    <nav className="navbar">
      {state.user ? (
        <div className="AuthNavMenu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/groups">Groups</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/chat">Chat</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="NoAuthNavMenu">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

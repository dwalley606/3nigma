// src/components/NavBar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./NavBar.css";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/"); // Redirect to Home page
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="navbar">
      {(location.pathname.startsWith("/chat") || 
        location.pathname === "/groups" || 
        location.pathname === "/settings") && (
        <button className="back-button" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
      )}
      {state.user ? (
        <div className="AuthNavMenu">
          <Link to="/settings">Settings</Link>
          {location.pathname === "/dashboard" && (
            <>
              <Link to="/groups">Groups</Link>
              <Link to="/contacts">Contacts</Link>
            </>
          )}
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

// src/components/NavBar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLinks from "../AuthLinks";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/groups">Groups</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/chat">Chat</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <AuthLinks onLogin={handleLogin} />
      )}
    </nav>
  );
};

export default Navbar;

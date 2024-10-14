// src/components/NavBar.jsx
import { useState, useEffect } from "react";
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
      <AuthLinks user={user} onLogout={handleLogout} />
    </nav>
  );
};

export default Navbar;

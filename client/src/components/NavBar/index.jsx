// src/components/NavBar.jsx
import { NavLink } from 'react-router-dom';
import './styles.css'; // Optional: Add styles for the NavBar

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/" exact activeClassName="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" activeClassName="active">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" activeClassName="active">
            Settings
          </NavLink>
        </li>
        <li>
          <NavLink to="/groups" activeClassName="active">
            Groups
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacts" activeClassName="active">
            Contacts
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat" activeClassName="active">
            Chat
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
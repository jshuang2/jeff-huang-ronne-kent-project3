import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { username, logout } = useAuth();

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors
    }
    logout();
    closeMenu();
  }

  return (
    <nav className="navbar">
      <div className="navbar-title">Math But Annoying</div>

      <button
        className="menu-toggle"
        type="button"
        onClick={toggleMenu}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className={menuOpen ? "navbar-links mobile-open" : "navbar-links"}>
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/games" onClick={closeMenu}>
          Selection
        </NavLink>
        <NavLink to="/rules" onClick={closeMenu}>
          Rules
        </NavLink>
        <NavLink to="/scores" onClick={closeMenu}>
          Scoreboard
        </NavLink>
        {username ? (
          <>
            <span className="navbar-user">Hi, {username}</span>
            <button className="navbar-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/register" onClick={closeMenu}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
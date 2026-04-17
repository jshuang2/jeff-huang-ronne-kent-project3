import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
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
        <NavLink to="/games/normal" onClick={closeMenu}>
          Normal
        </NavLink>
        <NavLink to="/games/easy" onClick={closeMenu}>
          Easy
        </NavLink>
        <NavLink to="/rules" onClick={closeMenu}>
          Rules
        </NavLink>
        <NavLink to="/scores" onClick={closeMenu}>
          Scoreboard
        </NavLink>
        <NavLink to="/login" onClick={closeMenu}>
          Login
        </NavLink>
        <NavLink to="/register" onClick={closeMenu}>
          Register
        </NavLink>
      </div>
    </nav>
  );
}
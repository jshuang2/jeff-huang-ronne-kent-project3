import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    let ignore = false;

    async function loadAuthState() {
      try {
        const response = await fetch("/api/user/isLoggedIn", {
          credentials: "include",
        });
        const data = await response.json().catch(() => ({}));

        if (!ignore && response.ok && data.username) {
          setUsername(data.username);
        }
      } catch {
        if (!ignore) {
          setUsername("");
        }
      }
    }

    loadAuthState();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleLogout() {
    // TODO-JEFF: The assignment specifies POST /api/user/logout, but the current
    // backend router is still stubbed and uses DELETE. This keeps the navbar usable
    // once the auth API is finalized.
    try {
      let response = await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        response = await fetch("/api/user/logout", {
          method: "DELETE",
          credentials: "include",
        });
      }
    } catch {
      // Ignore network errors here so the UI can still clear local auth state.
    }

    setUsername("");
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

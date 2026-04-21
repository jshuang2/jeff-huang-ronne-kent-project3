import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();
  const isDisabled = !username || !password;

  async function handleLogin() {
    setError("");
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      login(data.username);
      navigate("/games");
    } catch {
      setError("Unable to connect to server.");
    }
  }

  return (
    <main className="content">
      <h1>Login</h1>
      <div className="form-container">
        <label htmlFor="username-field">Username</label>
        <input
          type="text"
          id="username-field"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password-field">Password</label>
        <input
          type="password"
          id="password-field"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="button" onClick={handleLogin} disabled={isDisabled}>
          Login
        </button>
      </div>
    </main>
  );
}
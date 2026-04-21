import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();
  const isDisabled = !username || !password || !verifyPassword;

  async function handleRegister() {
    setError("");

    if (password !== verifyPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed.");
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
      <h1>Register</h1>
      <div className="form-container">
        <label htmlFor="username-field">Username</label>
        <input
          type="text"
          id="username-field"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password-field">Password</label>
        <input
          type="password"
          id="password-field"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="verify-password-field">Verify Password</label>
        <input
          type="password"
          id="verify-password-field"
          placeholder="Re-enter your password"
          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />
        {error && <p className="form-error">{error}</p>}
        <button type="button" onClick={handleRegister} disabled={isDisabled}>
          Register
        </button>
      </div>
    </main>
  );
}
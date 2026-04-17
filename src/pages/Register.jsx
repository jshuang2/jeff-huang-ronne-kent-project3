export default function RegisterPage() {
  return (
    <main className="content">
      <h1>Register</h1>

      <div className="form-container">
        <label htmlFor="username-field">Username</label>
        <input
          type="text"
          id="username-field"
          placeholder="Choose a username"
        />

        <label htmlFor="password-field">Password</label>
        <input
          type="password"
          id="password-field"
          placeholder="Choose a password"
        />

        <label htmlFor="verify-password-field">Verify Password</label>
        <input
          type="password"
          id="verify-password-field"
          placeholder="Re-enter your password"
        />

        <button type="button">Register</button>
      </div>
    </main>
  );
}
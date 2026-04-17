export default function LoginPage() {
  return (
    <main className="content">
      <h1>Login</h1>

      <div className="form-container">
        <label htmlFor="username-field">Username</label>
        <input
          type="text"
          id="username-field"
          placeholder="Enter your username"
        />

        <label htmlFor="password-field">Password</label>
        <input
          type="password"
          id="password-field"
          placeholder="Enter your password"
        />

        <button type="button">Login</button>
      </div>
    </main>
  );
}
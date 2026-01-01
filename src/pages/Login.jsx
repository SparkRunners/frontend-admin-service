import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import googleIcon from "../icons/google.svg";

const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:3001";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onGoogleLogin() {
    window.location.href = `${AUTH_BASE}/auth/google`;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const next = location.state?.from || "/";
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="auth-shell">
    <div className="auth-card">
      <h2 className="auth-title">Admin login</h2>
      <p className="auth-subtitle">Logga in med e-post och lösenord.</p>

      <div className="auth-actions">
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loading}
          className="btn btn-secondary btn-google"
        >
          <img src={googleIcon} alt="" aria-hidden="true" className="btn-icon" />
          Fortsätt med Google
        </button>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="field">
          <label>E-post</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label>Lösenord</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>

      <p className="auth-footer">
        Behöver du ett konto? <Link to="/register">Registrera</Link>
      </p>
    </div>
  </div>
);
}
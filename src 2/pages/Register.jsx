import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
        await register(username, email, password);
        navigate("/login", { replace: true });
        } catch (err) {
        setError(err.message || "Registrering misslyckades");
        } finally {
        setLoading(false);
        }
}

return (
    <div className="auth-shell">
        <div className="auth-card">
            <h2 className="auth-title">Registrera konto</h2>
            <p className="auth-subtitle">
            Skapa ett konto med användarnamn, e-post och lösenord.
            </p>

        <form className="auth-form" onSubmit={onSubmit}>
            <div className="field">
                <label>Användarnamn</label>
                <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                />
            </div>

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
              autoComplete="new-password"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Skapar konto..." : "Registrera"}
          </button>
        </form>

        <p className="auth-footer">
          Har du redan konto? <Link to="/login">Logga in</Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:3001";

export default function LoginPage() {
    const nav = useNavigate();
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
            nav("/", { replace: true });
        } catch (err) {
            setError(err.message || "Login misslyckades");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card" style={{ maxWidth: 420 }}>
            <h2>Admin Login</h2>

            <button
                type="button"
                onClick={onGoogleLogin}
                disabled={loading}
                style={{ width: "100%", marginBottom: 12 }}
            >
                Fortsätt med Google
            </button>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem" }}>
                <label>
                    E-post
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Lösenord
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </label>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Loggar in..." : "Logga in"}
                </button>
            </form>
        </div>
    );
}

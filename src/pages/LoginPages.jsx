import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function LoginPage() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import { clearToken } from "../api/token";

export default function AdminLayout() {
    const navigate = useNavigate();
    const today = new Date().toISOString().slice(0, 10);

    function handleLogout() {
        clearToken();
        navigate("/login", { replace: true });
    }

    return (
        <div className="admin-shell">
            <header className="admin-header">
                <div>
                    <h1>SparkRunners – Admin</h1>
                    <p>Drift, fordon och kunder</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="admin-date">{today}</div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "0.4rem 0.9rem",
                            borderRadius: "999px",
                            border: "none",
                            background: "#ef4444",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                        }}
                    >
                        Logga ut
                    </button>
                </div>
            </header>

            <div className="admin-body">
                <nav className="admin-nav">
                    <ul>
                        <li>
                            <NavLink to="/" end>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/scooters">
                                Fordonsvy
                            </NavLink>
                        </li>
                        <li>
                            <Link to="/coming-soon">Kundvy (kommer senare)</Link>
                        </li>
                    </ul>
                </nav>

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

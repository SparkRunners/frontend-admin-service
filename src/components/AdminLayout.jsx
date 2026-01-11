import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";
import { clearToken, getToken, isLoggedIn } from "../auth/token";
import { decodeJwt } from "../api/jwt";

export default function AdminLayout() {
    const navigate = useNavigate();
    const today = new Date().toISOString().slice(0, 10);

    const token = getToken();
    const payload = token ? decodeJwt(token) : null;
    const email = payload?.email || payload?.username || "";

    function onLogout() {
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

        <div className="admin-header-right">
            <div className="admin-date">{today}</div>
                {isLoggedIn() ? (
            <div className="admin-auth">
                <span className="admin-user">{email}</span>
                <button
                    type="button"
                    className="admin-logout"
                    onClick={onLogout}
                >
                Logga ut
                </button>
            </div>
            ) : (
            <Link to="/login">Logga in</Link>
            )}
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
                <NavLink to="/scooters">Fordonsvy</NavLink>
                </li>
                <li>
                <NavLink to="/stations">Stationer</NavLink>
                </li>
                <li>
                <NavLink to="/parking-zones">Parkeringszoner</NavLink>
                </li>
                <li>
                <NavLink to="/map">Kartvy</NavLink>
                </li>
                <li>
                <NavLink to="/customers">Kunder</NavLink>
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

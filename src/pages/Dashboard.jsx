import { useEffect, useState } from "react";
import { fetchScooters, fetchStatus } from "../api/scooters";
import { fetchCities } from "../api/cities";

function aggregateScooters(scooters) {
  const list = Array.isArray(scooters) ? scooters : [];
  const total = list.length;

  const perStatus = list.reduce((acc, s) => {
    const key = s?.status || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const perCity = list.reduce((acc, s) => {
    const key = s?.city || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return { total, perStatus, perCity };
}

function statusClass(status) {
  return String(status || "unknown")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function Dashboard() {
  const [scooters, setScooters] = useState([]);
  const [cities, setCities] = useState([]);
  const [health, setHealth] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [statusRes, scootersRes, citiesRes] = await Promise.all([
          fetchStatus(),
          fetchScooters(),
          fetchCities().catch((err) => {
            console.warn("fetchCities failed:", err?.message);
            return [];
          }),
        ]);

        if (!alive) return;

        setHealth(statusRes);
        setScooters(Array.isArray(scootersRes) ? scootersRes : []);
        setCities(Array.isArray(citiesRes) ? citiesRes : []);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Kunde inte hämta dashboard-data");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <p>Laddar dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const { total, perStatus, perCity } = aggregateScooters(scooters);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className="cards-grid" style={{ marginTop: "1rem" }}>
        <div className="card">
          <h2>Systemstatus</h2>
          <div className="card-value">
            {health?.status === "ok" ? "Uppe" : "Nere"}
          </div>
          <p>Version: {health?.version ?? "—"}</p>
        </div>

        <div className="card">
          <h2>Aktiva städer</h2>
          <div className="card-value">{cities.length}</div>
        </div>

        <div className="card">
          <h2>Totalt antal fordon</h2>
          <div className="card-value">{total}</div>
        </div>

        <div className="card">
          <h2>Fordon per stad</h2>
          {Object.entries(perCity).map(([c, count]) => (
            <p key={`perCity-${c}`}>
              {c}: <strong>{count}</strong>
            </p>
          ))}
        </div>

        <div className="card">
          <h2>Fordon per status</h2>
          {Object.entries(perStatus).map(([st, count]) => (
            <p
              key={`perStatus-${st}`}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span className={`badge badge-${statusClass(st)}`}>{st}</span>
              <strong>{count}</strong>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

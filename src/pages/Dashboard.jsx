import { useEffect, useMemo, useState } from "react";
import { fetchScooters, fetchStatus } from "../api/scooters";
import { fetchCities } from "../api/cities";
import { useLiveScooters } from "../api/useLiveScooters";

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

  const { scooters: scootersForUi, meta: liveMeta, lastUpdateText } =
    useLiveScooters(scooters);

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
        setCities(citiesRes);
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

  const { total, perStatus, perCity } = useMemo(
    () => aggregateScooters(scootersForUi),
    [scootersForUi]
  );

  if (loading) return <p>Laddar dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Optional: live status row */}
      <div style={{ marginTop: 6, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <span>
          Live:{" "}
          <strong style={{ color: liveMeta.connected ? "green" : "crimson" }}>
            {liveMeta.connected ? "Ansluten" : "Frånkopplad"}
          </strong>
        </span>
        <span>
          Uppdaterad: <strong>{lastUpdateText}</strong>
        </span>
        <span>
          Totalt (live): <strong>{liveMeta.count || 0}</strong>
        </span>
        {liveMeta.error ? (
          <span style={{ color: "crimson" }}>{liveMeta.error}</span>
        ) : null}
      </div>

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
          <div className="card-value">{cities.length > 0 ? (
              <p style={{ marginTop: 8, opacity: 0.8 }}>
                {cities.map((c) => c?.name).filter(Boolean).join(", ")}
              </p>
            ) : (
              <p style={{ marginTop: 8, opacity: 0.7 }}>Inga städer hittades</p>
            )}
</div>
        </div>

        <div className="card">
          <h2>Totalt antal fordon</h2>
          <div className="card-value">{total}</div>
          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Källa:{" "}
            <strong>{liveMeta.count > 0 ? "Simulation" : "REST"}</strong>
          </p>
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

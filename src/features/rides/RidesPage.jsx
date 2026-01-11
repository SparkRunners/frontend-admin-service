import { useEffect, useState } from "react";
import { fetchRides } from "../../api/rides";

function rideKey(r, idx) {
  return r?._id ?? r?.id ?? `${r?.userId ?? "u"}-${r?.scooterId ?? "s"}-${idx}`;
}

export default function RidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const list = await fetchRides({ city, status });
      setRides(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || "Kunde inte hämta resor");
      setRides([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Resor</h2>
          <p style={{ margin: "0.25rem 0 0" }}>Reshistorik (JWT)</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12 }}>Stad</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="t.ex. Göteborg"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12 }}>Status</label>
            <input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="t.ex. completed"
            />
          </div>
          <button type="button" onClick={load}>Filtrera</button>
        </div>
      </div>

      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && !error && rides.length === 0 && <p>Inga resor hittades.</p>}

      {!loading && !error && rides.length > 0 && (
        <table style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th align="left">ID</th>
              <th align="left">Stad</th>
              <th align="left">Scooter</th>
              <th align="left">User</th>
              <th align="left">Start</th>
              <th align="left">Slut</th>
              <th align="left">Distans</th>
              <th align="left">Cost</th>
              <th align="left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rides.map((r, idx) => {
              const id = r?._id ?? r?.id ?? "-";
              const cityValue = r?.startPosition?.city || r?.endPosition?.city || "-";

              return (
                <tr key={rideKey(r, idx)}>
                  <td>{id}</td>
                  <td>{cityValue}</td>
                  <td>{r?.scooterId ?? "-"}</td>
                  <td>{r?.userId ?? "-"}</td>
                  <td>{r?.startTime ? new Date(r.startTime).toLocaleString() : "-"}</td>
                  <td>{r?.endTime ? new Date(r.endTime).toLocaleString() : "-"}</td>
                  <td>{typeof r?.distance === "number" ? r.distance : "-"}</td>
                  <td>{typeof r?.cost === "number" ? r.cost : "-"}</td>
                  <td>{r?.status ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

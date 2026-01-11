import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStations } from "../../api/stations";

function getPointPos(station) {
  const coords = station?.geometry?.coordinates;
  if (Array.isArray(coords) && coords.length === 2) {
    const [lng, lat] = coords;
    if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
  }

  const lat = station?.coordinates?.latitude ?? station?.lat;
  const lng = station?.coordinates?.longitude ?? station?.lng ?? station?.lon;
  if (typeof lat === "number" && typeof lng === "number") return { lat, lng };

  return null;
}

export default function StationsPage() {
  const nav = useNavigate();
  const [stations, setStations] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const list = await fetchStations();
        if (alive) setStations(Array.isArray(list) ? list : []);
      } catch (e) {
        if (alive) setError(e?.message || "Kunde inte hämta stationer");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return stations;

    return stations.filter((s) => {
      const id = String(s?._id || s?.id || "");
      const name = String(s?.name || s?.title || "");
      const city = String(s?.city || s?.cityName || "");
      return `${id} ${name} ${city}`.toLowerCase().includes(needle);
    });
  }, [stations, q]);

  return (
    <main className="admin-main">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: "1rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Laddstationer</h2>
          <p style={{ margin: "0.25rem 0 0" }}>Lista stationer och hoppa till kartvy</p>
        </div>
        <input
          className="admin-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Sök station..."
          style={{ minWidth: 280 }}
        />
      </div>

      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && !error && filtered.length === 0 && <p>Inga stationer hittades.</p>}

      {!loading && !error && filtered.length > 0 && (
        <table className="admin-table" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th align="left">ID</th>
              <th align="left">Namn</th>
              <th align="left">Stad</th>
              <th align="left">Position</th>
              <th align="left">Karta</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const id = s?._id || s?.id || s?.stationId;
              const name = s?.name || s?.title || id || "-";
              const city = s?.city || s?.cityName || "-";

              const pos = getPointPos(s);
              const posText = pos ? `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` : "-";

              return (
                <tr key={id || `${city}-${name}`}>
                  <td>{id || "-"}</td>
                  <td>{name}</td>
                  <td>{city}</td>
                  <td>{posText}</td>
                  <td>
                    <button
                    className="btn-small"
                    type="button"
                    onClick={() => {
                      if (!id || !pos) return;
                      nav(
                        `/map?focus=station&id=${encodeURIComponent(String(id))}&lat=${encodeURIComponent(
                          String(pos.lat)
                        )}&lng=${encodeURIComponent(String(pos.lng))}`
                      );
                    }}
                    disabled={!id || !pos}
                  >
                    Visa
                  </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

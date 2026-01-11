import { useEffect, useMemo, useState } from "react";
import { fetchParkingZones } from "../../api/parkingZones";

function makeKey(z, idx) {
  return z?._id ?? z?.name ?? `zone-${idx}`;
}

export default function ParkingZonesPage() {
  const [zones, setZones] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchParkingZones(city ? { city } : {});
        if (!alive) return;
        setZones(data);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Kunde inte hämta parkeringszoner");
        setZones([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [city]);

  const cityOptions = useMemo(() => {
    const set = new Set();
    for (const z of zones) {
      if (z?.city) set.add(z.city);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [zones]);

  return (
    <div>
      <h2>Parkeringszoner</h2>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="filters-row">
          <label>
            Stad
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Alla</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        {loading && <p>Laddar parkeringszoner...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && zones.length === 0 && (
          <p>Inga parkeringszoner hittades.</p>
        )}

        {!loading && !error && zones.length > 0 && (
          <table className="scooter-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Namn</th>
                <th>Stad</th>
                <th>Maxhastighet</th>
                <th>Polygonpunkter</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z, idx) => {
                const points =
                  z?.geometry?.type === "Polygon"
                    ? z.geometry.coordinates?.[0] || []
                    : [];

                return (
                  <tr key={makeKey(z, idx)}>
                    <td>{z?._id}</td>
                    <td>{z?.name}</td>
                    <td>{z?.city}</td>
                    <td>{z?.rules?.maxSpeed ?? "—"}</td>
                    <td>{points.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

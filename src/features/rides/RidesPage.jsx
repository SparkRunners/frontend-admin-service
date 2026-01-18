import { useEffect, useMemo, useState } from "react";
import { fetchRides } from "../../api/rides";
import TripDetailModal from "./TripDetailModal";

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("sv-SE");
}

function safeLower(v) {
  return String(v || "").toLowerCase();
}

function tripId(t) {
  return t?.id ?? t?._id ?? "—";
}

export default function RidesPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [openTrip, setOpenTrip] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchRides();
        if (!alive) return;
        setTrips(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Kunde inte hämta resor");
        setTrips([]);
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

  const cities = useMemo(() => {
    const set = new Set();
    for (const t of trips) {
      const c = t?.startPosition?.city || t?.endPosition?.city;
      if (c) set.add(c);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "sv-SE"));
  }, [trips]);

  const filtered = useMemo(() => {
    const qv = safeLower(q).trim();

    const fromMs = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const toMs = to ? new Date(`${to}T23:59:59`).getTime() : null;

    return trips.filter((t) => {
      const id = tripId(t);
      const scooter = t?.scooter || "";
      const c = t?.startPosition?.city || t?.endPosition?.city || "";

      if (city && c !== city) return false;

      if (qv) {
        const hay = `${id} ${scooter} ${c}`.toLowerCase();
        if (!hay.includes(qv)) return false;
      }

      const startMs = t?.startTime ? new Date(t.startTime).getTime() : null;
      if (fromMs && startMs && startMs < fromMs) return false;
      if (toMs && startMs && startMs > toMs) return false;

      return true;
    });
  }, [trips, q, city, from, to]);

  return (
    <div>
      <h2>Resor</h2>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="filters-row">
          <strong>Filter</strong>

          <label>
            Sök
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Scooter, stad eller trip-id"
            />
          </label>

          <label>
            Stad
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Alla</option>
              {cities.map((c) => (
                <option key={`city-${c}`} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            Från
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>

          <label>
            Till
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>

          <button
            type="button"
            className="btn"
            onClick={() => {
              setQ("");
              setCity("");
              setFrom("");
              setTo("");
            }}
          >
            Rensa
          </button>
        </div>

        {loading && <p>Laddar resor...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && filtered.length === 0 && <p>Inga resor hittades.</p>}

        {!loading && !error && filtered.length > 0 && (
          <table className="scooter-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Scooter</th>
                <th>Start</th>
                <th>Slut</th>
                <th>Varaktighet</th>
                <th>Kostnad</th>
                <th>Startstad</th>
                <th>Slutstad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const id = tripId(t);
                return (
                  <tr key={id}>
                    <td>{String(id).slice(-8)}</td>
                    <td>{t?.scooter ?? "—"}</td>
                    <td>{fmtDate(t?.startTime)}</td>
                    <td>{fmtDate(t?.endTime)}</td>
                    <td>{t?.duration ?? "—"}</td>
                    <td>{t?.cost ?? "—"}</td>
                    <td>{t?.startPosition?.city ?? "—"}</td>
                    <td>{t?.endPosition?.city ?? "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button type="button" className="btn" onClick={() => setOpenTrip(t)}>
                        Öppna
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <TripDetailModal open={Boolean(openTrip)} trip={openTrip} onClose={() => setOpenTrip(null)} />
    </div>
  );
}

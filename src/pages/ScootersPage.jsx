import { useEffect, useMemo, useState } from "react";
import { fetchScooters } from "../api/scooters";

const CITIES = ["Stockholm", "Göteborg", "Malmö"];
const STATUSES = ["Available", "In use", "Charging", "Maintenance", "Off"];

function makeKey(s, idx) {
    return (
        s?.id ??
        s?._id ??
        s?.scooterId ??
        (s?.name && `${s.name}-${s?.city ?? "unknown"}-${idx}`) ??
        `row-${idx}`
    );
    }

    function statusClass(status) {
    return String(status || "unknown")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
    }

    export default function ScootersPage() {
    const [scooters, setScooters] = useState([]);
    const [city, setCity] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        async function loadScooters() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchScooters({ city, status });

            const list = Array.isArray(data) ? data : [];
            if (!alive) return;

            setScooters(list);

            if (list.length > 0) {
            console.log("Scooter sample:", list[0]);
            }
        } catch (err) {
            if (!alive) return;
            setError(err?.message || "Kunde inte hämta fordon");
            setScooters([]);
        } finally {
            if (!alive) return;
            setLoading(false);
        }
        }

        loadScooters();
        return () => {
        alive = false;
        };
    }, [city, status]);

    const hasData = useMemo(() => scooters && scooters.length > 0, [scooters]);

    return (
        <div>
        <h2>Fordonsvy</h2>

        <div className="card" style={{ marginTop: "1rem" }}>
            <div className="filters-row">
            <strong>Filter</strong>

            <label>
                Stad
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Alla</option>
                {CITIES.map((c) => (
                    <option key={`city-${c}`} value={c}>
                    {c}
                    </option>
                ))}
                </select>
            </label>

            <label>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Alla</option>
                {STATUSES.map((s) => (
                    <option key={`status-${s}`} value={s}>
                    {s}
                    </option>
                ))}
                </select>
            </label>
            </div>

            {loading && <p>Laddar fordon...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && !hasData && (
            <p>Inga fordon hittades för valda filter.</p>
            )}

            {!loading && !error && hasData && (
            <table className="scooter-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Namn</th>
                    <th>Stad</th>
                    <th>Status</th>
                    <th>Batteri</th>
                    <th>Hastighet</th>
                    <th>Long</th>
                    <th>Lat</th>
                </tr>
                </thead>
                <tbody>
                {scooters.map((s, idx) => {
                    const key = makeKey(s, idx);

                    return (
                    <tr key={key}>
                        <td>{s?.id ?? s?._id ?? "—"}</td>
                        <td>{s?.name ?? "—"}</td>
                        <td>{s?.city ?? "—"}</td>
                        <td>
                        <span className={`badge badge-${statusClass(s?.status)}`}>
                            {s?.status ?? "Unknown"}
                        </span>
                        </td>
                        <td>
                        {typeof s?.battery === "number" ? `${s.battery}%` : "—"}
                        </td>
                        <td>
                        {typeof s?.speed === "number" ? `${s.speed} km/h` : "—"}
                        </td>
                        <td>{s?.coordinates?.longitude ?? "—"}</td>
                        <td>{s?.coordinates?.latitude ?? "—"}</td>
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

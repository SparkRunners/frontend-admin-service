import { useEffect, useState } from "react";
import { fetchScooters } from "../api/scooters";

const CITIES = ["Stockholm", "Göteborg", "Malmö"];
const STATUSES = ["Available", "In use", "Charging", "Maintenance", "Off"];

export default function ScootersPage() {
    const [scooters, setScooters] = useState([]);
    const [city, setCity] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadScooters();
    }, [city, status]);

    async function loadScooters() {
        setLoading(true);
        setError("");

        try {
            const data = await fetchScooters({ city, status });
            setScooters(data);
        } catch (err) {
            setError(err.message || "Kunde inte hämta fordon");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Fordonsvy</h2>

            <div className="card" style={{ marginTop: "1rem" }}>
                <div className="filters-row">
                    <strong>Filter</strong>

                    <label>
                        Stad
                        <select value={city} onChange={e => setCity(e.target.value)}>
                            <option value="">Alla</option>
                            {CITIES.map(c => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Status
                        <select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="">Alla</option>
                            {STATUSES.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {loading && <p>Laddar fordon...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && (
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
                            {scooters.map(s => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>{s.city}</td>
                                    <td>
                                        <span className={`badge badge-${s.status}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td>{s.battery}%</td>
                                    <td>{s.speed} km/h</td>
                                    <td>{s.coordinates.longitude}</td>
                                    <td>{s.coordinates.latitude}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

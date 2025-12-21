import { useEffect, useState } from "react";
import { fetchScooters, fetchStatus } from "../api/scooters";

function aggregateScooters(scooters) {
    const total = scooters.length;

    const perStatus = scooters.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
    }, {});

    const perCity = scooters.reduce((acc, s) => {
        acc[s.city] = (acc[s.city] || 0) + 1;
        return acc;
    }, {});

    return { total, perStatus, perCity };
}

export default function Dashboard() {
    const [scooters, setScooters] = useState([]);
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const [statusRes, scootersRes] = await Promise.all([
                    fetchStatus(),
                    fetchScooters()
                ]);
                setHealth(statusRes);
                setScooters(scootersRes);
            } catch (err) {
                setError(err.message || "Kunde inte hämta dashboard-data");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return <p>Laddar dashboard...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

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
                    <p>Version: {health?.version}</p>
                </div>

                <div className="card">
                    <h2>Totalt antal fordon</h2>
                    <div className="card-value">{total}</div>
                </div>

                <div className="card">
                    <h2>Fordon per stad</h2>
                    {Object.entries(perCity).map(([city, count]) => (
                        <p key={city}>
                            {city}: <strong>{count}</strong>
                        </p>
                    ))}
                </div>

                <div className="card">
                    <h2>Fordon per status</h2>
                    {Object.entries(perStatus).map(([status, count]) => (
                        <p key={status}>
                            {status}: <strong>{count}</strong>
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

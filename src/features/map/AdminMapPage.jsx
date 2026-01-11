import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { fetchScooters } from "../../api/scooters";
import { fetchZones } from "../../api/zones";
import ScootersLayer from "./layers/ScootersLayer";
import StationsLayer from "./layers/StationsLayer";
import ParkingZonesLayer from "./layers/ParkingZonesLayer";
import { useSearchParams } from "react-router-dom";

const CITIES = ["", "Stockholm", "Göteborg", "Malmö"];
const STATUSES = ["", "Available", "In use", "Charging", "Maintenance", "Off"];

const CITY_CENTER = {
    Stockholm: [59.3293, 18.0686],
    Göteborg: [57.7089, 11.9746],
    Malmö: [55.605, 13.0038],
    };

    function MapViewUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
    }

    export default function AdminMapPage() {
    const [searchParams] = useSearchParams();
    const focus = searchParams.get("focus");
    const focusId = searchParams.get("id");
    const focusLat = Number(searchParams.get("lat"));
    const focusLng = Number(searchParams.get("lng"));

    const [city, setCity] = useState("");
    const [status, setStatus] = useState("");

    const [scooters, setScooters] = useState([]);
    const [zones, setZones] = useState([]);

    const [showZones, setShowZones] = useState(true);
    const [showStations, setShowStations] = useState(true);
    const [showScooters, setShowScooters] = useState(true);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        async function load() {
        setLoading(true);
        setError("");

        try {
            const [scootersRes, zonesRes] = await Promise.all([
            fetchScooters({ city, status }),
            fetchZones(city ? { city } : {}),
            ]);

            if (!alive) return;

            setScooters(Array.isArray(scootersRes) ? scootersRes : []);
            setZones(Array.isArray(zonesRes) ? zonesRes : []);
        } catch (err) {
            if (!alive) return;
            setError(err?.message || "Kunde inte hämta kartdata");
        } finally {
            if (!alive) return;
            setLoading(false);
        }
        }

        load();
        return () => {
        alive = false;
        };
    }, [city, status]);

    const center = useMemo(
        () => CITY_CENTER[city] || CITY_CENTER.Stockholm,
        [city]
    );

    const baseZoom = city ? 18 : 13;

    const focusCenter = useMemo(() => {
        if (
        focus === "station" &&
        Number.isFinite(focusLat) &&
        Number.isFinite(focusLng)
        ) {
        return [focusLat, focusLng];
        }
        return center;
    }, [focus, focusLat, focusLng, center]);

    const zoom = useMemo(() => {
        if (
        focus === "station" &&
        Number.isFinite(focusLat) &&
        Number.isFinite(focusLng)
        ) {
        return 16;
        }
        return baseZoom;
    }, [focus, focusLat, focusLng, baseZoom]);

    const polygonZones = useMemo(() => {
        return zones.filter((z) => z?.geometry?.type === "Polygon");
    }, [zones]);

    const stationZones = useMemo(() => {
        return zones.filter(
        (z) => z?.type === "charging" && z?.geometry?.type === "Point"
        );
    }, [zones]);

    return (
        <div className="map-shell">
        <h2>Kartvy</h2>

        <div className="card">
            <div className="map-toolbar">
            <label>
                Stad
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => (
                    <option key={`city-${c || "all"}`} value={c}>
                    {c || "Alla"}
                    </option>
                ))}
                </select>
            </label>

            <label>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                    <option key={`status-${s || "all"}`} value={s}>
                    {s || "Alla"}
                    </option>
                ))}
                </select>
            </label>

            <label className="toggle">
                <input
                type="checkbox"
                checked={showScooters}
                onChange={(e) => setShowScooters(e.target.checked)}
                />
                Scooters
            </label>

            <label className="toggle">
                <input
                type="checkbox"
                checked={showStations}
                onChange={(e) => setShowStations(e.target.checked)}
                />
                Stationer
            </label>

            <label className="toggle">
                <input
                type="checkbox"
                checked={showZones}
                onChange={(e) => setShowZones(e.target.checked)}
                />
                Zoner
            </label>

            {loading && <p style={{ margin: 0 }}>Laddar...</p>}
            {error && <p style={{ margin: 0, color: "red" }}>{error}</p>}
            </div>
        </div>

        <div className="map-panel">
            <MapContainer center={focusCenter} zoom={zoom} scrollWheelZoom>
            <MapViewUpdater center={focusCenter} zoom={zoom} />

            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {showZones && <ParkingZonesLayer zones={polygonZones} />}
            {showStations && (
                <StationsLayer stations={stationZones} focusId={focusId} />
            )}
            {showScooters && <ScootersLayer scooters={scooters} />}
            </MapContainer>
        </div>
        </div>
    );
}

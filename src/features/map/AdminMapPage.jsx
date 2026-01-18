import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Polyline, Popup } from "react-leaflet";
import { fetchScooters } from "../../api/scooters";
import { fetchZones } from "../../api/zones";
import ScootersLayer from "./layers/ScootersLayer";
import StationsLayer from "./layers/StationsLayer";
import ParkingZonesLayer from "./layers/ParkingZonesLayer";
import { useLocation, useSearchParams } from "react-router-dom";
import { connectSimulationSocket } from "../../api/simulationSocket";

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

function normalizePoint(pos) {
  if (!pos) return null;

  if (typeof pos.latitude === "number" && typeof pos.longitude === "number") {
    return { latitude: pos.latitude, longitude: pos.longitude };
  }

  if (
    pos.coordinates &&
    typeof pos.coordinates.latitude === "number" &&
    typeof pos.coordinates.longitude === "number"
  ) {
    return {
      latitude: pos.coordinates.latitude,
      longitude: pos.coordinates.longitude,
    };
  }

  return null;
}

export default function AdminMapPage() {
  const location = useLocation();
  const trip = location.state?.trip;

  const [searchParams] = useSearchParams();
  const focus = searchParams.get("focus");
  const focusId = searchParams.get("id");
  const focusLat = Number(searchParams.get("lat"));
  const focusLng = Number(searchParams.get("lng"));

  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");

  const [scooters, setScooters] = useState([]);
  const [zones, setZones] = useState([]);

  const [liveScooters, setLiveScooters] = useState([]);
  const [liveMeta, setLiveMeta] = useState({
    connected: false,
    lastUpdateIso: null,
    count: 0,
    error: "",
  });

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

  useEffect(() => {
    const disconnect = connectSimulationSocket({
      onConnect: () => {
        setLiveMeta((m) => ({ ...m, connected: true, error: "" }));
      },
      onDisconnect: () => {
        setLiveMeta((m) => ({ ...m, connected: false }));
      },
      onError: (err) => {
        setLiveMeta((m) => ({ ...m, error: err?.message || "Socket error" }));
      },
      onScooters: (list) => {
        setLiveScooters(list);
        setLiveMeta((m) => ({
          ...m,
          connected: true,
          lastUpdateIso: new Date().toISOString(),
          count: list.length,
        }));
      },
    });

    return () => disconnect?.();
  }, []);

  const center = useMemo(() => CITY_CENTER[city] || CITY_CENTER.Stockholm, [city]);
  const baseZoom = city ? 18 : 13;

  const focusCenter = useMemo(() => {
    if (focus === "station" && Number.isFinite(focusLat) && Number.isFinite(focusLng)) {
      return [focusLat, focusLng];
    }
    return center;
  }, [focus, focusLat, focusLng, center]);

  const zoom = useMemo(() => {
    if (focus === "station" && Number.isFinite(focusLat) && Number.isFinite(focusLng)) {
      return 16;
    }
    return baseZoom;
  }, [focus, focusLat, focusLng, baseZoom]);

  const polygonZones = useMemo(() => {
    return zones.filter((z) => z?.geometry?.type === "Polygon");
  }, [zones]);

  const stationZones = useMemo(() => {
    return zones.filter((z) => z?.type === "charging" && z?.geometry?.type === "Point");
  }, [zones]);

  const startPoint = normalizePoint(trip?.start);
  const endPoint = normalizePoint(trip?.end);

  const tripCenter = useMemo(() => {
    if (startPoint && endPoint) {
      return [
        (startPoint.latitude + endPoint.latitude) / 2,
        (startPoint.longitude + endPoint.longitude) / 2,
      ];
    }
    if (startPoint) return [startPoint.latitude, startPoint.longitude];
    if (endPoint) return [endPoint.latitude, endPoint.longitude];
    return focusCenter;
  }, [startPoint, endPoint, focusCenter]);

  const tripZoom = useMemo(() => {
    if (startPoint && endPoint) return 15;
    if (startPoint || endPoint) return 15;
    return zoom;
  }, [startPoint, endPoint, zoom]);

  const scootersSource = useMemo(() => {
    const hasLive = liveMeta.connected && Array.isArray(liveScooters) && liveScooters.length > 0;
    return hasLive ? liveScooters : scooters;
  }, [liveMeta.connected, liveScooters, scooters]);

  const MAX_ON_MAP = 300;

  const scootersForMap = useMemo(() => {
    const list = Array.isArray(scootersSource) ? scootersSource : [];

    const filtered = list.filter((s) => {
      if (city && s?.city !== city) return false;
      if (status && s?.status !== status) return false;
      return true;
    });

    return filtered.slice(0, MAX_ON_MAP);
  }, [scootersSource, city, status]);

  const lastUpdateText = useMemo(() => {
    if (!liveMeta.lastUpdateIso) return "—";
    return new Date(liveMeta.lastUpdateIso).toLocaleTimeString("sv-SE");
  }, [liveMeta.lastUpdateIso]);

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

          {/* Live simulation indicator */}
          <div style={{ marginLeft: "auto", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <span>
              Live:{" "}
              <strong style={{ color: liveMeta.connected ? "green" : "crimson" }}>
                {liveMeta.connected ? "Ansluten" : "Frånkopplad"}
              </strong>
            </span>
            <span>Uppdaterad: <strong>{lastUpdateText}</strong></span>
            <span>Totalt: <strong>{liveMeta.count || 0}</strong></span>
            {liveMeta.error ? <span style={{ color: "crimson" }}>{liveMeta.error}</span> : null}
          </div>

          {loading && <p style={{ margin: 0 }}>Laddar...</p>}
          {error && <p style={{ margin: 0, color: "red" }}>{error}</p>}
        </div>
      </div>

      <div className="map-panel">
        <MapContainer center={tripCenter} zoom={tripZoom} scrollWheelZoom>
          <MapViewUpdater center={tripCenter} zoom={tripZoom} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {showZones && <ParkingZonesLayer zones={polygonZones} />}
          {showStations && <StationsLayer stations={stationZones} focusId={focusId} />}
          {showScooters && <ScootersLayer scooters={scootersForMap} />}

          {startPoint && (
            <Marker position={[startPoint.latitude, startPoint.longitude]}>
              <Popup>
                <strong>Start</strong>
                {trip?.scooter ? (
                  <>
                    <br />
                    Scooter: {trip.scooter}
                  </>
                ) : null}
              </Popup>
            </Marker>
          )}

          {endPoint && (
            <Marker position={[endPoint.latitude, endPoint.longitude]}>
              <Popup>
                <strong>Slut</strong>
              </Popup>
            </Marker>
          )}

          {startPoint && endPoint && (
            <Polyline
              positions={[
                [startPoint.latitude, startPoint.longitude],
                [endPoint.latitude, endPoint.longitude],
              ]}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

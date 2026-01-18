import { CircleMarker, Popup } from "react-leaflet";

function pointLatLng(geometry) {
    const coords = geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2) return null;
    const [lng, lat] = coords;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return [lat, lng];
    }

    export default function StationsLayer({ stations }) {
    const list = Array.isArray(stations) ? stations : [];

    return (
        <>
        {list.map((s, idx) => {
            const pos = pointLatLng(s?.geometry);
            if (!pos) return null;

            const key = s?._id ?? s?.name ?? `station-${idx}`;

            return (
            <CircleMarker
                key={String(key)}
                center={pos}
                radius={7}
                pathOptions={{ weight: 2, fillOpacity: 1 }}
            >
                <Popup>
                <div style={{ display: "grid", gap: "4px" }}>
                    <strong>{s?.name ?? "Station"}</strong>
                    <div>Stad: {s?.city ?? "—"}</div>
                </div>
                </Popup>
            </CircleMarker>
            );
        })}
        </>
    );
}

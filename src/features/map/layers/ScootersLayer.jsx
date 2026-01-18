import { CircleMarker, Popup } from "react-leaflet";

function statusColor(status) {
  const s = String(status || "").toLowerCase();
  if (s === "available") return "#00b963ff";
  if (s === "in use") return "#00adcfff";
  if (s === "charging") return "#e29b00ff";
  if (s === "maintenance") return "#ff0015ff";
  if (s === "off") return "#505050ff";
  return "#41464b";
}

function toLatLng(scooter) {
  const lat = scooter?.coordinates?.latitude;
  const lng = scooter?.coordinates?.longitude;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return [lat, lng];
}

function getKey(s) {
  return s?._id ?? s?.id ?? s?.name ?? `${s?.city ?? "x"}-${Math.random()}`;
}

export default function ScootersLayer({ scooters = [] }) {
  const list = Array.isArray(scooters) ? scooters : [];

  return (
    <>
      {list.map((s) => {
        const pos = toLatLng(s);
        if (!pos) return null;

        const key = getKey(s);
        const color = statusColor(s?.status);

        return (
          <CircleMarker
            key={String(key)}
            center={pos}
            radius={8}
            pathOptions={{ color, weight: 2, fillOpacity: 0.65 }}
          >
            <Popup>
              <div style={{ display: "grid", gap: "4px" }}>
                <strong>{s?.name ?? "Scooter"}</strong>
                <div>ID: {s?._id ?? "—"}</div>
                <div>Status: {s?.status ?? "Unknown"}</div>
                <div>
                  Batteri:{" "}
                  {typeof s?.battery === "number" ? `${Math.round(s.battery)}%` : "—"}
                </div>
                <div>
                  Hastighet:{" "}
                  {typeof s?.speed === "number" ? `${s.speed} km/h` : "—"}
                </div>
                <div>Stad: {s?.city ?? "—"}</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

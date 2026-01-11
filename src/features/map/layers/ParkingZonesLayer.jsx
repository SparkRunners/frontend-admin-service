import { GeoJSON } from "react-leaflet";

function zoneStyle(type) {
    const t = String(type || "").toLowerCase();
    if (t === "parking") return { color: "#004625ff", weight: 2, fillOpacity: 0.5 };
    if (t === "slow-speed") return { color: "#7c5d00ff", weight: 2, fillOpacity: 0.5 };
    if (t === "no-go") return { color: "#aa000eff", weight: 2, fillOpacity: 0.5 };
    return { color: "#41464b", weight: 2, fillOpacity: 0.08 };
    }

    export default function ParkingZonesLayer({ zones }) {
    const list = Array.isArray(zones) ? zones : [];

    const polygonFeatures = list
        .filter((z) => z?.geometry?.type === "Polygon")
        .map((z) => ({
        type: "Feature",
        properties: {
            name: z?.name,
            type: z?.type,
            city: z?.city,
            rules: z?.rules,
        },
        geometry: z.geometry,
        }));

    if (polygonFeatures.length === 0) return null;

    return (
        <GeoJSON
        data={{ type: "FeatureCollection", features: polygonFeatures }}
        style={(f) => zoneStyle(f?.properties?.type)}
        onEachFeature={(feature, layer) => {
            const props = feature?.properties || {};
            const rules = props.rules || {};
            const html = `
            <div style="display:grid;gap:4px;">
                <strong>${props.name ?? "Zon"}</strong>
                <div>Typ: ${props.type ?? "—"}</div>
                <div>Stad: ${props.city ?? "—"}</div>
                <div>Parkering: ${rules.parkingAllowed ? "Ja" : "Nej"}</div>
                <div>Körning: ${rules.ridingAllowed ? "Ja" : "Nej"}</div>
                <div>Maxhastighet: ${
                typeof rules.maxSpeed === "number" ? rules.maxSpeed : "—"
                }</div>
            </div>
            `;
            layer.bindPopup(html);
        }}
        />
    );
}

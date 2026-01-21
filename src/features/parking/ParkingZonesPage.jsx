import { useEffect, useMemo, useState } from "react";
import { fetchParkingZones } from "../../api/parkingZones";
import { fetchPricing } from "../../api/pricing";

function makeKey(z, idx) {
  return z?._id ?? z?.name ?? `zone-${idx}`;
}

export default function ParkingZonesPage() {
  const [zones, setZones] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pricing, setPricing] = useState(null);
  const [pricingError, setPricingError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadAllForCities() {
      try {
        const data = await fetchParkingZones({});
        if (!alive) return;
        setAllZones(Array.isArray(data) ? data : []);
      } catch {
        if (!alive) return;
        setAllZones([]);
      }
    }

    loadAllForCities();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadPricing() {
      setPricingError("");
      try {
        const data = await fetchPricing();
        if (!alive) return;
        setPricing(data || null);
      } catch (err) {
        if (!alive) return;
        setPricing(null);
        setPricingError(err?.message || "Kunde inte hämta prissättning");
      }
    }

    loadPricing();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadFiltered() {
      setLoading(true);
      setError("");

      try {
        const params = city ? { city } : {};
        const data = await fetchParkingZones(params);
        if (!alive) return;
        setZones(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Kunde inte hämta parkeringszoner");
        setZones([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadFiltered();
    return () => {
      alive = false;
    };
  }, [city]);

  const cityOptions = useMemo(() => {
    const set = new Set();
    for (const z of allZones) {
      if (z?.city) set.add(z.city);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allZones]);

  const parkingFee =
    typeof pricing?.parkingFee === "number" ? pricing.parkingFee : null;

  return (
    <div>
      <h2>Parkeringszoner</h2>

      <div className="card" style={{ marginTop: "1rem" }}>
        {/* Top fee summary */}
        <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "baseline",
            }}
          >
            <strong>Avgifter</strong>
            {parkingFee !== null ? (
              <span>
                Parkeringsavgift utanför markerade zoner:{" "}
                <strong>{parkingFee} kr</strong>
              </span>
            ) : (
              <span>Parkeringsavgift: —</span>
            )}
          </div>
          {pricingError && <div style={{ color: "red" }}>{pricingError}</div>}
        </div>

        <div className="filters-row">
          <label>
            Stad
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Alla</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
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
                <th>Typ</th>
                <th>Maxhastighet</th>
                <th>Parkeringsavgift</th>
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
                    <td>{z?.type ?? "—"}</td>
                    <td>{z?.rules?.maxSpeed ?? "—"}</td>
                    <td>{parkingFee !== null ? `${parkingFee} kr` : "—"}</td>
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

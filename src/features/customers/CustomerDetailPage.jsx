import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchCustomerByIdAdmin,
  fetchCustomerTripsAdmin,
} from "../../api/users";
import { fetchZones } from "../../api/zones";
import { fetchStations } from "../../api/stations";
import { fetchPricing } from "../../api/pricing";
import { computeParkingAdjustment, parseCost } from "./parkingFees";

function fmtDate(d) {
  return d ? new Date(d).toLocaleString("sv-SE") : "—";
}

function paymentLabel(model) {
  return model === "monthly" ? "Månadsvis" : "Prepaid";
}

export default function CustomerDetailPage() {
  const { userId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [trips, setTrips] = useState([]);
  const [zones, setZones] = useState([]);
  const [stations, setStations] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      const c = await fetchCustomerByIdAdmin(userId);
      if (!alive) return;
      setCustomer(c);

      try {
        const z = await fetchZones();
        if (alive) setZones(Array.isArray(z) ? z : z?.zones || []);
      } catch {
        if (alive) setZones([]);
      }

      try {
        const s = await fetchStations();
        if (alive) setStations(Array.isArray(s) ? s : s?.stations || []);
      } catch {
        if (alive) setStations([]);
      }

      try {
        const p = await fetchPricing();
        if (alive) setPricing(p);
      } catch {
        if (alive)
          setPricing({
            freeParkingFee: 10,
            startFeeDiscountIfFromFreeToDefined: 2,
          });
      }

      try {
        const t = await fetchCustomerTripsAdmin(userId);
        if (!alive) return;
        setTrips(Array.isArray(t) ? t : t?.trips || []);
      } catch {
        if (!alive) return;
        setTrips([]);
      }

      if (alive) setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, [userId]);

  const tripsWithFees = useMemo(() => {
    return trips.map((t) => {
      const base = parseCost(t?.cost);
      const calc = computeParkingAdjustment(t, zones, stations, pricing);
      const adjusted = base + calc.adjustment;

      return {
        ...t,
        _baseCost: base,
        _adjustment: calc.adjustment,
        _adjustedCost: adjusted,
        _parkingTags: calc.tags,
        _endType: calc.endType,
      };
    });
  }, [trips, zones, stations, pricing]);

  if (loading) return <p>Laddar kund...</p>;
  if (!customer) return <p>Kund saknas.</p>;

  return (
    <div>
      <h2>Kunddetaljer</h2>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Kontoinformation</h3>
        <p>
          <strong>User ID:</strong> {customer.userId}
        </p>
        <p>
          <strong>Namn:</strong> {customer.name}
        </p>
        <p>
          <strong>E-post:</strong> {customer.email}
        </p>
        <p>
          <strong>Saldo:</strong> {customer.balance} SEK
        </p>
        <p>
          <strong>Status:</strong> {customer.active ? "Aktiv" : "Avstängd"}
        </p>
        <p>
          <strong>Betalningsmodell:</strong> {paymentLabel(customer.paymentModel)}
        </p>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Reshistorik</h3>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Avgifter nedan är beräknade i admin-UI baserat på position (fri parkering
          vs definierad parkering).
        </p>

        {tripsWithFees.length === 0 ? (
          <p>Ingen reshistorik.</p>
        ) : (
          <table className="scooter-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>Slut</th>
                <th>Stad</th>
                <th>Scooter</th>
                <th>Tid</th>
                <th>Bas</th>
                <th>Justering</th>
                <th>Totalt</th>
                <th>Parkering</th>
              </tr>
            </thead>
            <tbody>
              {tripsWithFees.map((t) => (
                <tr key={t.id}>
                  <td>{fmtDate(t.startTime)}</td>
                  <td>{fmtDate(t.endTime)}</td>
                  <td>{t?.startPosition?.city ?? "—"}</td>
                  <td>{t?.scooter ?? "—"}</td>
                  <td>{t?.duration ?? "—"}</td>
                  <td>{t._baseCost} kr</td>
                  <td>{t._adjustment === 0 ? "0 kr" : `${t._adjustment} kr`}</td>
                  <td>{t._adjustedCost} kr</td>
                  <td>{t._parkingTags.join(" • ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

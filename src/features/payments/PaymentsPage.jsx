import { useEffect, useState } from "react";
import { fetchPayments } from "../../api/payments";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const list = await fetchPayments({ city });
      setPayments(list);
    } catch (e) {
      setError(e.message || "Kunde inte hämta betalningar");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="admin-main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Betalningar</h2>
          <p style={{ margin: "0.25rem 0 0" }}>Alla betalningar (admin)</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12 }}>Stad</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="t.ex. Malmö" />
          </div>
          <button type="button" onClick={load}>Filtrera</button>
        </div>
      </div>

      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!loading && !error && payments.length === 0 && <p>Inga betalningar hittades.</p>}

      {!loading && !error && payments.length > 0 && (
        <table style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th align="left">ID</th>
              <th align="left">User</th>
              <th align="left">Amount</th>
              <th align="left">Type</th>
              <th align="left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const id = p._id || p.id;
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{p.userId || "-"}</td>
                  <td>{p.amount ?? "-"}</td>
                  <td>{p.type || p.method || "-"}</td>
                  <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

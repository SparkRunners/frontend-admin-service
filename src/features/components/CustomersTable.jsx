import { useState } from "react";
import { Link } from "react-router-dom";
import { setCustomerActiveAdmin } from "../../api/users.js";

function fmtDate(d) {
  return d ? new Date(d).toLocaleString("sv-SE") : "—";
}

export default function CustomersTable({ customers, setCustomers }) {
  const [busyId, setBusyId] = useState(null);

  async function toggle(customer) {
    const next = !customer.active;

    setCustomers((prev) =>
      prev.map((c) =>
        c.userId === customer.userId ? { ...c, active: next } : c
      )
    );

    setBusyId(customer.userId);
    await setCustomerActiveAdmin(customer.userId, next);
    setBusyId(null);
  }

  return (
    <table className="scooter-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Namn</th>
          <th>E-post</th>
          <th>Status</th>
          <th>Saldo</th>
          <th>Betalning</th>
          <th>Skapad</th>
          <th>Åtgärd</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.userId}>
            <td>
            <Link to={`/customers/${c.userId}`}>{c.userId}</Link>
            </td>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.active ? "Aktiv" : "Avstängd"}</td>
            <td>{c.balance} SEK</td>
            <td>{c.paymentModel}</td>
            <td>{fmtDate(c.createdAt)}</td>
            <td>
              <button
                className="btn"
                disabled={busyId === c.userId}
                onClick={() => toggle(c)}
              >
                {busyId === c.userId
                  ? "Uppdaterar…"
                  : c.active
                  ? "Stäng av"
                  : "Aktivera"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

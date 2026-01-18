import { useEffect, useMemo, useState } from "react";
import { fetchCustomersAdmin } from "../../api/users";
import CustomersTable from "../components/CustomersTable";
import { connectSimulationSocket } from "../../api/simulationSocket";

function mapSimUser(u) {
  return {
    userId: String(u?._id ?? ""),
    name: u?.name ?? "—",
    email: u?.email ?? "—",
    balance: 1000,
    active: true,
    paymentModel: "sim",
    createdAt: null,
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [simCustomers, setSimCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [paymentModel, setPaymentModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchCustomersAdmin();
        if (!alive) return;
        setCustomers(data);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Kunde inte hämta kunder");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => (alive = false);
  }, []);

  useEffect(() => {
    const disconnect = connectSimulationSocket({
      onUsers: (users) => {
        setSimCustomers(users.map(mapSimUser));
      },
      onError: (err) => {
        console.log("simulation socket error", err?.message || err);
      },
    });

    return () => disconnect?.();
  }, []);

  const mergedCustomers = simCustomers.length > 0 ? simCustomers : customers;

  const filtered = useMemo(() => {
    let list = mergedCustomers;

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          String(c.userId || "").toLowerCase().includes(q) ||
          String(c.name || "").toLowerCase().includes(q) ||
          String(c.email || "").toLowerCase().includes(q)
      );
    }

    if (status) {
      list = list.filter((c) => (status === "active" ? c.active : !c.active));
    }

    if (paymentModel) {
      list = list.filter((c) => (c.paymentModel || "") === paymentModel);
    }

    return list;
  }, [mergedCustomers, query, status, paymentModel]);

  return (
    <div>
      <h2>Kunder</h2>

      <div className="card">
        <div className="filters-row">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Alla</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Avstängd</option>
            </select>
          </label>

          <label>
            Betalningsmodell
            <select value={paymentModel} onChange={(e) => setPaymentModel(e.target.value)}>
              <option value="">Alla</option>
              <option value="prepaid">Prepaid</option>
              <option value="monthly">Månadsvis</option>
              <option value="sim">Sim</option>
            </select>
          </label>

          <label>
            Sök
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Namn, e-post, userId"
            />
          </label>
        </div>

        {loading && <p>Laddar kunder...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && <CustomersTable customers={filtered} setCustomers={setCustomers} />}
      </div>
    </div>
  );
}

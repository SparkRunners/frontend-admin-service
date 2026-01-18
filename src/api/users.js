import { apiFetch } from "./client";
import { endpoints } from "./endpoints";
import { authFetch } from "./authClient";

const USE_MOCK = false;

function normalizeAuthUsers(json) {
  return Array.isArray(json) ? json : (json?.users || []);
}

export async function fetchCustomersAdmin() {
  if (USE_MOCK) return [];

  const authUsers = normalizeAuthUsers(await authFetch("/users", { method: "GET" }));
  const enriched = [];
  for (const u of authUsers) {
    try {
      const biz = await apiFetch(`${endpoints.users}/${u._id}`, { method: "GET" });

      enriched.push({
        userId: u._id,
        email: u.email,
        name: biz?.name || u.username || "—",
        balance: typeof biz?.balance === "number" ? biz.balance : 0,
        active: typeof biz?.active === "boolean" ? biz.active : true,
        createdAt: biz?.createdAt || null,
        paymentModel: "unknown",
        role: u.role,
        username: u.username,
      });
    } catch {
      enriched.push({
        userId: u._id,
        email: u.email,
        name: u.username || "—",
        balance: 0,
        active: true,
        createdAt: null,
        paymentModel: "unknown",
        role: u.role,
        username: u.username,
      });
    }
  }

  return enriched;
}

export async function fetchCustomerByIdAdmin(userId) {
  const list = await fetchCustomersAdmin();
  return list.find((u) => String(u.userId) === String(userId)) || null;
}

export async function fetchCustomerTripsAdmin(userId) {
  if (!userId) return [];

  const json = await apiFetch(endpoints.adminRides, {
    method: "GET",
    params: { userId, limit: 100 },
  });

  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.rides)) return json.rides;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

export async function setCustomerActiveAdmin(userId, active) {
  if (!userId) throw new Error("userId saknas");

  return { ok: true, userId, active };
}


import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchRides() {
  const json = await apiFetch(endpoints.rentHistory, { method: "GET" });
  return Array.isArray(json?.trips) ? json.trips : [];
}

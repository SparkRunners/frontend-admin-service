import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchZones(params = {}) {
  const data = await apiFetch(endpoints.zones, { params });
  return Array.isArray(data) ? data : (data.zones || data.items || []);
}

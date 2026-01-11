import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchStations(params = {}) {
  const data = await apiFetch(endpoints.zones, {
    params: { ...params, type: "charging" },
  });

  const zones = Array.isArray(data) ? data : (data.zones || data.items || []);
  return zones;
}

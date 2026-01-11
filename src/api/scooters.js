import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchScooters(params = {}) {
  const data = await apiFetch(endpoints.scooters, {
    params: {
      city: params.city,
      status: params.status,
    },
  });

  return Array.isArray(data) ? data : (data.items || data.scooters || []);
}

export async function fetchStatus() {
  return await apiFetch("/api/v1/status");
}

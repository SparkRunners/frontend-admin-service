import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchParkingZones(params = {}) {
  const data = await apiFetch(endpoints.parkingZones, {
    params: {
      ...params,
      type: "parking",
    },
  });

  return Array.isArray(data) ? data : (data.zones || []);
}

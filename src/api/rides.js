import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function getRides({ city, status } = {}) {
  const data = await apiFetch(endpoints.rentHistory);

  const list = Array.isArray(data) ? data : (data.items || data.rides || data.trips || []);

  let filtered = list;

  if (city) {
    filtered = filtered.filter((r) => {
      const c =
        r?.startPosition?.city ||
        r?.endPosition?.city ||
        r?.city;
      return String(c || "").toLowerCase().includes(String(city).toLowerCase());
    });
  }

  if (status) {
    filtered = filtered.filter((r) =>
      String(r?.status || "").toLowerCase().includes(String(status).toLowerCase())
    );
  }

  return filtered;
}

export const fetchRides = getRides;

export async function getRideById(tripId) {
  if (!tripId) throw new Error("tripId saknas");
  return await apiFetch(`${endpoints.rentTrip}/${tripId}`);
}

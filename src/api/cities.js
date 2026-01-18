import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchCities() {
  const data = await apiFetch(endpoints.cities);
  return Array.isArray(data) ? data : (data.items || data.cities || []);
}

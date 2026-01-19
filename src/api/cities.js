import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchCities() {
  const data = await apiFetch(endpoints.cities);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.cities)) return data.cities;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

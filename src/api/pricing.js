import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function fetchPricing() {
  return apiFetch(endpoints.pricing, { method: "GET" });
}

export default { fetchPricing };

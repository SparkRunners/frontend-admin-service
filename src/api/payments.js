import { apiFetch } from "./client";
import { endpoints } from "./endpoints";

export async function getPayments({ city, from, to } = {}) {
  const data = await apiFetch(endpoints.adminPayments, { params: { city, from, to } });
  return Array.isArray(data) ? data : (data.items || data.payments || []);
}

export const fetchPayments = getPayments;

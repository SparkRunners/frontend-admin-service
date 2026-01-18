import { getAccessToken, clearTokens } from "../auth/token";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

function buildUrl(path) {
  if (!AUTH_URL) throw new Error("Missing VITE_AUTH_URL");

  const base = AUTH_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function authFetch(path, options = {}) {
  const token = getAccessToken();
  const headers = { ...(options.headers || {}) };

  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData = options.body instanceof FormData;
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(buildUrl(path), { ...options, headers });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  if (res.status === 401) {
    clearTokens();
    throw new Error("Unauthorized (401). Please log in again.");
  }

  if (!res.ok) {
    const msg =
      (typeof data === "object" && (data.error || data.message)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

import { getToken, clearToken } from "../auth/token";

const API_URL = import.meta.env.VITE_API_URL;

function buildUrl(path, params) {
  if (/^https?:\/\//i.test(path)) return path;

  const base = API_URL?.replace(/\/$/, "") || "";
  const p = path.startsWith("/") ? path : `/${path}`;

  if (!params || Object.keys(params).length === 0) return `${base}${p}`;

  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    qs.set(key, String(value));
  }

  const query = qs.toString();
  return query ? `${base}${p}?${query}` : `${base}${p}`;
}

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!text) return {};

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  return { raw: text };
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = buildUrl(path, options.params);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
  }

  const data = await parseResponse(res);

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (data?.raw ? String(data.raw).slice(0, 200) : "") ||
      `Request failed (${res.status})`;

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

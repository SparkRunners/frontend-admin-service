import { getToken } from "../auth/token";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

async function authFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${AUTH_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || "Request failed");
  return data;
}

export function fetchMe() {
  return authFetch("/users/me", { method: "GET" });
}

export function updateMe(payload) {
  return authFetch("/users/me", { method: "PUT", body: JSON.stringify(payload) });
}

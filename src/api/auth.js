import { setToken } from "./token";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

function extractToken(data) {
    if (!data) return null;
    if (typeof data === "string") return data;
    if (data.token) return data.token;
    if (data.accessToken) return data.accessToken;
    return null;
}

export async function login(email, password) {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Login failed");
    }

    const token = extractToken(data);
    if (!token) throw new Error("No token returned from server");

    setToken(token);
    return token;
}

export async function register(username, email, password, role) {
  const payload = { username, email, password };

  if (role) {
    payload.role = Array.isArray(role) ? role : [role]; // <-- force array
  }

  const res = await fetch(`${AUTH_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Register failed (${res.status})`);

  return data;
}

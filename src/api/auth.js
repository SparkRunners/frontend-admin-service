import { setToken } from "./token";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

function extractToken(data) {
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
        return data.token || data.accessToken || data.jwt || null;
    }
    return null;
}

export async function login(email, password) {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new Error(data?.error || `Login failed (${res.status})`);
    }

    const token = extractToken(data);
    if (!token) {
        throw new Error("No token returned from auth server");
    }

    setToken(token);
    return token;
}

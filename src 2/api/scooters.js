import { getToken } from "./token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchScooters(params = {}) {
    const urlParams = new URLSearchParams();

    if (params.city) urlParams.append("city", params.city);
    if (params.status) urlParams.append("status", params.status);

    const res = await fetch(`${API_URL}/api/v1/scooters?${urlParams.toString()}`, {
        headers: { ...authHeaders() }
    });

    if (!res.ok) {
        throw new Error(`Kunde inte hämta scooters (${res.status})`);
    }

    return res.json();
}

export async function fetchStatus() {
    const res = await fetch(`${API_URL}/api/v1/status`);
    if (!res.ok) throw new Error("Health check misslyckades");
    return res.json();
}

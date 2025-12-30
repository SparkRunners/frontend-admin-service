export function decodeJwt(token) {
    try {
        const part = token.split(".")[1];
        if (!part) return null;

        const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(json);
    } catch {
        return null;
    }
}

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "../api/token";

export default function OAuthCallback() {
    const nav = useNavigate();
    const [params] = useSearchParams();

    useEffect(() => {
        const token = params.get("token");
        if (token) {
            setToken(token);
            nav("/", { replace: true });
        } else {
            nav("/login?error=oauth", { replace: true });
        }
    }, [params, nav]);

    return <p>Loggar in...</p>;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../auth/token";

function parseParams() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : "";
  const query = window.location.search.startsWith("?")
    ? window.location.search.slice(1)
    : "";

  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(query);

  
  const accessToken =
    hashParams.get("accessToken") ||
    queryParams.get("accessToken") ||
    hashParams.get("token") ||
    queryParams.get("token");

  const refreshToken =
    hashParams.get("refreshToken") || queryParams.get("refreshToken");

  const error = hashParams.get("error") || queryParams.get("error");

  return { accessToken, refreshToken, error };
}

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { accessToken, refreshToken, error } = parseParams();

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!accessToken) {
      navigate("/login?error=missing_token", { replace: true });
      return;
    }

    setTokens({ accessToken, refreshToken });

    window.history.replaceState({}, document.title, "/");

    navigate("/", { replace: true });
  }, [navigate]);

  return <p>Signing you in…</p>;
}

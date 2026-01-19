const ACCESS_KEY = "admin_access_token";
const REFRESH_KEY = "admin_refresh_token";

export function setTokens({ accessToken, refreshToken } = {}) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(ACCESS_KEY, token);
}

export function getToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function clearToken() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem(ACCESS_KEY));
}

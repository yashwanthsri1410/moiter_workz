// src/utils/authManager.js
import axios from "axios";

export const AUTH_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_INTERVAL = 23 * 60 * 60 * 1000;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
let refreshTimer = null;
/* -------------------------------------------
   Axios instance with auto-retry on 401
-------------------------------------------- */
export const api = axios.create({
  baseURL: API_BASE_URL, // replace with your base URL
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add current access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry original request
      }
    }
    return Promise.reject(error);
  }
);

/* -------------------------------------------
   Save access + refresh token + Swagger auth
-------------------------------------------- */
export const saveAuthToken = (accessToken, refreshToken) => {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  // Swagger auto-authorize
  if (window.ui?.preauthorizeApiKey) {
    window.ui.preauthorizeApiKey("Bearer", accessToken);
  }

  // Start auto-refresh cycle (only after login)
  startAutoTokenRefresh();
};

/* -------------------------------------------
   Refresh access token using refreshToken
-------------------------------------------- */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_AUTH_API_BASE_URL}/api/AuthService/refresh-token`,
      { refreshToken }
    );

    const { accessToken } = response.data;
    if (accessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);

      // Update Swagger token
      if (window.ui?.preauthorizeApiKey) {
        window.ui.preauthorizeApiKey("Bearer", accessToken);
      }

      console.log("🔄 Access token refreshed successfully");
      return accessToken;
    }
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    stopAutoTokenRefresh();
    clearAuthToken();
    window.location.href = "/"; // redirect to login
    return null;
  }
};

/* -------------------------------------------
   Start auto-refresh interval
-------------------------------------------- */
export const startAutoTokenRefresh = () => {
  stopAutoTokenRefresh();
  refreshTimer = setInterval(async () => {
    await refreshAccessToken();
  }, REFRESH_INTERVAL);
};

/* -------------------------------------------
   Stop auto-refresh interval
-------------------------------------------- */
export const stopAutoTokenRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

/* -------------------------------------------
   Restore Swagger auth only (does NOT refresh immediately)
-------------------------------------------- */
export const restoreSwaggerAuth = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && window.ui?.preauthorizeApiKey) {
    window.ui.preauthorizeApiKey("Bearer", token);
    console.log("🔄 Swagger auth restored (refresh will happen later)");
  }
};

/* -------------------------------------------
   Clear all tokens + stop refresh + Swagger logout
-------------------------------------------- */
export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  stopAutoTokenRefresh();

  if (window.ui?.authActions?.logout) {
    window.ui.authActions.logout();
  }
};

/* -------------------------------------------
   On page reload: restore Swagger + start refresh interval
-------------------------------------------- */
window.addEventListener("load", () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    restoreSwaggerAuth();       // allow Swagger to use existing token (may be expired)
    startAutoTokenRefresh();    // token will refresh automatically after interval
    // console.log("🔁 Page reload: Swagger restored, refresh cycle started");
  }
});

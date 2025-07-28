import axios from "axios";

export const AUTH_HEADER = "Authorization";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const baseService = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

baseService.defaults.headers.common["X-App-Type-Remspace"] = "Web";
baseService.defaults.headers.common["lucid-app-version"] = "1.0.0";

export const setAuthHeader = (accessToken: string) => {
  baseService.defaults.headers.common[AUTH_HEADER] = `Bearer ${accessToken}`;
};

export default baseService;

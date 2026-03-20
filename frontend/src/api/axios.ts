import { useAuthStore } from "@/store/auth-store";
import axios from "axios";

const base_api = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: base_api,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token expired, redirecting to login...");
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    const customError = {
      ...error,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message,
    };
    return Promise.reject(customError);
  },
);

export default api;

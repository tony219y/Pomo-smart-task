import { useAuthStore } from "@/store/auth-store";
import axios, { type InternalAxiosRequestConfig } from "axios";

const base_api = process.env.NEXT_PUBLIC_BACKEND_URL;

type RetriableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

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
  async (error) => {
    const originalRequest = (error.config ?? {}) as RetriableRequest;
    const status = error.response?.status;
    const isRefreshRequest = String(originalRequest.url || "").includes(
      "/auth/refresh",
    );

    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${base_api}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken = res.data?.accessToken ?? null;

        if (!newToken) {
          throw error;
        }

        useAuthStore.getState().setAccessToken(newToken);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
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

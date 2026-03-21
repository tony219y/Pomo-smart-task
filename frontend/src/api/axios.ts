import { useAuthStore } from "@/store/auth-store";
import axios, { type InternalAxiosRequestConfig } from "axios";

const base_api = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: base_api,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

type RetriableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function flushQueue(token: string | null) {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
}

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
    const originalRequest = (error.config ?? {}) as RetriableRequest;
    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !String(originalRequest.url || "").includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      return axios
        .post(`${base_api}/auth/refresh`, {}, { withCredentials: true })
        .then((res) => {
          const newToken = res.data?.accessToken ?? null;
          useAuthStore.getState().setAccessToken(newToken);
          flushQueue(newToken);

          if (!newToken) {
            throw error;
          }

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((refreshError) => {
          flushQueue(null);
          useAuthStore.getState().logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
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

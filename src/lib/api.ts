import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { startNProgress, doneNProgress } from "./nprogress";
import authService from "../core/services/authService";
import { authKeys } from "../features/auth/queries";
import { queryClient } from "../main";
import { syncAuthHeaders } from "../main";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    startNProgress();
    return config;
  },
  (error: AxiosError) => {
    doneNProgress();
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => {
    doneNProgress();
    return response;
  },
  async (error: AxiosError) => {
    doneNProgress();
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const response = await authService.refreshToken();
        const newAccessToken = response.accessToken;
        localStorage.setItem("access_token", newAccessToken);
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        if (refreshError instanceof Error) {
          processQueue(refreshError, null);
        } else {
          processQueue(new Error("An unknown refresh error occurred"), null);
        }
        // Clear both API headers and localStorage for proper synchronization
        queryClient.setQueryData(authKeys.me, null);
        queryClient.removeQueries({ queryKey: authKeys.me });
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("access_token");
        syncAuthHeaders();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

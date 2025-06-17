import axios, { AxiosError } from "axios";
import { startNProgress, doneNProgress } from "./nprogress";
import authService from "../core/services/authService";
import { authKeys } from "../features/auth/queries";
import { queryClient } from "../main";

// --- This flag tracks if a token refresh is currently in progress ---
let isRefreshing = false;
// --- This queue holds requests that failed while the token was being refreshed ---
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: Error | null,
  token: string | null = null
): any => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Create the Axios Instance ---
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    startNProgress();
    return config;
  },
  (error) => {
    doneNProgress();
    return Promise.reject(error);
  }
);

// --- Response Interceptor (SINGLE INTERCEPTOR ONLY) ---
api.interceptors.response.use(
  (response) => {
    doneNProgress();
    return response;
  },
  async (error: AxiosError) => {
    doneNProgress();
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            (originalRequest as any).headers["Authorization"] =
              `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const response = await authService.refreshToken();
        const newAccessToken = response.accessToken;
        localStorage.setItem("access_token", newAccessToken); // 👈 Save refreshed token
        // Update default headers
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        // Update the original request headers
        (originalRequest as any).headers["Authorization"] =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        // Handle the refresh error properly
        if (refreshError instanceof Error) {
          processQueue(refreshError, null);
        } else {
          processQueue(new Error("An unknown refresh error occurred"), null);
        }

        // Clear user data and redirect to login
        queryClient.setQueryData(authKeys.me, null);
        queryClient.removeQueries({ queryKey: authKeys.me });
        delete api.defaults.headers.common["Authorization"];

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

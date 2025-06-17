// import { api } from "./api";
// import authService from "../core/services/authService";

// class AuthManager {
//   private accessToken: string | null = null;
//   private refreshPromise: Promise<any> | null = null;

//   setToken(token: string) {
//     this.accessToken = token;
//     console.log("Token set:", !!token);
//   }

//   getToken() {
//     return this.accessToken;
//   }

//   clearToken() {
//     this.accessToken = null;
//     console.log("Token cleared");
//   }

//   isAuthenticated() {
//     const result = !!this.accessToken;
//     return result;
//   }
//   handle401Error(error: any) {
//     const originalRequest = error.config;

//     // --- FIX 1: PREVENT REFRESH LOOP ---
//     // If the request that failed was ALREADY the refresh-token endpoint,
//     // then the session is truly dead. Don't try to refresh again.
//     // Immediately log out and reject.
//     if (originalRequest.url.includes("/auth/refresh-token")) {
//       this.clearToken();
//       // Redirect in the component layer, not here, to avoid full page reloads.
//       // We just reject the promise.
//       return Promise.reject(error);
//     }

//     // If we are not already refreshing, start the refresh process.
//     if (!this.refreshPromise) {
//       this.refreshPromise = authService
//         .refreshToken()
//         .then((response) => {
//           const newAccessToken = response.accessToken;
//           this.setToken(newAccessToken);
//           // After successfully getting a new token, update the original request's header.
//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//           // And retry the original request with the updated config.
//           return api(originalRequest);
//         })
//         .catch((refreshError) => {
//           // If the refresh itself fails, clear everything and reject.
//           this.clearToken();
//           // The UI will react to the user state becoming null.
//           return Promise.reject(refreshError);
//         })
//         .finally(() => {
//           this.refreshPromise = null;
//         });
//     }

//     // Return the promise so that other requests can chain onto it.
//     return this.refreshPromise;
//   }
// }

// export const authManager = new AuthManager();

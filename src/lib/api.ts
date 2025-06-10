// src/lib/api.ts

import axios from "axios";

// 1. Create the Axios instance with a base configuration
export const api = axios.create({
  // The base URL of your API. This will be prepended to all request paths.
  // It's best to use an environment variable for this.
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",

  // Default headers that will be sent with every request
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Set up an interceptor to dynamically add the auth token to requests
// An interceptor is a function that "intercepts" a request before it's sent.
// api.interceptors.request.use(
//   (config) => {
//     // Get the token from localStorage (or wherever you store it).
//     // This function runs for EVERY request made with this Axios instance.
//     const token = localStorage.getItem("my_auth_token");

//     if (token) {
//       // If the token exists, add it to the Authorization header.
//       // The 'Bearer' prefix is a standard convention for JWTs.
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Return the modified config object for the request to proceed.
//     return config;
//   },
//   (error) => {
//     // Handle any errors that occur during request setup.
//     return Promise.reject(error);
//   }
// );

// // 3. (Optional but Recommended) Set up an interceptor to handle global response errors
// api.interceptors.response.use(
//   // If the response is successful (2xx status code), just return it.
//   (response) => response,

//   // If the response has an error...
//   (error) => {
//     // Check if the error is a 401 Unauthorized response.
//     // This typically means the user's token is invalid or expired.
//     if (error.response?.status === 401) {
//       // This is a great place to handle global logout logic.
//       console.log("Unauthorized request. Logging out...");

//       // Clear the invalid token from storage.
//       localStorage.removeItem("my_auth_token");

//       // Redirect the user to the login page.
//       // We use window.location.replace to do a hard refresh, which is often
//       // best for clearing all application state after a forced logout.
//       // This is one of the few acceptable uses of window.location in a SPA.
//       window.location.replace("/login");
//     }

//     // For all other errors, just pass them along.
//     return Promise.reject(error);
//   }
// );

// Note: We export the configured `api` instance, not the default `axios`.

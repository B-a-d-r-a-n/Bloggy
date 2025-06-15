import { api } from "./api";

// A simple in-memory store for the token.
// For production, you might consider a more robust solution.
let accessToken: string | null = null;

export const authUtils = {
  setToken: (token: string) => {
    accessToken = token;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
  clearToken: () => {
    accessToken = null;
    delete api.defaults.headers.common["Authorization"];
  },
  getToken: () => accessToken,
  isAuthenticated: () => !!accessToken, // The crucial part!
};

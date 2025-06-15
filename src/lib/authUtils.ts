import { api } from "./api";
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
  isAuthenticated: () => !!accessToken, 
};
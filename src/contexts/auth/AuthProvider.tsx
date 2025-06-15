import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import authService from "../../core/services/authService";
import { AuthContext } from "./AuthContext";
import type { User } from "../../core/types/user";
import type { ReactNode } from "@tanstack/react-router";
import { authUtils } from "../../lib/authUtils";
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      const accessToken = response.accessToken;
      const loggedInUser = response.data.user;
      authUtils.setToken(accessToken);
      setUser(loggedInUser);
    } catch (error) {
      console.log("No active session found or refresh failed.", error);
      authUtils.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  const login = async (loginInfo: Parameters<typeof authService.login>[0]) => {
    try {
      const response = await authService.login(loginInfo);
      const accessToken = response.accessToken;
      const loggedInUser = response.data.user;
      authUtils.setToken(accessToken);
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  const signup = async (
    signupInfo: Parameters<typeof authService.signup>[0]
  ) => {
    try {
      const response = await authService.signup(signupInfo);
      const accessToken = response.accessToken;
      const newUser = response.data.user;
      authUtils.setToken(accessToken);
      setUser(newUser);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(
        "Logout API call failed, but clearing session locally anyway:",
        error
      );
    } finally {
      authUtils.clearToken();
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
  };
  const value = { user, isLoading, login, signup, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

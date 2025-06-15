import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import authService from "../../core/services/authService";
import { AuthContext } from "./AuthContext";
import type { User } from "../../core/types/user";
import type { ReactNode } from "@tanstack/react-router";
import { authUtils } from "../../lib/authUtils";

// The provider component that will wrap your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true to check for an existing session

  /**
   * This function checks for an existing session when the app loads.
   * It uses the refreshToken method (or a similar /me endpoint) to verify the user.
   */
  // Inside your AuthProvider component...

  const checkAuthStatus = useCallback(async () => {
    try {
      // This call returns an object with the shape: { status, accessToken, data: { user } }
      const response = await authService.refreshToken();

      // --- THIS IS THE FIX ---
      // 1. Get the accessToken from the top level of the response.
      const accessToken = response.accessToken;
      // 2. Get the user object from the nested data property.
      const loggedInUser = response.data.user;

      // 3. Use your central utility to manage the token and headers.
      // This is more robust than setting the header directly here.
      authUtils.setToken(accessToken);

      // 4. Update the React state with the user object.
      setUser(loggedInUser);
    } catch (error) {
      // This block runs if refreshToken fails (e.g., returns a 401).
      // It's the expected "not logged in" state.
      console.log("No active session found or refresh failed.");

      // Use the central utility to clear any leftover state.
      authUtils.clearToken();
      setUser(null);
    } finally {
      // This always runs, ensuring the app knows it can now render the UI.
      setIsLoading(false);
    }
  }, []); // Empty dependency array is correct, this runs only once on mount.

  // The useEffect call remains the same and is correct.
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  /**
   * LOGIN FUNCTION
   * This function is exposed to the rest of the app via the context.
   * It calls your authService.login method.
   */ const login = async (
    loginInfo: Parameters<typeof authService.login>[0]
  ) => {
    try {
      // `response` has the shape: { status, accessToken, data: { user } }
      const response = await authService.login(loginInfo);

      // --- THIS IS THE FIX ---
      // 1. Get accessToken from the top level of the response.
      const accessToken = response.accessToken;
      // 2. Get the user from the nested data object.
      const loggedInUser = response.data.user;

      // Now you can use them correctly
      authUtils.setToken(accessToken);
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login failed:", error);
      // Re-throwing the error is important so the LoginForm can display a message to the user.
      throw error;
    }
  };

  /**
   * SIGNUP FUNCTION
   */
  // as it has the same response structure.
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

  /**
   * LOGOUT FUNCTION
   * Calls your authService.logout and clears the local state.
   */
  const logout = async () => {
    try {
      await authService.logout(); // This clears the httpOnly cookie on the backend
    } catch (error) {
      console.error(
        "Logout API call failed, but clearing session locally anyway:",
        error
      );
    } finally {
      // Always clear user state and auth headers regardless of API call success
      authUtils.clearToken(); // <-- Use the utility
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // The value that will be provided to all consuming components
  const value = { user, isLoading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import { useCallback, useEffect, useState } from "react";
// import { authManager } from "../../lib/AuthManager"; // <-- Use AuthManager
// import authService from "../../core/services/authService";
// import { AuthContext } from "./AuthContext";
// import type { User } from "../../core/types/user";
// import type { ReactNode } from "@tanstack/react-router";

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const checkAuthStatus = useCallback(async () => {
//     try {
//       const response = await authService.refreshToken();
//       authManager.setToken(response.accessToken);
//       setUser(response.data.user);
//     } catch (error) {
//       authManager.clearToken();
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   const login = async (loginInfo: any) => {
//     const response = await authService.login(loginInfo);
//     authManager.setToken(response.accessToken);
//     setUser(response.data.user);
//   };

//   const signup = async (signupInfo: any) => {
//     const response = await authService.signup(signupInfo);
//     authManager.setToken(response.accessToken);
//     setUser(response.data.user);
//   };

//   const logout = async () => {
//     try {
//       await authService.logout();
//     } finally {
//       authManager.clearToken();
//       setUser(null);
//     }
//   };
//   // --- THIS IS THE NEWLY ADDED/CONFIRMED FUNCTION ---
//   // It simply takes a user object and updates the state.
//   const updateUser = (updatedUser: User) => {
//     // We can also check if the current user is the one being updated for safety
//     if (user && user._id === updatedUser._id) {
//       setUser(updatedUser);
//     }
//   };

//   // Provide all functions and state in the context value
//   const value = {
//     user,
//     userId: user?._id || null,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     signup,
//     logout,
//     updateUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../../core/services/authService";
import type { User } from "../../core/types/user";
import { api } from "../../lib/api";
import { useNavigate } from "@tanstack/react-router";
export const authKeys = {
  me: ["auth", "me"] as const,
};
export const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: authKeys.me,
    queryFn: async () => {
      const authHeader = api.defaults.headers.common["Authorization"];
      if (!authHeader) {
        console.log("No auth header found, user not logged in");
        return null;
      }
      try {
        const response = await authService.getMe();
        console.log("Successfully fetched user:", response.data.user);
        return response.data.user;
      } catch (error: any) {
        console.log("getMe error:", error?.response?.status);
        if (error?.response?.status === 401) {
          delete api.defaults.headers.common["Authorization"];
          return null;
        }
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },

    refetchInterval: false, // Don't auto-refetch on interval
    networkMode: "online", // Only fetch when online
  });
};
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await authService.logout();
      console.log("Backend logout successful");
    } catch (error) {
      console.error("Backend logout error:", error);
    }
    delete api.defaults.headers.common["Authorization"];
    console.log("Authorization header cleared");
    queryClient.setQueryData(authKeys.me, null);
    console.log("User query data set to null");
    queryClient.removeQueries({ queryKey: authKeys.me });
    console.log("User queries removed from cache");
    await queryClient.cancelQueries({ queryKey: authKeys.me });
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return (
          queryKey.includes("auth") ||
          queryKey.includes("user") ||
          queryKey.includes("me") ||
          queryKey.includes("profile") ||
          queryKey.includes("articles")
        );
      },
      refetchType: "none",
    });
    console.log("Logout complete, navigating to login");
    navigate({ to: "/login", replace: true });
  };
  return logout;
};

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
      // Check if we have an authorization header first
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
          // Clear the invalid auth header
          delete api.defaults.headers.common["Authorization"];
          return null;
        }

        // For other errors, throw to trigger error state
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute - shorter for faster updates
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    // This is important - it will make the query more responsive
    refetchInterval: false, // Don't auto-refetch on interval
    networkMode: "online", // Only fetch when online
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // 1. Call backend logout to clear refresh token cookie
      await authService.logout();
      console.log("Backend logout successful");
    } catch (error) {
      console.error("Backend logout error:", error);
      // Continue with frontend cleanup even if backend fails
    }

    // 2. Remove authorization header immediately
    delete api.defaults.headers.common["Authorization"];
    console.log("Authorization header cleared");

    // 3. Clear the user query data immediately
    queryClient.setQueryData(authKeys.me, null);
    console.log("User query data set to null");

    // 4. Remove all instances of the user query from cache
    queryClient.removeQueries({ queryKey: authKeys.me });
    console.log("User queries removed from cache");

    // 5. Cancel any in-flight user queries
    await queryClient.cancelQueries({ queryKey: authKeys.me });

    // 6. Invalidate and refetch any auth-dependent queries
    await queryClient.invalidateQueries({
      predicate: (query) => {
        // This will invalidate any query that might depend on user being logged in
        const queryKey = query.queryKey;
        return (
          queryKey.includes("auth") ||
          queryKey.includes("user") ||
          queryKey.includes("me") ||
          queryKey.includes("profile") ||
          queryKey.includes("articles") // Add your protected resource keys here
        );
      },
      refetchType: "none", // Don't refetch, just mark as stale
    });

    // 7. Optional: Clear all queries if you want a complete reset
    // queryClient.clear();

    console.log("Logout complete, navigating to login");

    // 8. Navigate to login page
    navigate({ to: "/login", replace: true });
  };

  return logout;
};

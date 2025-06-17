import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "../features/auth/components/LoginForm";
import { authKeys } from "../features/auth/queries";
import { api } from "../lib/api";
export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context, location }) => {
    try {
      // Check if we have an authorization header first
      const authHeader = api.defaults.headers.common["Authorization"];
      if (!authHeader) {
        // No auth header, user is definitely not logged in
        return;
      }

      // Check if user is already logged in
      const user = await context.queryClient.fetchQuery({
        queryKey: authKeys.me,
        staleTime: 0, // Always fetch fresh data for this check
      });

      if (user) {
        // User is already logged in, redirect them away from login page
        const redirectTo =
          new URLSearchParams(location.search).get("redirect") || "/";
        console.log("User already logged in, redirecting to:", redirectTo);
        throw redirect({ to: redirectTo });
      }
    } catch (error) {
      // If there's an error fetching user (like 401), clear auth state and allow login
      console.log(
        "User not logged in or auth error, allowing access to login page:",
        error
      );
      delete api.defaults.headers.common["Authorization"];
      context.queryClient.setQueryData(authKeys.me, null);
    }
  },
  component: LoginPage,
});
function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-12">
      <LoginForm />
    </div>
  );
}

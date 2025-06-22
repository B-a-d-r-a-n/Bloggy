import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "../features/auth/components/LoginForm";
import { authKeys } from "../features/auth/queries";
import { api } from "../lib/api";
import { useRouteTitle } from "../hooks/usePageTitle";
export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context, location }) => {
    try {
      const authHeader = api.defaults.headers.common["Authorization"];
      if (!authHeader) {
        return;
      }
      const user = await context.queryClient.fetchQuery({
        queryKey: authKeys.me,
        staleTime: 0, // Always fetch fresh data for this check
      });
      if (user) {
        const redirectTo =
          new URLSearchParams(location.search).get("redirect") || "/";
        console.log("User already logged in, redirecting to:", redirectTo);
        throw redirect({ to: redirectTo });
      }
    } catch (error) {
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
  useRouteTitle("Login");
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-12">
      <LoginForm />
    </div>
  );
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "../features/auth/components/LoginForm";
import { authKeys } from "../features/auth/queries";
import { useRouteTitle } from "../hooks/usePageTitle";

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context, location }) => {
    // Only check if user is already logged in
    const user = context.queryClient.getQueryData(authKeys.me);
    if (user) {
      const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";
      throw redirect({ to: redirectTo });
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

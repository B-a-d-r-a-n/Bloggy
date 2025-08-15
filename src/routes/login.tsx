import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../features/auth/components/LoginForm";
import { useRouteTitle } from "../hooks/usePageTitle";

export const Route = createFileRoute("/login")({
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

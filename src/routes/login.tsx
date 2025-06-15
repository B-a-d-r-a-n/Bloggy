import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "../features/auth/components/LoginForm";
export const Route = createFileRoute("/login")({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isAuthenticated()) {
      throw redirect({
        to: "/",
        replace: true, 
        search: {
          redirect: location.href,
        },
      });
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
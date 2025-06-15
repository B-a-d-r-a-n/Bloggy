import { createFileRoute, redirect } from "@tanstack/react-router";
import SignupForm from "../features/auth/components/SignupForm";
export const Route = createFileRoute("/signup")({
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
  component: SignupPage,
});
function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-12">
      <SignupForm />
    </div>
  );
}
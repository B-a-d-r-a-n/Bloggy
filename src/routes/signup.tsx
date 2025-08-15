import { createFileRoute } from "@tanstack/react-router";
import SignupForm from "../features/auth/components/SignupForm";
import { useRouteTitle } from "../hooks/usePageTitle";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  useRouteTitle("Signup");
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-12">
      <SignupForm />
    </div>
  );
}

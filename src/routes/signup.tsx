import { createFileRoute, redirect } from "@tanstack/react-router";
import SignupForm from "../features/auth/components/SignupForm";
import { authKeys } from "../features/auth/queries";
export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    const user = context.queryClient.getQueryData(authKeys.me);

    if (user) {
      console.log("User is already logged in, redirecting from /signup");
      throw redirect({
        to: "/",
        replace: true,
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

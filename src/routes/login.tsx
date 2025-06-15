import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "../features/auth/components/LoginForm";

export const Route = createFileRoute("/login")({
  // This loader runs before the component renders.
  // If the user is already logged in, we redirect them away from the login page.
  beforeLoad: ({ context, location }) => {
    // --- THIS IS THE FIX ---
    // Call the synchronous `isAuthenticated` method that we defined in the router's context.
    if (context.auth.isAuthenticated()) {
      // If they are authenticated, redirect them away from the login page.
      throw redirect({
        to: "/",
        replace: true, // Or any other appropriate page
        // It's good practice to add a search param for context, e.g.,
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

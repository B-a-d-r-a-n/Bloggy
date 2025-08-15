import type { ReactNode } from "@tanstack/react-router";
import { useAuthInitialization } from "../../features/auth/queries";
import { useCurrentUser } from "../../features/auth/queries";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = false,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { isInitializing } = useAuthInitialization();
  const { data: user, isLoading } = useCurrentUser();

  // Show loading spinner while auth is initializing
  if (isInitializing || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // If auth is required but user is not logged in
  if (requireAuth && !user) {
    // This will be handled by the router's redirect logic
    return null;
  }

  // If user is logged in and trying to access auth pages, redirect
  if (
    user &&
    (window.location.pathname === "/login" ||
      window.location.pathname === "/signup")
  ) {
    window.location.href = "/";
    return null;
  }

  return <>{children}</>;
}

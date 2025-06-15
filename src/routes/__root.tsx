import React from "react";
import NavBar from "../components/ui/NavBar";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { FloatingCreateButton } from "../components/ui/FloatingCreateButton";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import type { AuthContextType } from "../contexts/auth/AuthContext";
import { useAuth } from "../hooks/useAuth";
import type { RouterContext } from "../router";

function App() {
  // Get the auth state using the hook.
  const auth = useAuth();

  return (
    <>
      <NavBar />
      <main className="p-2 w-[80%] mx-auto">
        {/* The Outlet now has access to the `auth` value from its parent context */}
        <Outlet />
      </main>
      <FloatingCreateButton />
      <TanStackRouterDevtools />
    </>
  );
}
function RootComponent() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

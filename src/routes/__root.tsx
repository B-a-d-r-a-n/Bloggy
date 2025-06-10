import React from "react";
import NavBar from "../components/ui/NavBar";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { QueryClient } from "@tanstack/react-query";
interface RouterContext {
  queryClient: QueryClient;
  // authService: AuthService
}
function RootComponent() {
  return (
    <>
      <div>
        <NavBar />
        <main className="p-2 w-[80%] mx-auto">
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtools />
    </>
  );
}
export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

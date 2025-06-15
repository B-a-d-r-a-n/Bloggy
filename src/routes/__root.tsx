import React from "react";
import NavBar from "../components/ui/NavBar";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { FloatingCreateButton } from "../components/ui/FloatingCreateButton";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import type { RouterContext } from "../router";
import { ScrollToTopButton } from "../components/ui/ScrollToTopButton";
function App() {
  return (
    <>
      <NavBar />
      <main className="p-2 w-[80%] mx-auto">
        {}
        <Outlet />
      </main>
      <FloatingCreateButton />
      <ScrollToTopButton />
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
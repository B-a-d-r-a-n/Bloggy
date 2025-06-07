// src/components/Root.tsx
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import NavBar from "./ui/NavBar";

export function MainLayout() {
  return (
    <>
      <div>
        <NavBar />
        <main className="p-4 w-[80%] mx-auto">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  );
}

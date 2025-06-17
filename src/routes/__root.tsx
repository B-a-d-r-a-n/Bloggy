import NavBar from "../components/ui/NavBar";
import Footer from "../components/layout/Footer";
import { FloatingCreateButton } from "../components/ui/FloatingCreateButton";
import { ScrollToTopButton } from "../components/ui/ScrollToTopButton";
import { Toaster } from "react-hot-toast";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

function RootComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Success toasts
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          // Error toasts
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          // Loading toasts
          loading: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#fff",
            },
          },
        }}
      />
      <NavBar />
      <main className="p-2 w-[80%] mx-auto flex-grow">
        <Outlet />
      </main>
      <ScrollToTopButton />
      <FloatingCreateButton />
      <Footer />
    </div>
  );
}
export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

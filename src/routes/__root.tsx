import NavBar from "../components/ui/NavBar";
import Footer from "../components/layout/Footer";
import { FloatingCreateButton } from "../components/ui/FloatingCreateButton";
import { ScrollToTopButton } from "../components/ui/ScrollToTopButton";
// import { Toaster } from "react-hot-toast";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { CustomToaster } from "../components/ui/CustomToaster";
import BackgroundBubbles from "../components/ui/BackgroundBubbles";
function RootComponent() {
  return (
    <div
      id="main-scroll-container"
      className="flex flex-col min-h-screen relative isolate"
    >
      <BackgroundBubbles />
      <CustomToaster />
      <NavBar />
      <main className="p-2 w-[95%] sm:w-[80%] mx-auto flex-grow">
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

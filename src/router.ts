// src/router.ts
import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";

import { MainLayout } from "./components/MainLayout";
import { HomePage } from "./features/home/HomePage";
import AboutPage from "./features/about/AboutPage";

const rootRoute = createRootRoute({
  component: MainLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

// 4. Create the router instance
export const router = createRouter({ routeTree });

// 5. Register the router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

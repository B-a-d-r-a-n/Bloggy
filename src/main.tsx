import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import authService from "./core/services/authService";
import { authUtils } from "./lib/authUtils";
import "./styles/index.css";
import { queryClient, type RouterContext } from "./router";
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: {
      isAuthenticated: authUtils.isAuthenticated,
    },
  } satisfies RouterContext,
  defaultPreload: "intent", 
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
async function startApp() {
  try {
    const response = await authService.refreshToken();
    authUtils.setToken(response.accessToken);
    console.log("Session restored successfully.");
  } catch (error) {
    console.log("No active session found.", error);
  }
  const rootElement = document.getElementById("root")!;
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
}
startApp();
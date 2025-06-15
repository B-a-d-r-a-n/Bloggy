import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import authService from "./core/services/authService";
import { authUtils } from "./lib/authUtils";
import "./styles/index.css";

// --- Import the pieces from router.ts ---
import { queryClient, type RouterContext } from "./router";

// This is the global type augmentation. It now lives here because
// this is where we call `createRouter`.
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: {
      isAuthenticated: authUtils.isAuthenticated,
    },
  } satisfies RouterContext, // Use `satisfies` for type checking
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// The async startup function remains the same
async function startApp() {
  try {
    const response = await authService.refreshToken();
    authUtils.setToken(response.accessToken);
    console.log("Session restored successfully.");
  } catch (error) {
    console.log("No active session found.", error);
  }

  // --- Router creation now happens here ---

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

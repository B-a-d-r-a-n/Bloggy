import { QueryClient } from "@tanstack/react-query";
// Import the type for the auth part of our context
// import { authUtils } from './lib/authUtils';

// 1. Define and export the QueryClient instance.
//    main.tsx will import this to use with its QueryClientProvider.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// 2. Define and export the RouterContext interface.
//    This serves as the single source of truth for the router's context shape.
//    main.tsx will use this to type the context it creates.
export interface RouterContext {
  queryClient: QueryClient;
  auth: {
    isAuthenticated: () => boolean;
  };
}

// 3. IMPORTANT: We no longer create and export the router instance here.
//    The router instance needs to be created *after* the initial auth check,
//    so its creation is moved to the `startApp` function in `main.tsx`.

// 4. The `declare module` block for type augmentation is now also moved.
//    It needs to be in the same file where `createRouter` is actually called.
//    So, this will be moved to `main.tsx`.

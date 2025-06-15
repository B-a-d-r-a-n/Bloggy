import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
    },
  },
});
export interface RouterContext {
  queryClient: QueryClient;
  auth: {
    isAuthenticated: () => boolean;
  };
}
// src/hooks/useAuth.ts (placeholder for demonstration)
export const useAuth = () => {
  // In your real app, this would come from your AuthContext
  const isAuthenticated = false; // <-- CHANGE THIS to false to see the other state
  const user = isAuthenticated
    ? {
        name: "Alice",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      }
    : null;
  const logout = () => console.log("Logging out...");

  return { isAuthenticated, user, logout };
};
